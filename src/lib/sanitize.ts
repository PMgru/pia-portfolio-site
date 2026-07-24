// ─── Lightweight HTML sanitizer (no external dependency) ─────────────────────
//
// Goal: make admin-authored blog/page HTML safe to render with
// dangerouslySetInnerHTML. It strips dangerous constructs while keeping the
// formatting tags an author would actually use (h1-h6, p, ul, ol, li, a, img,
// strong, em, blockquote, table, br, hr, code, pre, span, div).
//
// NOTE: This is defense-in-depth for a trusted-admin content source, not a
// replacement for a full sanitizer on untrusted user content.

const ALLOWED_TAGS = new Set([
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr', 'span', 'div',
  'strong', 'b', 'em', 'i', 'u', 's', 'del', 'ins', 'mark', 'sub', 'sup', 'small',
  'ul', 'ol', 'li',
  'a', 'img',
  'blockquote', 'code', 'pre', 'kbd', 'samp', 'var',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
  'figure', 'figcaption', 'caption', 'colgroup', 'col',
]);

// Per-tag attribute allowlist (attribute names lowercased).
const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'title', 'target', 'rel']),
  img: new Set(['src', 'alt', 'title', 'width', 'height', 'loading']),
  '*': new Set(['style', 'class', 'id']), // cosmetic only
};

const DEFAULT_ATTRS = ALLOWED_ATTRS['*'];

// Drop obviously dangerous style keywords (expression(), javascript:, etc.)
const SAFE_STYLE = /expression\s*\(|javascript:|url\s*\(\s*['"]?\s*javascript:/i;

function sanitizeUrl(url: string): string {
  const trimmed = (url || '').trim();
  // Allow safe schemes and relative/anchor URLs only.
  if (/^(https?:|mailto:|tel:|\/|#|\.\/|\.\.\/|data:image\/)/i.test(trimmed)) {
    return trimmed;
  }
  return '';
}

function sanitizeStyle(style: string): string {
  if (SAFE_STYLE.test(style)) return '';
  return style;
}

/**
 * Sanitize an HTML fragment for safe rendering.
 * - Removes <script>, <style>, <iframe>, <object>, <embed>, <link>, <meta>, event handlers (on*), and javascript: URLs.
 * - Keeps only allowlisted tags + attributes.
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return '';
  let html = dirty;

  // 1. Remove entire dangerous blocks (tag + their inner content).
  html = html.replace(/<\s*(script|style|iframe|object|embed|noscript|template|frame|frameset|applet|base|link|meta|form|input|button|textarea|select|option)[\s\S]*?<\/\s*\1\s*>/gi, '');
  html = html.replace(/<\s*(script|style|iframe|object|embed|noscript|template|frame|frameset|applet|base|link|meta|form|input|button|textarea|select|option)\b[^>]*>/gi, '');

  // 2. Remove HTML comments (may hide IE conditional-comment exploits).
  html = html.replace(/<!--[\s\S]*?-->/g, '');

  // 3. Walk tags: drop disallowed tags (keep their children), strip bad attributes.
  html = html.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g, (whole, tag, attrStr) => {
    const tagName = tag.toLowerCase();
    if (!ALLOWED_TAGS.has(tagName)) {
      // Drop the tag itself but keep its inner content by returning an empty match.
      return '';
    }

    const closing = whole.trim().startsWith('</');
    if (closing) return `</${tagName}>`;

    // Parse attributes.
    const attrAllowed = ALLOWED_ATTRS[tagName] || DEFAULT_ATTRS;
    const attrRegex = /([a-zA-Z_:][a-zA-Z0-9_.:-]*)(?:\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
    let keptAttrs = '';
    let match: RegExpExecArray | null;
    while ((match = attrRegex.exec(attrStr)) !== null) {
      const attrName = match[1].toLowerCase();
      const value = match[3] ?? match[4] ?? match[5] ?? '';

      // Strip every event handler.
      if (attrName.startsWith('on')) continue;
      if (!attrAllowed.has(attrName) && !DEFAULT_ATTRS.has(attrName)) continue;

      let safeValue = value;
      if (attrName === 'href' || attrName === 'src') {
        safeValue = sanitizeUrl(value);
        if (!safeValue) continue;
      }
      if (attrName === 'style') {
        safeValue = sanitizeStyle(value);
        if (!safeValue) continue;
      }
      if (attrName === 'target') {
        // Allow only safe target values.
        if (safeValue.toLowerCase() !== '_blank' && safeValue.toLowerCase() !== '_self') continue;
      }

      keptAttrs += ` ${attrName}="${safeValue.replace(/"/g, '&quot;')}"`;
    }

    // Force safe rel on target=_blank links.
    if (tagName === 'a' && /target\s*=\s*"_blank"/i.test(keptAttrs) && !/rel\s*=/.test(keptAttrs)) {
      keptAttrs += ' rel="noopener noreferrer"';
    }

    return `<${tagName}${keptAttrs}>`;
  });

  return html;
}

/**
 * Plain-text version: strip ALL tags. Useful for excerpts, meta descriptions,
 * and any place we render user text inline.
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}
