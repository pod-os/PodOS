import { expect, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

vi.mock('@shoelace-style/shoelace/dist/components/icon/icon.js', () => ({}));
vi.mock('@shoelace-style/shoelace/dist/components/progress-bar/progress-bar.js', () => ({}));
vi.mock('@shoelace-style/shoelace/dist/components/skeleton/skeleton.js', () => ({}));
vi.mock('@shoelace-style/shoelace/dist/components/tooltip/tooltip.js', () => ({}));
vi.mock('@shoelace-style/shoelace/dist/components/menu/menu.js', () => ({}));
vi.mock('@shoelace-style/shoelace/dist/components/menu-item/menu-item.js', () => ({}));
vi.mock('@shoelace-style/shoelace/dist/components/divider/divider.js', () => ({}));
vi.mock('@shoelace-style/shoelace/dist/components/dropdown/dropdown.js', () => ({}));
