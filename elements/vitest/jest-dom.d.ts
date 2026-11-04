/**
 * Type augmentation adapting @testing-library/jest-dom matchers to vitest 5,
 * which changed the Assertion interface to two type parameters (return type
 * first, received value second). jest-dom's own `./vitest` types still declare
 * the old one-parameter form, which no longer merges (see
 * https://github.com/testing-library/jest-dom/issues/738,
 * https://github.com/testing-library/jest-dom/pull/742).
 *
 * Remove this file once jest-dom ships vitest 5 compatible types.
 */
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare module 'vitest' {
  interface Assertion<R, T> extends TestingLibraryMatchers<T, R> {}
  interface AsymmetricMatchersContaining extends TestingLibraryMatchers<any, any> {}
}
