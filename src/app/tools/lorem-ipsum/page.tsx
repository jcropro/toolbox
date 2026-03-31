import type { Metadata } from "next";
import { LoremIpsumTool } from "./tool";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator - Free Placeholder Text Tool",
  description:
    "Generate lorem ipsum placeholder text by paragraphs, sentences, or words. Free online dummy text generator for designers and developers.",
  keywords: [
    "lorem ipsum generator",
    "placeholder text",
    "dummy text generator",
    "filler text",
    "lorem ipsum",
    "lipsum generator",
  ],
};

export default function LoremIpsumPage() {
  return <LoremIpsumTool />;
}
