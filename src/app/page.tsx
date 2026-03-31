import Link from "next/link";

const tools = {
  "Text Tools": [
    { name: "Word Counter", href: "/tools/word-counter", desc: "Count words, characters, sentences, and paragraphs" },
    { name: "Text Case Converter", href: "/tools/text-case-converter", desc: "Convert text to uppercase, lowercase, title case, and more" },
    { name: "Lorem Ipsum Generator", href: "/tools/lorem-ipsum", desc: "Generate placeholder text for designs and layouts" },
    { name: "Slug Generator", href: "/tools/slug-generator", desc: "Create URL-friendly slugs from any text" },
    { name: "Diff Checker", href: "/tools/diff-checker", desc: "Compare two texts and find the differences" },
  ],
  "Developer Tools": [
    { name: "JSON Formatter", href: "/tools/json-formatter", desc: "Format, validate, and minify JSON data" },
    { name: "Base64 Encoder/Decoder", href: "/tools/base64", desc: "Encode and decode Base64 strings" },
    { name: "URL Encoder/Decoder", href: "/tools/url-encoder", desc: "Encode and decode URLs and query parameters" },
    { name: "Regex Tester", href: "/tools/regex-tester", desc: "Test regular expressions with real-time matching" },
    { name: "HTML Entity Encoder", href: "/tools/html-entities", desc: "Encode and decode HTML entities" },
    { name: "Markdown to HTML", href: "/tools/markdown-to-html", desc: "Convert Markdown text to clean HTML" },
    { name: "CSV to JSON", href: "/tools/csv-to-json", desc: "Convert CSV data to JSON format" },
  ],
  Generators: [
    { name: "Password Generator", href: "/tools/password-generator", desc: "Generate secure random passwords" },
    { name: "UUID Generator", href: "/tools/uuid-generator", desc: "Generate unique UUIDs/GUIDs" },
    { name: "QR Code Generator", href: "/tools/qr-code-generator", desc: "Create QR codes for any text or URL" },
    { name: "Hash Generator", href: "/tools/hash-generator", desc: "Generate SHA-256, SHA-512, and MD5 hashes" },
  ],
  Converters: [
    { name: "Color Converter", href: "/tools/color-converter", desc: "Convert between HEX, RGB, HSL, and CMYK" },
    { name: "Unit Converter", href: "/tools/unit-converter", desc: "Convert length, weight, temperature, and more" },
    { name: "Timestamp Converter", href: "/tools/timestamp-converter", desc: "Convert Unix timestamps to human-readable dates" },
    { name: "Image to Base64", href: "/tools/image-to-base64", desc: "Convert images to Base64 data URIs" },
  ],
};

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Free Online Tools
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Fast, free, and private. No signup required. No data stored.
          Just tools that work.
        </p>
      </section>

      {/* Ad slot */}
      <div className="ad-slot my-8 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {Object.entries(tools).map(([category, categoryTools]) => (
        <section key={category} className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
            {category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="block p-5 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-1">
                  {tool.name}
                </h3>
                <p className="text-sm text-gray-500">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* Bottom ad slot */}
      <div className="ad-slot my-8 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>
    </div>
  );
}
