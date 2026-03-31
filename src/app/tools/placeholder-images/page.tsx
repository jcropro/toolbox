import type { Metadata } from "next";
import { PlaceholderImagesTool } from "./tool";

export const metadata: Metadata = {
  title: "Placeholder Image Generator - Free Lorem Picsum URLs",
  description:
    "Generate placeholder image URLs using Lorem Picsum. Set custom width, height, grayscale, and blur options. Copy URL, HTML, or Markdown. Free, no API key needed.",
  keywords: [
    "placeholder images",
    "lorem picsum",
    "placeholder image generator",
    "dummy images",
    "picsum photos",
    "placeholder url",
    "test images",
  ],
};

export default function PlaceholderImagesPage() {
  return <PlaceholderImagesTool />;
}
