"use client";

import { useState, useCallback } from "react";

const CHARSETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

type StrengthLevel = "Very Weak" | "Weak" | "Fair" | "Strong" | "Very Strong";

function getStrength(
  length: number,
  options: { uppercase: boolean; lowercase: boolean; numbers: boolean; symbols: boolean }
): { level: StrengthLevel; percent: number; color: string } {
  let poolSize = 0;
  if (options.uppercase) poolSize += 26;
  if (options.lowercase) poolSize += 26;
  if (options.numbers) poolSize += 10;
  if (options.symbols) poolSize += 26;

  // Entropy in bits
  const entropy = length * Math.log2(poolSize || 1);

  if (entropy < 28) return { level: "Very Weak", percent: 10, color: "bg-red-500" };
  if (entropy < 36) return { level: "Weak", percent: 25, color: "bg-orange-500" };
  if (entropy < 60) return { level: "Fair", percent: 50, color: "bg-yellow-500" };
  if (entropy < 80) return { level: "Strong", percent: 75, color: "bg-green-500" };
  return { level: "Very Strong", percent: 100, color: "bg-emerald-600" };
}

function generatePassword(
  length: number,
  options: { uppercase: boolean; lowercase: boolean; numbers: boolean; symbols: boolean }
): string {
  let charset = "";
  if (options.uppercase) charset += CHARSETS.uppercase;
  if (options.lowercase) charset += CHARSETS.lowercase;
  if (options.numbers) charset += CHARSETS.numbers;
  if (options.symbols) charset += CHARSETS.symbols;

  if (charset.length === 0) return "";

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }

  return password;
}

export function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const strength = getStrength(length, options);
  const noOptionsSelected = !options.uppercase && !options.lowercase && !options.numbers && !options.symbols;

  const handleGenerate = useCallback(() => {
    if (noOptionsSelected) return;
    const generated = Array.from({ length: 5 }, () =>
      generatePassword(length, options)
    );
    setPasswords(generated);
    setCopiedIndex(null);
  }, [length, options, noOptionsSelected]);

  const handleCopy = useCallback(async (password: string, index: number) => {
    try {
      await navigator.clipboard.writeText(password);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = password;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  }, []);

  const toggleOption = (key: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Password Generator</h1>
      <p className="text-gray-600 mb-6">
        Generate strong, random passwords using cryptographically secure
        randomness. Everything runs locally in your browser &mdash; no passwords
        are ever transmitted.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        {/* Length slider */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">
              Password Length
            </label>
            <span className="text-sm font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {length}
            </span>
          </div>
          <input
            type="range"
            min={8}
            max={128}
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value, 10))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>8</span>
            <span>128</span>
          </div>
        </div>

        {/* Character options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {(
            [
              ["uppercase", "A-Z"],
              ["lowercase", "a-z"],
              ["numbers", "0-9"],
              ["symbols", "!@#"],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                options[key]
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="checkbox"
                checked={options[key]}
                onChange={() => toggleOption(key)}
                className="accent-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </label>
          ))}
        </div>

        {noOptionsSelected && (
          <p className="text-red-600 text-sm mb-4">
            Select at least one character type.
          </p>
        )}

        {/* Strength indicator */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600">Strength</span>
            <span
              className={`text-sm font-semibold ${
                strength.level === "Very Weak" || strength.level === "Weak"
                  ? "text-red-600"
                  : strength.level === "Fair"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {strength.level}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
              style={{ width: `${strength.percent}%` }}
            />
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={noOptionsSelected}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Generate 5 Passwords
        </button>
      </div>

      {/* Results */}
      {passwords.length > 0 && (
        <div className="space-y-2 mb-6">
          {passwords.map((pw, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3"
            >
              <code className="flex-1 font-mono text-sm break-all text-gray-800 select-all">
                {pw}
              </code>
              <button
                onClick={() => handleCopy(pw, i)}
                className="shrink-0 px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {copiedIndex === i ? "Copied!" : "Copy"}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Password Generator</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          This tool uses the Web Crypto API (crypto.getRandomValues) to produce
          cryptographically secure random passwords. No passwords are stored,
          logged, or sent anywhere. Choose your length, toggle character types,
          and generate five passwords at a time. The strength meter is based on
          entropy &mdash; longer passwords with more character variety are
          stronger.
        </p>
      </section>
    </div>
  );
}
