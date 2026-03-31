import type { Metadata } from "next";
import { MarkdownToHtmlTool } from "./tool";

export const metadata: Metadata = {
  title: "Markdown to HTML - Free Online Markdown Converter",
  description:
    "Convert Markdown to HTML in real-time. Supports headers, bold, italic, lists, links, code blocks, and blockquotes. Free online markdown converter.",
  keywords: [
    "markdown to html",
    "markdown converter",
    "markdown preview",
    "md to html",
    "online markdown editor",
    "markdown parser",
  ],
};

export default function MarkdownToHtmlPage() {
  return <MarkdownToHtmlTool />;
}
