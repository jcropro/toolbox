import type { Metadata } from "next";
import { PrivacyPolicyTool } from "./tool";

export const metadata: Metadata = {
  title: "Privacy Policy Generator - Free Website Policy Template",
  description:
    "Generate a professional privacy policy for your website in seconds. Customize for cookies, analytics, email collection, payments, and third-party sharing. Free, no signup.",
  keywords: [
    "privacy policy generator",
    "privacy policy template",
    "free privacy policy",
    "website privacy policy",
    "GDPR privacy policy",
    "cookie policy",
    "privacy policy maker",
  ],
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyTool />;
}
