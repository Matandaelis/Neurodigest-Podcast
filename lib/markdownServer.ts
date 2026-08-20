import { marked } from 'marked';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

export function markdownToSafeHtml(markdown: string): string {
  const rawHtml = marked.parse(markdown || '');
  const window = new JSDOM('').window as unknown as Window;
  const DOMPurify = createDOMPurify(window as any);
  return DOMPurify.sanitize(rawHtml, { ADD_ATTR: ['target'] });
}

export function sanitizeHtml(html: string): string {
  const window = new JSDOM('').window as unknown as Window;
  const DOMPurify = createDOMPurify(window as any);
  return DOMPurify.sanitize(html, { ADD_ATTR: ['target'] });
}
