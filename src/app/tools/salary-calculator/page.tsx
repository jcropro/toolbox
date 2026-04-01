import type { Metadata } from "next";
import { SalaryCalculatorTool } from "./tool";

export const metadata: Metadata = {
  title: "Salary Calculator - Free Paycheck & Income Tax Estimator",
  description:
    "Convert salary between hourly, weekly, biweekly, monthly, and annual amounts. Estimate take-home pay after federal tax, state tax, 401k, and health insurance deductions. Free online calculator.",
  keywords: [
    "salary calculator",
    "paycheck calculator",
    "income tax estimator",
    "take home pay calculator",
    "hourly to salary",
    "annual to hourly",
    "net pay calculator",
    "401k calculator",
  ],
};

export default function SalaryCalculatorPage() {
  return <SalaryCalculatorTool />;
}
