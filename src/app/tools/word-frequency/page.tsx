import type { Metadata } from "next";
import { WordFrequencyTool } from "./tool";

export const metadata: Metadata = {
  title: "Word Frequency Counter - Free Online Text Analysis Tool",
  description:
    "Count word frequencies in any text online for free. Filter common words, toggle case sensitivity, and visualize results with bar charts. No data sent to any server.",
  keywords: [
    "word frequency counter",
    "word count",
    "text analysis",
    "word frequency analyzer",
    "count words online",
    "text statistics",
    "word cloud data",
  ],
};

export default function WordFrequencyPage() {
  return <WordFrequencyTool />;
}
