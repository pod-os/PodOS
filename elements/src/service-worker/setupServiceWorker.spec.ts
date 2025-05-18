import { setupServiceWorker } from './index';
import { when } from 'jest-when';

describe('setupServiceWorker', () => {
  let mockServiceWorker: any;
  let mockGlobalCaches: any;
  beforeEach(() => {
    mockServiceWorker = {
      addEventListener: jest.fn(),
    };

    mockGlobalCaches = {
      open: jest.fn(),
      match: jest.fn(),
      keys: jest.fn(),
      delete: jest.fn(),
    } as unknown as CacheStorage;

    // noinspection JSConstantReassignment
    global.caches = mockGlobalCaches;
    global.fetch = jest.fn();
  });

  it('registers event listeners', () => {
    setupServiceWorker(mockServiceWorker, 'irrelevant', 'irrelevant');

    expect(mockServiceWorker.addEventListener).toHaveBeenCalledWith('install', expect.any(Function));
    expect(mockServiceWorker.addEventListener).toHaveBeenCalledWith('activate', expect.any(Function));
    expect(mockServiceWorker.addEventListener).toHaveBeenCalledWith('fetch', expect.any(Function));
  });

  it('caches initial files on install', async () => {
    const mockCache = { addAll: jest.fn() } as unknown as Cache;
    when(mockGlobalCaches.open as jest.Mock)
      .calledWith('test-cache')
      .mockResolvedValue(mockCache);

    setupServiceWorker(mockServiceWorker, 'test-cache', 'irrelevant', ['/index.html', '/manifest.json']);

    const installHandler = mockServiceWorker.addEventListener.mock.calls.find(call => call[0] === 'install')[1];

    await installHandler({ waitUntil: jest.fn() });

    expect(mockCache.addAll).toHaveBeenCalledWith(['/index.html', '/manifest.json']);
  });

  it('should handle fetch requests with cache-first strategy', async () => {
    const mockRequest = new Request('https://cdn.test.com/resource.js');
    const cachedResponse = new Response('cached response');
    when(mockGlobalCaches.match as jest.Mock)
      .calledWith(mockRequest)
      .mockResolvedValue(cachedResponse);

    setupServiceWorker(mockServiceWorker, 'test-cache', 'irrelevant');

    const fetchHandler = mockServiceWorker.addEventListener.mock.calls.find(call => call[0] === 'fetch')[1];

    const event = {
      request: mockRequest,
      respondWith: jest.fn(),
    };

    await fetchHandler(event);

    expect(event.respondWith).toHaveBeenCalled();
    expect(await event.respondWith.mock.calls[0][0]).toEqual(cachedResponse);
  });

  it('should clean up old caches on activate', async () => {
    mockGlobalCaches.keys.mockResolvedValue(['old-cache', 'new-cache']);

    setupServiceWorker(mockServiceWorker, 'new-cache', 'irrelevant');

    const activateHandler = mockServiceWorker.addEventListener.mock.calls.find(call => call[0] === 'activate')[1];

    await activateHandler({ waitUntil: jest.fn() });

    expect(mockGlobalCaches.delete).toHaveBeenCalledWith('old-cache');
    expect(mockGlobalCaches.delete).not.toHaveBeenCalledWith('new-cache');
  });

  it('caches files from CDN when fetched from network', async () => {
    const mockRequest = new Request('https://cdn.example.com/resource.js');
    const networkResponse = new Response('network response');
    const mockCache = { put: jest.fn() } as unknown as Cache;

    when(mockGlobalCaches.match as jest.Mock)
      .calledWith(mockRequest)
      .mockResolvedValue(null);

    when(global.fetch as jest.Mock)
      .calledWith(expect.any(Request))
      .mockResolvedValue(networkResponse);

    when(mockGlobalCaches.open as jest.Mock)
      .calledWith('test-cache')
      .mockResolvedValue(mockCache);

    setupServiceWorker(mockServiceWorker, 'test-cache', 'https://cdn.example.com');

    const fetchHandler = mockServiceWorker.addEventListener.mock.calls.find(call => call[0] === 'fetch')[1];

    const event = {
      request: mockRequest,
      respondWith: jest.fn(),
    };

    await fetchHandler(event);
    // Allow putInCache to complete
    await new Promise(process.nextTick);

    expect(mockCache.put).toHaveBeenCalledWith(mockRequest, expect.any(Response));
    expect(event.respondWith).toHaveBeenCalled();
  });
});
