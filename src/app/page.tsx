import Link from "next/link";

const tools = {
  "Text Tools": [
    { name: "Word Counter", href: "/tools/word-counter", desc: "Count words, characters, sentences, and paragraphs" },
    { name: "Text Case Converter", href: "/tools/text-case-converter", desc: "Convert text to uppercase, lowercase, title case, and more" },
    { name: "Lorem Ipsum Generator", href: "/tools/lorem-ipsum", desc: "Generate placeholder text for designs and layouts" },
    { name: "Slug Generator", href: "/tools/slug-generator", desc: "Create URL-friendly slugs from any text" },
    { name: "Diff Checker", href: "/tools/diff-checker", desc: "Compare two texts and find the differences" },
    { name: "Word Frequency Counter", href: "/tools/word-frequency", desc: "Analyze word frequency and text statistics" },
    { name: "Text Repeater", href: "/tools/text-repeater", desc: "Repeat text multiple times with custom separators" },
    { name: "Text to Binary", href: "/tools/text-to-binary", desc: "Convert text to binary, hex, and octal" },
    { name: "Morse Code Translator", href: "/tools/morse-code", desc: "Translate text to Morse code with audio playback" },
    { name: "Readability Score", href: "/tools/readability", desc: "Check Flesch-Kincaid, ARI, and Coleman-Liau readability scores" },
    { name: "Text Similarity", href: "/tools/text-similarity", desc: "Compare two texts and find similarity percentage" },
  ],
  "Developer Tools": [
    { name: "JSON Formatter", href: "/tools/json-formatter", desc: "Format, validate, and minify JSON data" },
    { name: "Base64 Encoder/Decoder", href: "/tools/base64", desc: "Encode and decode Base64 strings" },
    { name: "URL Encoder/Decoder", href: "/tools/url-encoder", desc: "Encode and decode URLs and query parameters" },
    { name: "Regex Tester", href: "/tools/regex-tester", desc: "Test regular expressions with real-time matching" },
    { name: "HTML Entity Encoder", href: "/tools/html-entities", desc: "Encode and decode HTML entities" },
    { name: "Markdown to HTML", href: "/tools/markdown-to-html", desc: "Convert Markdown text to clean HTML" },
    { name: "CSV to JSON", href: "/tools/csv-to-json", desc: "Convert CSV data to JSON format" },
    { name: "JSON to CSV", href: "/tools/json-to-csv", desc: "Convert JSON arrays to CSV format" },
    { name: "Cron Expression Generator", href: "/tools/cron-generator", desc: "Build and understand cron schedule expressions" },
    { name: "Number Base Converter", href: "/tools/number-base-converter", desc: "Convert between binary, hex, octal, and decimal" },
    { name: "IP Address Info", href: "/tools/ip-info", desc: "IP lookup, validator, and subnet calculator" },
    { name: "PX to REM Converter", href: "/tools/px-to-rem", desc: "Convert between pixels and rem CSS units" },
    { name: "JSON Path Finder", href: "/tools/json-path", desc: "Explore JSON with clickable tree and path finder" },
    { name: "Markdown Table Generator", href: "/tools/markdown-table", desc: "Create markdown tables with a visual editor" },
    { name: "Meta Tag Generator", href: "/tools/meta-tags", desc: "Generate SEO meta tags and Open Graph tags" },
  ],
  "Generators": [
    { name: "Password Generator", href: "/tools/password-generator", desc: "Generate secure random passwords" },
    { name: "UUID Generator", href: "/tools/uuid-generator", desc: "Generate unique UUIDs/GUIDs" },
    { name: "QR Code Generator", href: "/tools/qr-code-generator", desc: "Create QR codes for any text or URL" },
    { name: "Hash Generator", href: "/tools/hash-generator", desc: "Generate SHA-256, SHA-512, and MD5 hashes" },
    { name: "Favicon Generator", href: "/tools/favicon-generator", desc: "Create favicons from text with custom colors" },
    { name: "Gradient Generator", href: "/tools/gradient-generator", desc: "Create CSS gradients with live preview" },
    { name: "Box Shadow Generator", href: "/tools/box-shadow", desc: "Generate CSS box shadows visually" },
    { name: "Placeholder Images", href: "/tools/placeholder-images", desc: "Generate placeholder image URLs instantly" },
    { name: "Random Number Generator", href: "/tools/random-number", desc: "Random numbers, dice roller, and coin flipper" },
    { name: "Color Palette Generator", href: "/tools/color-palette", desc: "Generate random color schemes and palettes" },
    { name: "Privacy Policy Generator", href: "/tools/privacy-policy", desc: "Generate a privacy policy template for your website" },
    { name: "Invoice Generator", href: "/tools/invoice-generator", desc: "Create and print professional invoices" },
  ],
  "Converters": [
    { name: "Color Converter", href: "/tools/color-converter", desc: "Convert between HEX, RGB, HSL, and CMYK" },
    { name: "Unit Converter", href: "/tools/unit-converter", desc: "Convert length, weight, temperature, and more" },
    { name: "Timestamp Converter", href: "/tools/timestamp-converter", desc: "Convert Unix timestamps to human-readable dates" },
    { name: "Image to Base64", href: "/tools/image-to-base64", desc: "Convert images to Base64 data URIs" },
    { name: "Aspect Ratio Calculator", href: "/tools/aspect-ratio", desc: "Calculate and lock aspect ratios for images and video" },
    { name: "Percentage Calculator", href: "/tools/percentage-calculator", desc: "Calculate percentages, changes, and ratios" },
  ],
  "Calculators": [
    { name: "Loan Calculator", href: "/tools/loan-calculator", desc: "Calculate mortgage payments with amortization table" },
    { name: "Compound Interest", href: "/tools/compound-interest", desc: "Calculate investment growth with compound interest" },
    { name: "BMI Calculator", href: "/tools/bmi-calculator", desc: "Calculate your Body Mass Index" },
    { name: "Tip Calculator", href: "/tools/tip-calculator", desc: "Calculate tips and split bills between people" },
    { name: "Age Calculator", href: "/tools/age-calculator", desc: "Calculate exact age in years, months, and days" },
    { name: "Salary Calculator", href: "/tools/salary-calculator", desc: "Convert between hourly, weekly, and annual salary" },
    { name: "Electricity Cost", href: "/tools/electricity-calculator", desc: "Calculate power usage and electricity costs" },
  ],
  "Productivity Tools": [
    { name: "Pomodoro Timer", href: "/tools/pomodoro-timer", desc: "Focus timer with work and break intervals" },
    { name: "Stopwatch", href: "/tools/stopwatch", desc: "Stopwatch with lap timer and split times" },
    { name: "Typing Speed Test", href: "/tools/typing-test", desc: "Test your typing speed and accuracy" },
    { name: "Countdown Timer", href: "/tools/countdown-timer", desc: "Count down to any event or date" },
    { name: "Habit Tracker", href: "/tools/habit-tracker", desc: "Track daily habits with streaks and persistence" },
    { name: "Whiteboard", href: "/tools/whiteboard", desc: "Free drawing canvas with shapes and colors" },
  ],
  "Reference & Info": [
    { name: "Emoji Picker", href: "/tools/emoji-picker", desc: "Search and copy emojis with one click" },
    { name: "Character Map", href: "/tools/character-map", desc: "Browse and copy special Unicode characters" },
    { name: "Screen Info", href: "/tools/screen-info", desc: "Check your screen resolution and display info" },
  ],
};

export default function Home() {
  const totalTools = Object.values(tools).reduce((sum, cat) => sum + cat.length, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Free Online Tools
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {totalTools} free tools for developers, writers, designers, and everyone else.
          No signup. No tracking. Just tools that work.
        </p>
      </section>

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

      <div className="ad-slot my-8 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>
    </div>
  );
}
