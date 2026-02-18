/**
 * Accessibility (a11y) utilities and helpers
 * Helps implement WCAG 2.1 compliance
 */

/**
 * Manage focus trap for modals and dropdowns
 * @param {React.RefObject} containerRef - The container ref to trap focus
 * @param {Function} callback - Cleanup callback
 */
export const useFocusTrap = (containerRef, isActive = true) => {
  const handleKeyDown = (e) => {
    if (!isActive || e.key !== 'Tab' || !containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  return handleKeyDown;
};

/**
 * Generate unique IDs for accessibility
 * @param {string} prefix - ID prefix
 * @returns {string} - Unique ID
 */
let idCounter = 0;
export const generateId = (prefix = 'id') => {
  return `${prefix}-${++idCounter}-${Date.now()}`;
};

/**
 * Announce messages to screen readers
 * @param {string} message - Message to announce
 * @param {'polite' | 'assertive'} priority - Announcement priority
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcer = document.createElement('div');
  announcer.setAttribute('role', 'status');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.textContent = message;
  document.body.appendChild(announcer);

  setTimeout(() => announcer.remove(), 1000);
};

/**
 * Skip to main content link
 * Used for keyboard navigation
 */
export const createSkipLink = () => {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-to-main-content';
  skipLink.textContent = 'Skip to main content';
  return skipLink;
};

/**
 * Check if device prefers reduced motion
 * @returns {boolean} - True if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get contrast ratio between two colors
 * @param {string} color1 - Hex or RGB color
 * @param {string} color2 - Hex or RGB color
 * @returns {number} - Contrast ratio (1-21)
 */
export const getContrastRatio = (color1, color2) => {
  const getLuminance = (color) => {
    const rgb = color.match(/\d+/g);
    if (!rgb) return 0;

    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;

    const luminance =
      0.2126 * (r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)) +
      0.7152 * (g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4)) +
      0.0722 * (b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4));

    return luminance;
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Test if colors have sufficient contrast
 * @param {string} color1 - Foreground color
 * @param {string} color2 - Background color
 * @param {string} level - 'AA' (4.5:1) or 'AAA' (7:1)
 * @returns {boolean} - True if contrast is sufficient
 */
export const hasGoodContrast = (color1, color2, level = 'AA') => {
  const ratio = getContrastRatio(color1, color2);
  return level === 'AAA' ? ratio >= 7 : ratio >= 4.5;
};

/**
 * Custom hook for managing keyboard shortcuts
 * @param {Object} shortcuts - Object mapping key combinations to handlers
 */
import { useEffect } from 'react';

export const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = `${e.ctrlKey || e.metaKey ? 'Ctrl+' : ''}${
        e.shiftKey ? 'Shift+' : ''
      }${e.altKey ? 'Alt+' : ''}${e.key.toUpperCase()}`;

      if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key]();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

export default {
  useFocusTrap,
  generateId,
  announceToScreenReader,
  createSkipLink,
  prefersReducedMotion,
  getContrastRatio,
  hasGoodContrast,
  useKeyboardShortcuts,
};
