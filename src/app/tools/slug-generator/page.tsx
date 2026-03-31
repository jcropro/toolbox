import type { Metadata } from "next";
import { SlugGeneratorTool } from "./tool";

export const metadata: Metadata = {
  title: "Slug Generator - Free Online URL Slug Creator",
  description:
    "Generate clean URL slugs from any text. Handles unicode, accented characters, and special characters. Choose separators, set max length, and copy with one click.",
  keywords: [
    "slug generator",
    "URL slug creator",
    "SEO slug",
    "URL friendly text",
    "permalink generator",
    "slug converter",
    "URL encoder",
  ],
};

export default function SlugGeneratorPage() {
  return <SlugGeneratorTool />;
}
