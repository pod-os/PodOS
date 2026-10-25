import DOMPurify from 'dompurify';

export function sanitizeHtmlTool(htmlToolFragment: string) {
  return DOMPurify.sanitize(htmlToolFragment, { ADD_TAGS: ['pos-label'] });
}
