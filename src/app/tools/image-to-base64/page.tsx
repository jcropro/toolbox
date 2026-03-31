import type { Metadata } from "next";
import { ImageToBase64Tool } from "./tool";

export const metadata: Metadata = {
  title: "Image to Base64 - Free Online Image Encoder Tool",
  description:
    "Convert images to Base64 data URIs or decode Base64 strings back to images. Drag and drop upload, preview, copy, and download. Free online tool.",
  keywords: [
    "image to base64",
    "base64 encoder",
    "base64 image",
    "data URI generator",
    "image encoder",
    "base64 to image",
    "convert image base64",
  ],
};

export default function ImageToBase64Page() {
  return <ImageToBase64Tool />;
}
