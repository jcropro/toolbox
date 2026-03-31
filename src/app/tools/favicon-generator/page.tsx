import type { Metadata } from "next";
import { FaviconGeneratorTool } from "./tool";

export const metadata: Metadata = {
  title: "Favicon Generator - Create Favicons from Text Online",
  description:
    "Generate favicons from text characters. Pick colors, adjust font size, preview at multiple sizes, and download as ICO or PNG. Free online favicon maker.",
  keywords: [
    "favicon generator",
    "favicon maker",
    "text to favicon",
    "favicon creator",
    "ico generator",
    "favicon from text",
    "website icon generator",
    "favicon download",
  ],
};

export default function FaviconGeneratorPage() {
  return <FaviconGeneratorTool />;
}
