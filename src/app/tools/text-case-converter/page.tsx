import type { Metadata } from "next";
import { TextCaseConverterTool } from "./tool";

export const metadata: Metadata = {
  title: "Text Case Converter - Free Online Case Changer Tool",
  description:
    "Convert text between UPPERCASE, lowercase, Title Case, camelCase, PascalCase, snake_case, kebab-case, and more. Free online case converter.",
  keywords: [
    "text case converter",
    "uppercase converter",
    "lowercase converter",
    "title case",
    "camelCase converter",
    "snake_case",
    "kebab-case",
    "case changer",
  ],
};

export default function TextCaseConverterPage() {
  return <TextCaseConverterTool />;
}
