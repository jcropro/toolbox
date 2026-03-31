import type { Metadata } from "next";
import { TextRepeaterTool } from "./tool";

export const metadata: Metadata = {
  title: "Text Repeater - Repeat Text Online Free",
  description:
    "Repeat any text multiple times with custom separators. Free online text repeater tool with line numbers, copy to clipboard, and character count.",
  keywords: [
    "text repeater",
    "repeat text",
    "text multiplier",
    "repeat string",
    "duplicate text",
    "text repeater online",
    "copy paste repeater",
  ],
};

export default function TextRepeaterPage() {
  return <TextRepeaterTool />;
}
