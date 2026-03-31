"use client";

import { useState, useMemo } from "react";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseInline(text: string): string {
  let result = escapeHtml(text);

  // Code spans (backtick) - must come before bold/italic to avoid interference
  result = result.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Images ![alt](url)
  result = result.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" />'
  );

  // Links [text](url)
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2">$1</a>'
  );

  // Bold + italic ***text*** or ___text___
  result = result.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  result = result.replace(/___(.+?)___/g, "<strong><em>$1</em></strong>");

  // Bold **text** or __text__
  result = result.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  result = result.replace(/__(.+?)__/g, "<strong>$1</strong>");

  // Italic *text* or _text_
  result = result.replace(/\*(.+?)\*/g, "<em>$1</em>");
  result = result.replace(/_(.+?)_/g, "<em>$1</em>");

  // Strikethrough ~~text~~
  result = result.replace(/~~(.+?)~~/g, "<del>$1</del>");

  return result;
}

function parseMarkdown(md: string): string {
  const lines = md.split("\n");
  const htmlLines: string[] = [];
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let inList: "ul" | "ol" | null = null;

  function closeList() {
    if (inList) {
      htmlLines.push(inList === "ul" ? "</ul>" : "</ol>");
      inList = null;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Fenced code blocks
    if (line.trimStart().startsWith("```")) {
      if (!inCodeBlock) {
        closeList();
        inCodeBlock = true;
        codeBlockContent = [];
      } else {
        htmlLines.push("<pre><code>" + escapeHtml(codeBlockContent.join("\n")) + "</code></pre>");
        inCodeBlock = false;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      closeList();
      continue;
    }

    // Headers
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      closeList();
      const level = headerMatch[1].length;
      htmlLines.push(`<h${level}>${parseInline(headerMatch[2])}</h${level}>`);
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      closeList();
      htmlLines.push("<hr />");
      continue;
    }

    // Blockquote
    const blockquoteMatch = line.match(/^>\s?(.*)$/);
    if (blockquoteMatch) {
      closeList();
      htmlLines.push(`<blockquote>${parseInline(blockquoteMatch[1])}</blockquote>`);
      continue;
    }

    // Unordered list
    const ulMatch = line.match(/^[\s]*[-*+]\s+(.+)$/);
    if (ulMatch) {
      if (inList !== "ul") {
        closeList();
        htmlLines.push("<ul>");
        inList = "ul";
      }
      htmlLines.push(`<li>${parseInline(ulMatch[1])}</li>`);
      continue;
    }

    // Ordered list
    const olMatch = line.match(/^[\s]*\d+\.\s+(.+)$/);
    if (olMatch) {
      if (inList !== "ol") {
        closeList();
        htmlLines.push("<ol>");
        inList = "ol";
      }
      htmlLines.push(`<li>${parseInline(olMatch[1])}</li>`);
      continue;
    }

    // Regular paragraph
    closeList();
    htmlLines.push(`<p>${parseInline(line)}</p>`);
  }

  // Close any unclosed blocks
  if (inCodeBlock) {
    htmlLines.push("<pre><code>" + escapeHtml(codeBlockContent.join("\n")) + "</code></pre>");
  }
  closeList();

  return htmlLines.join("\n");
}

const SAMPLE_MARKDOWN = `# Welcome to Markdown

This is a **bold** and *italic* text example with a [link](https://example.com).

## Features

- Unordered list item
- Another item with \`inline code\`
- **Bold list item**

1. First ordered item
2. Second ordered item
3. Third ordered item

> This is a blockquote. It can contain **formatted** text.

### Code Block

\`\`\`
function hello() {
  console.log("Hello, world!");
}
\`\`\`

---

That's it! Start typing your own markdown on the left.`;

export function MarkdownToHtmlTool() {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [copied, setCopied] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  const html = useMemo(() => parseMarkdown(markdown), [markdown]);

  const handleCopyHtml = async () => {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Markdown to HTML Converter</h1>
      <p className="text-gray-600 mb-6">
        Write or paste Markdown in the editor and see the HTML output in real-time.
        Supports headers, bold, italic, lists, links, code blocks, blockquotes, and more.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setShowRaw(false)}
              className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${
                !showRaw
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setShowRaw(true)}
              className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${
                showRaw
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Raw HTML
            </button>
          </div>
          <button
            onClick={handleCopyHtml}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {copied ? "Copied!" : "Copy HTML"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Markdown input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Markdown
            </label>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="w-full h-[500px] border border-gray-300 rounded-md px-3 py-2 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your markdown here..."
              spellCheck={false}
            />
          </div>

          {/* Output */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {showRaw ? "HTML Source" : "Preview"}
            </label>
            {showRaw ? (
              <pre className="w-full h-[500px] border border-gray-300 rounded-md px-3 py-2 text-sm font-mono bg-gray-50 overflow-auto whitespace-pre-wrap">
                {html}
              </pre>
            ) : (
              <div
                className="w-full h-[500px] border border-gray-300 rounded-md px-3 py-2 text-sm bg-white overflow-auto prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>
    </div>
  );
}
