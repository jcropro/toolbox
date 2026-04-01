import type { Metadata } from "next";
import { MetaTagsTool } from "./tool";

export const metadata: Metadata = {
  title: "Meta Tag Generator - Free SEO Meta Tags Creator",
  description:
    "Generate SEO-optimized meta tags, Open Graph tags, and Twitter Card tags for your website. Live Google search preview included. Free online tool.",
  keywords: [
    "meta tag generator",
    "seo meta tags",
    "open graph generator",
    "twitter card generator",
    "html meta tags",
    "seo tools",
    "meta description generator",
  ],
};

export default function MetaTagsPage() {
  return <MetaTagsTool />;
}
