import type { Metadata } from "next";
import { CharacterMapTool } from "./tool";

export const metadata: Metadata = {
  title: "Special Characters Map - Copy Unicode Symbols Online",
  description:
    "Browse and copy special characters, Unicode symbols, arrows, math symbols, currency signs, Greek letters, and more. Click any character to copy it instantly.",
  keywords: [
    "special characters",
    "unicode symbols",
    "character map",
    "copy symbols",
    "special symbols",
    "unicode characters",
    "arrows symbols",
    "math symbols",
    "currency symbols",
    "greek letters",
  ],
};

export default function CharacterMapPage() {
  return <CharacterMapTool />;
}
