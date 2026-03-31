import type { Metadata } from "next";
import { TextToBinaryTool } from "./tool";

export const metadata: Metadata = {
  title: "Text to Binary Converter - Free Online ASCII/Binary Tool",
  description:
    "Convert text to binary, binary to text, plus hex and octal representations. Free online ASCII/Binary converter with copy buttons.",
  keywords: [
    "text to binary",
    "binary to text",
    "ascii converter",
    "binary converter",
    "hex converter",
    "octal converter",
    "binary translator",
  ],
};

export default function TextToBinaryPage() {
  return <TextToBinaryTool />;
}
