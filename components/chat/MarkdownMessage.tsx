"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

// Tailwind preflight strips default element styles, so each Markdown
// element gets explicit classes here. Raw HTML in the answer is not rendered.
const components: Components = {
  h1: ({ children }) => <h3 className="text-[16px] font-semibold text-on-surface mt-5 mb-2 first:mt-0">{children}</h3>,
  h2: ({ children }) => <h3 className="text-[15px] font-semibold text-on-surface mt-5 mb-2 first:mt-0">{children}</h3>,
  h3: ({ children }) => <h4 className="text-[14px] font-semibold text-on-surface mt-4 mb-2 first:mt-0">{children}</h4>,
  p: ({ children }) => <p className="my-2 first:mt-0 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1.5">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1.5">{children}</ol>,
  li: ({ children }) => <li className="pl-1 marker:text-on-surface-variant">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-on-surface">{children}</strong>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-outline-variant pl-3 my-2 text-on-surface-variant">{children}</blockquote>
  ),
  pre: ({ children }) => (
    <pre className="my-3 overflow-x-auto rounded-lg border border-outline-variant/60 bg-[#0B0B0C] p-3 text-[12.5px] leading-relaxed [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-on-surface">
      {children}
    </pre>
  ),
  code: ({ children, className }) => (
    <code className={`font-mono text-[12.5px] rounded bg-surface-container-high px-1.5 py-0.5 text-primary ${className ?? ""}`}>
      {children}
    </code>
  ),
  table: ({ children }) => (
    <div className="my-3 overflow-x-auto">
      <table className="w-full border-collapse text-[13px]">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border border-outline-variant px-3 py-1.5 text-left font-semibold">{children}</th>,
  td: ({ children }) => <td className="border border-outline-variant px-3 py-1.5 align-top">{children}</td>,
  hr: () => <hr className="my-4 border-outline-variant" />,
};

export default function MarkdownMessage({ content }: { content: string }) {
  return (
    <div className="font-body-md text-[14px] leading-relaxed break-words">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
