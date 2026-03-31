import type { Metadata } from "next";
import { TypingTestTool } from "./tool";

export const metadata: Metadata = {
  title: "Typing Speed Test - Free Online WPM Test",
  description:
    "Test your typing speed with this free online WPM test. Measure words per minute and accuracy with real-time feedback and multiple difficulty levels.",
  keywords: [
    "typing speed test",
    "wpm test",
    "words per minute",
    "typing test online",
    "typing accuracy",
    "free typing test",
    "keyboard speed test",
  ],
};

export default function TypingTestPage() {
  return <TypingTestTool />;
}
