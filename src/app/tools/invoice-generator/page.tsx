import type { Metadata } from "next";
import { InvoiceGeneratorTool } from "./tool";

export const metadata: Metadata = {
  title: "Invoice Generator - Free Online Invoice Maker",
  description:
    "Create professional invoices for free. Add line items, calculate totals with tax, and download as PDF. No signup required — runs entirely in your browser.",
  keywords: [
    "invoice generator",
    "free invoice maker",
    "online invoice",
    "create invoice",
    "invoice template",
    "download invoice pdf",
    "invoice calculator",
  ],
};

export default function InvoiceGeneratorPage() {
  return <InvoiceGeneratorTool />;
}
