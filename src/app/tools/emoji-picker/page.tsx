import type { Metadata } from "next";
import { EmojiPickerTool } from "./tool";

export const metadata: Metadata = {
  title: "Emoji Picker - Search & Copy Emojis Online",
  description:
    "Browse and search hundreds of emojis by category. Click to copy any emoji instantly. View emoji names and Unicode code points. Free online emoji picker.",
  keywords: [
    "emoji picker",
    "emoji search",
    "copy emoji",
    "emoji list",
    "emoji unicode",
    "emoji keyboard",
    "emoji finder",
    "emoji code point",
  ],
};

export default function EmojiPickerPage() {
  return <EmojiPickerTool />;
}
