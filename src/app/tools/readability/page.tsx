import type { Metadata } from "next";
import { ReadabilityTool } from "./tool";

export const metadata: Metadata = {
  title: "Readability Score Checker - Free Text Readability Tool",
  description:
    "Analyze your text with Flesch Reading Ease, Flesch-Kincaid, Automated Readability Index, and Coleman-Liau scores. Get word count, sentence stats, and grade level recommendations for free.",
  keywords: [
    "readability score",
    "readability checker",
    "flesch reading ease",
    "flesch kincaid",
    "readability index",
    "coleman liau",
    "text analyzer",
    "grade level checker",
  ],
};

export default function ReadabilityPage() {
  return <ReadabilityTool />;
}
