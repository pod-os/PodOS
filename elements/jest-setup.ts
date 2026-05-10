/// <reference types="jest" />

// Mock localStorage for Node 26+ where it's not available during module initialization
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

jest.mock('@shoelace-style/shoelace/dist/components/icon/icon.js', () => ({}));
jest.mock('@shoelace-style/shoelace/dist/components/progress-bar/progress-bar.js', () => ({}));
jest.mock('@shoelace-style/shoelace/dist/components/skeleton/skeleton.js', () => ({}));
jest.mock('@shoelace-style/shoelace/dist/components/tooltip/tooltip.js', () => ({}));
jest.mock('@shoelace-style/shoelace/dist/components/menu/menu.js', () => ({}));
jest.mock('@shoelace-style/shoelace/dist/components/menu-item/menu-item.js', () => ({}));
jest.mock('@shoelace-style/shoelace/dist/components/divider/divider.js', () => ({}));
jest.mock('@shoelace-style/shoelace/dist/components/dropdown/dropdown.js', () => ({}));
