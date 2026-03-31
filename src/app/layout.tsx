import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "ToolKit — Free Online Tools",
    template: "%s | ToolKit",
  },
  description:
    "100+ free online tools: text utilities, developer tools, generators, converters, and more. No signup required.",
  keywords: [
    "free online tools",
    "word counter",
    "json formatter",
    "password generator",
    "text tools",
    "developer tools",
    "online utilities",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* AdSense placeholder - replace with real ID after approval */}
        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossOrigin="anonymous"></script> */}
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
              ToolKit
            </Link>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
              <Link href="/category/text" className="hover:text-blue-600">Text Tools</Link>
              <Link href="/category/developer" className="hover:text-blue-600">Developer</Link>
              <Link href="/category/generators" className="hover:text-blue-600">Generators</Link>
              <Link href="/category/converters" className="hover:text-blue-600">Converters</Link>
              <Link href="/category/web" className="hover:text-blue-600">Web Tools</Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-white border-t border-gray-200 py-8 mt-12">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
            <p>Free online tools. No signup. No tracking. Just tools that work.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
