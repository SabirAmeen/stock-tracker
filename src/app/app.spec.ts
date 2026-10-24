import { describe, it, expect } from 'vitest';
import { App } from './app';

describe('App Component', () => {
  it('should be created', () => {
    const app = new App();
    expect(app).toBeTruthy();
  });
});
