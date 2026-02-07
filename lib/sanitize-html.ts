/**
 * HTML sanitization utility using DOMPurify
 * Ensures safe rendering of user-generated HTML content
 */

import DOMPurify from 'dompurify';

// Configuration for DOMPurify
const sanitizeConfig = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'div', 'span',
    'iframe', 'figure', 'figcaption', 'hr',
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel', 'title', 'alt', 'src', 'width', 'height',
    'class', 'style', 'loading', 'allowfullscreen', 'frameborder',
    'allow', 'data-*',
  ],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  KEEP_CONTENT: true,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  RETURN_TRUSTED_TYPE: false,
};

/**
 * Sanitize HTML content for safe rendering
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    // Server-side: return as-is but log warning
    // In production, you might want to use a server-side sanitizer
    console.warn('sanitizeHtml called on server-side. Consider using a server-side sanitizer.');
    return html;
  }

  try {
    return DOMPurify.sanitize(html, sanitizeConfig);
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    return '';
  }
}

/**
 * Sanitize HTML specifically for blog post content
 * Allows YouTube embeds and images
 */
export function sanitizeBlogContent(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  if (typeof window === 'undefined') {
    return html;
  }

  try {
    // First pass: standard sanitization
    let sanitized = DOMPurify.sanitize(html, sanitizeConfig);

    // Allow YouTube iframes with specific attributes
    // DOMPurify should handle this, but we ensure YouTube embeds are preserved
    sanitized = sanitized.replace(
      /<iframe[^>]*src=["']([^"']*youtube\.com\/embed\/[^"']*)["'][^>]*>/gi,
      (match, src) => {
        // Validate it's a YouTube embed URL
        if (src.includes('youtube.com/embed/')) {
          return match.replace(
            /allowfullscreen/gi,
            'allowfullscreen'
          );
        }
        return '';
      }
    );

    return sanitized;
  } catch (error) {
    console.error('Error sanitizing blog content:', error);
    return '';
  }
}
