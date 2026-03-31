import type { Metadata } from "next";
import { WordCounterTool } from "./tool";

export const metadata: Metadata = {
  title: "Word Counter - Free Online Character & Word Count Tool",
  description:
    "Count words, characters, sentences, and paragraphs instantly. Estimate reading time. Free online word counter tool with real-time updates.",
  keywords: [
    "word counter",
    "character counter",
    "sentence counter",
    "paragraph counter",
    "reading time calculator",
    "word count tool",
    "online word counter",
  ],
};

export default function WordCounterPage() {
  return <WordCounterTool />;
}
