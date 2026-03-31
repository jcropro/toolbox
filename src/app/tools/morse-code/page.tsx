import type { Metadata } from "next";
import { MorseCodeTool } from "./tool";

export const metadata: Metadata = {
  title: "Morse Code Translator - Text to Morse & Audio Player",
  description:
    "Translate text to Morse code and Morse code to text. Play audio beeps for dots and dashes using the Web Audio API. Free online tool.",
  keywords: [
    "morse code translator",
    "text to morse code",
    "morse code to text",
    "morse code audio",
    "morse code converter",
    "morse code player",
    "learn morse code",
  ],
};

export default function MorseCodePage() {
  return <MorseCodeTool />;
}
