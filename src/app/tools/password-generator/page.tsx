import type { Metadata } from "next";
import { PasswordGeneratorTool } from "./tool";

export const metadata: Metadata = {
  title: "Password Generator - Free Secure Random Password Tool",
  description:
    "Generate strong, random passwords instantly. Customize length, character types, and generate multiple passwords at once. Free and private.",
  keywords: [
    "password generator",
    "random password",
    "strong password",
    "secure password generator",
    "password tool",
    "generate password online",
  ],
};

export default function PasswordGeneratorPage() {
  return <PasswordGeneratorTool />;
}
