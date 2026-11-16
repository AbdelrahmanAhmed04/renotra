import { afterEach, describe, expect, it } from 'vitest';
import { bindLayoutEvents, header } from '../../src/components/layout.js';

afterEach(() => {
  document.body.innerHTML = '';
  document.body.classList.remove('menu-open');
});

describe('mobile navigation', () => {
  it('opens and closes once even when layout events are bound more than once', () => {
    document.body.innerHTML = header(null, '/');
    bindLayoutEvents();
    bindLayoutEvents();

    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.site-nav');

    toggle.click();
    expect(nav.classList.contains('open')).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(document.body.classList.contains('menu-open')).toBe(true);

    toggle.click();
    expect(nav.classList.contains('open')).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.body.classList.contains('menu-open')).toBe(false);
  });
});
