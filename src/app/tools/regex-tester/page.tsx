import type { Metadata } from "next";
import { RegexTesterTool } from "./tool";

export const metadata: Metadata = {
  title: "Regex Tester - Free Online Regular Expression Tester",
  description:
    "Test and debug regular expressions in real time. See matches highlighted, capture groups, and match details. Free online regex tester tool.",
  keywords: [
    "regex tester",
    "regular expression tester",
    "regex debugger",
    "regex matcher",
    "regex online",
    "regex pattern tester",
    "regex validator",
  ],
};

export default function RegexTesterPage() {
  return <RegexTesterTool />;
}
