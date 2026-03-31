import type { Metadata } from "next";
import { QrCodeGeneratorTool } from "./tool";

export const metadata: Metadata = {
  title: "QR Code Generator - Free Online QR Code Maker",
  description:
    "Generate QR codes for any text or URL instantly. Multiple sizes, free download. No signup required. Free online QR code generator.",
  keywords: [
    "qr code generator",
    "qr code maker",
    "create qr code",
    "qr code online",
    "free qr code",
    "url to qr code",
    "qr code creator",
  ],
};

export default function QrCodeGeneratorPage() {
  return <QrCodeGeneratorTool />;
}
