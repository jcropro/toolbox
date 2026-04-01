import type { Metadata } from "next";
import { TextSimilarityTool } from "./tool";

export const metadata: Metadata = {
  title: "Text Similarity Checker - Free Online Comparison Tool",
  description:
    "Compare two texts and see similarity percentage, matching phrases, unique words, and common words highlighted. Uses Jaccard similarity analysis. Free online tool.",
  keywords: [
    "text similarity checker",
    "text comparison tool",
    "plagiarism checker",
    "text diff",
    "similarity percentage",
    "compare texts online",
    "duplicate content checker",
  ],
};

export default function TextSimilarityPage() {
  return <TextSimilarityTool />;
}
