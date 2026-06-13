import { beforeAll } from 'vitest';
import { defineCustomElements } from './loader';

beforeAll(() => {
  defineCustomElements();
});
