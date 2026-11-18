'use client';
// A fenced code block as a 10px framed panel (DESIGN.md: the file card): a bar with the fence's title or
// language and a pill Copy button, over the Shiki-highlighted code. An unlabelled fence renders plain in
// the same frame: a slimmer bar holding only the Copy pill, so the pill never covers the code.
import { useCopyButton } from 'fumadocs-ui/utils/use-copy-button';
import { useRef, type ComponentProps } from 'react';

type Props = ComponentProps<'pre'> & { title?: string; 'data-language'?: string };

const PLAIN = new Set(['plaintext', 'text', 'txt', 'plain']);

export function CodeFrame({ ref: _ref, title, 'data-language': language, className, children, ...props }: Props) {
  const pre = useRef<HTMLPreElement>(null);
  const [copied, onCopy] = useCopyButton(() => navigator.clipboard.writeText(pre.current?.textContent ?? ''));
  const lang = language && !PLAIN.has(language) ? language : undefined;
  const labelled = Boolean(title || lang);

  const copy = (
    <button type="button" className="code-frame__copy" onClick={onCopy} data-copied={copied || undefined} aria-live="polite">
      {copied ? (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m3.5 8.5 3 3 6-7" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <rect x="5" y="5" width="9" height="9" rx="2" />
          <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" />
        </svg>
      )}
      <span>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );

  return (
    <figure className="code-frame not-prose" data-labelled={labelled || undefined} dir="ltr">
      <div className="code-frame__bar">
        {labelled ? (
          <figcaption className="code-frame__title">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true">
              <path d="M3.5 1.5h6l3 3v10h-9z" />
              <path d="M9.5 1.5v3h3" />
            </svg>
            <span className="code-frame__name">{title ?? lang}</span>
            {title && lang && <span className="code-frame__lang">{lang}</span>}
          </figcaption>
        ) : (
          <span />
        )}
        {copy}
      </div>
      <pre ref={pre} {...props} className={`code-frame__pre ${className ?? ''}`} tabIndex={0}>
        {children}
      </pre>
    </figure>
  );
}
