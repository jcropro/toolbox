"use client";

import { useState, useCallback, useRef } from "react";

const TEXT_TO_MORSE: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
  G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
  M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
  S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
  "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.",
  "!": "-.-.--", "/": "-..-.", "(": "-.--.", ")": "-.--.-",
  "&": ".-...", ":": "---...", ";": "-.-.-.", "=": "-...-",
  "+": ".-.-.", "-": "-....-", _: "..--.-", '"': ".-..-.",
  $: "...-..-", "@": ".--.-.",
};

const MORSE_TO_TEXT: Record<string, string> = Object.fromEntries(
  Object.entries(TEXT_TO_MORSE).map(([k, v]) => [v, k])
);

function encodeToMorse(text: string): string {
  return text
    .toUpperCase()
    .split("")
    .map((ch) => {
      if (ch === " ") return "/";
      return TEXT_TO_MORSE[ch] || "";
    })
    .filter(Boolean)
    .join(" ");
}

function decodeFromMorse(morse: string): string {
  return morse
    .trim()
    .split(/\s*\/\s*/)
    .map((word) =>
      word
        .trim()
        .split(/\s+/)
        .map((code) => MORSE_TO_TEXT[code] || "")
        .join("")
    )
    .join(" ");
}

export function MorseCodeTool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const stopRef = useRef(false);

  const output = mode === "encode" ? encodeToMorse(input) : decodeFromMorse(input);

  const handleCopy = useCallback(async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }, []);

  const playMorse = useCallback(async () => {
    const morseString = mode === "encode" ? encodeToMorse(input) : input;
    if (!morseString.trim()) return;

    stopRef.current = false;
    setIsPlaying(true);

    const ctx = new AudioContext();
    const freq = 600;
    const dotLen = 0.08;
    const dashLen = dotLen * 3;
    const symbolGap = dotLen;
    const letterGap = dotLen * 3;
    const wordGap = dotLen * 7;

    let currentTime = ctx.currentTime + 0.05;

    const tokens = morseString.trim().split(/\s+/);

    for (const token of tokens) {
      if (stopRef.current) break;

      if (token === "/") {
        currentTime += wordGap;
        continue;
      }

      for (let i = 0; i < token.length; i++) {
        if (stopRef.current) break;
        const ch = token[i];
        const dur = ch === "." ? dotLen : ch === "-" ? dashLen : 0;
        if (dur > 0) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.value = freq;
          osc.connect(gain);
          gain.connect(ctx.destination);
          gain.gain.setValueAtTime(0.3, currentTime);
          osc.start(currentTime);
          osc.stop(currentTime + dur);
          currentTime += dur + symbolGap;
        }
      }
      currentTime += letterGap - symbolGap;
    }

    const totalDuration = (currentTime - ctx.currentTime) * 1000;
    await new Promise((resolve) => setTimeout(resolve, Math.max(totalDuration, 100)));

    ctx.close();
    setIsPlaying(false);
  }, [input, mode]);

  const stopPlaying = useCallback(() => {
    stopRef.current = true;
    setIsPlaying(false);
  }, []);

  // Visual dots/dashes for the morse output
  const morseForVisual = mode === "encode" ? encodeToMorse(input) : input;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Morse Code Translator
      </h1>
      <p className="text-gray-600 mb-6">
        Convert text to Morse code or Morse code to text. Play the Morse code as
        audio beeps and see a visual dot-dash display. Everything runs in your
        browser.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setMode("encode"); setInput(""); }}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer ${
            mode === "encode"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Text to Morse
        </button>
        <button
          onClick={() => { setMode("decode"); setInput(""); }}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer ${
            mode === "decode"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Morse to Text
        </button>
      </div>

      {/* Input */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {mode === "encode" ? "Enter text" : "Enter Morse code (use . and -, spaces between letters, / between words)"}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === "encode"
              ? "Hello World"
              : ".... . .-.. .-.. --- / .-- --- .-. .-.. -.."
          }
          rows={4}
          className="w-full border border-gray-300 rounded-lg p-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-vertical"
        />
      </div>

      {/* Output */}
      {input && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              {mode === "encode" ? "Morse Code" : "Decoded Text"}
            </span>
            <div className="flex gap-2">
              {!isPlaying ? (
                <button
                  onClick={playMorse}
                  className="px-3 py-1 text-xs font-medium bg-green-50 text-green-700 border border-green-300 rounded-md hover:bg-green-100 transition-colors cursor-pointer"
                >
                  Play Audio
                </button>
              ) : (
                <button
                  onClick={stopPlaying}
                  className="px-3 py-1 text-xs font-medium bg-red-50 text-red-700 border border-red-300 rounded-md hover:bg-red-100 transition-colors cursor-pointer"
                >
                  Stop
                </button>
              )}
              <button
                onClick={() => handleCopy(output, "output")}
                className="px-3 py-1 text-xs font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {copiedField === "output" ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <code className="block font-mono text-sm text-gray-800 break-all whitespace-pre-wrap bg-gray-50 p-3 rounded mb-4">
            {output || "(no valid output)"}
          </code>

          {/* Visual dots/dashes */}
          {morseForVisual.trim() && (
            <div>
              <span className="text-xs font-medium text-gray-500 mb-2 block">
                Visual Display
              </span>
              <div className="flex flex-wrap items-center gap-1 bg-gray-900 p-4 rounded-lg">
                {morseForVisual.split("").map((ch, i) => {
                  if (ch === ".") {
                    return (
                      <span
                        key={i}
                        className="inline-block w-2 h-2 rounded-full bg-yellow-400"
                        title="dot"
                      />
                    );
                  }
                  if (ch === "-") {
                    return (
                      <span
                        key={i}
                        className="inline-block w-5 h-2 rounded-full bg-yellow-400"
                        title="dash"
                      />
                    );
                  }
                  if (ch === "/") {
                    return (
                      <span key={i} className="inline-block w-6" />
                    );
                  }
                  if (ch === " ") {
                    return (
                      <span key={i} className="inline-block w-3" />
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reference table */}
      <details className="bg-white border border-gray-200 rounded-lg mb-6">
        <summary className="p-4 cursor-pointer text-sm font-medium text-gray-700 hover:bg-gray-50">
          Morse Code Reference Chart
        </summary>
        <div className="px-4 pb-4">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-2">
            {Object.entries(TEXT_TO_MORSE).map(([char, code]) => (
              <div
                key={char}
                className="text-center bg-gray-50 rounded p-2"
              >
                <span className="block text-lg font-bold text-gray-800">
                  {char}
                </span>
                <span className="block text-xs font-mono text-gray-500">
                  {code}
                </span>
              </div>
            ))}
          </div>
        </div>
      </details>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          About This Translator
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Morse code represents each letter and number as a unique sequence of
          dots (short signals) and dashes (long signals). This translator
          supports the full International Morse Code alphabet, numbers, and
          common punctuation. Audio playback uses the Web Audio API to generate
          real-time beep tones at 600 Hz. Use spaces between letters and a
          forward slash (/) between words when entering Morse code manually.
        </p>
      </section>
    </div>
  );
}
