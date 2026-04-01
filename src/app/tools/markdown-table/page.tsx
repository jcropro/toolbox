import type { Metadata } from "next";
import { MarkdownTableTool } from "./tool";

export const metadata: Metadata = {
  title: "Markdown Table Generator - Free Online Table Creator",
  description:
    "Generate markdown tables with a visual grid editor. Set alignment per column, import CSV/TSV data, and copy the markdown output instantly.",
  keywords: [
    "markdown table generator",
    "markdown table",
    "table creator",
    "csv to markdown",
    "markdown editor",
    "github table",
    "markdown formatter",
    "table generator",
  ],
};

export default function MarkdownTablePage() {
  return <MarkdownTableTool />;
}
