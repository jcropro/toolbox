import type { Metadata } from "next";
import { LoanCalculatorTool } from "./tool";

export const metadata: Metadata = {
  title: "Loan Calculator - Free Mortgage & Payment Calculator",
  description:
    "Calculate monthly payments, total interest, and view a full amortization schedule for any loan or mortgage. Free online calculator with no sign-up required.",
  keywords: [
    "loan calculator",
    "mortgage calculator",
    "payment calculator",
    "amortization schedule",
    "interest calculator",
    "monthly payment calculator",
    "home loan calculator",
  ],
};

export default function LoanCalculatorPage() {
  return <LoanCalculatorTool />;
}
