import DomPurify from 'dompurify';

export interface SanitizedHtml {
  value: string;
}

export function sanitize(html: string): SanitizedHtml {
  return {
    value: DomPurify.sanitize(html, {
      ADD_TAGS: ['pos-rich-link', 'pos-image'],
      ADD_ATTR: ['uri'],
    }),
  };
}
