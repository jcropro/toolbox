"use client";

import { useState, useMemo } from "react";

interface CharEntry {
  char: string;
  name: string;
  html: string;
}

const CATEGORIES: Record<string, CharEntry[]> = {
  Currency: [
    { char: "$", name: "Dollar Sign", html: "&dollar;" },
    { char: "\u20AC", name: "Euro Sign", html: "&euro;" },
    { char: "\u00A3", name: "Pound Sign", html: "&pound;" },
    { char: "\u00A5", name: "Yen Sign", html: "&yen;" },
    { char: "\u20B9", name: "Indian Rupee", html: "&#8377;" },
    { char: "\u20BF", name: "Bitcoin Sign", html: "&#8383;" },
    { char: "\u00A2", name: "Cent Sign", html: "&cent;" },
    { char: "\u20A9", name: "Won Sign", html: "&#8361;" },
    { char: "\u20BD", name: "Ruble Sign", html: "&#8381;" },
    { char: "\u20AB", name: "Dong Sign", html: "&#8363;" },
    { char: "\u20B1", name: "Peso Sign", html: "&#8369;" },
    { char: "\u20A8", name: "Rupee Sign", html: "&#8360;" },
    { char: "\u20B4", name: "Hryvnia Sign", html: "&#8372;" },
    { char: "\u20BA", name: "Turkish Lira", html: "&#8378;" },
    { char: "\u20B5", name: "Cedi Sign", html: "&#8373;" },
    { char: "\u00A4", name: "Currency Sign", html: "&curren;" },
  ],
  Math: [
    { char: "\u00B1", name: "Plus-Minus", html: "&plusmn;" },
    { char: "\u00D7", name: "Multiplication", html: "&times;" },
    { char: "\u00F7", name: "Division", html: "&divide;" },
    { char: "\u221A", name: "Square Root", html: "&radic;" },
    { char: "\u221E", name: "Infinity", html: "&infin;" },
    { char: "\u03C0", name: "Pi", html: "&pi;" },
    { char: "\u2248", name: "Almost Equal", html: "&asymp;" },
    { char: "\u2260", name: "Not Equal", html: "&ne;" },
    { char: "\u2264", name: "Less or Equal", html: "&le;" },
    { char: "\u2265", name: "Greater or Equal", html: "&ge;" },
    { char: "\u00B2", name: "Superscript 2", html: "&sup2;" },
    { char: "\u00B3", name: "Superscript 3", html: "&sup3;" },
    { char: "\u00BD", name: "One Half", html: "&frac12;" },
    { char: "\u00BC", name: "One Quarter", html: "&frac14;" },
    { char: "\u00BE", name: "Three Quarters", html: "&frac34;" },
    { char: "\u2030", name: "Per Mille", html: "&permil;" },
    { char: "\u00B0", name: "Degree", html: "&deg;" },
    { char: "\u2211", name: "Summation", html: "&sum;" },
    { char: "\u220F", name: "Product", html: "&prod;" },
    { char: "\u222B", name: "Integral", html: "&int;" },
    { char: "\u2202", name: "Partial Derivative", html: "&part;" },
    { char: "\u2206", name: "Delta/Increment", html: "&#8710;" },
    { char: "\u2234", name: "Therefore", html: "&there4;" },
    { char: "\u2235", name: "Because", html: "&#8757;" },
  ],
  Arrows: [
    { char: "\u2190", name: "Left Arrow", html: "&larr;" },
    { char: "\u2192", name: "Right Arrow", html: "&rarr;" },
    { char: "\u2191", name: "Up Arrow", html: "&uarr;" },
    { char: "\u2193", name: "Down Arrow", html: "&darr;" },
    { char: "\u2194", name: "Left Right Arrow", html: "&harr;" },
    { char: "\u2195", name: "Up Down Arrow", html: "&#8597;" },
    { char: "\u21D0", name: "Double Left Arrow", html: "&lArr;" },
    { char: "\u21D2", name: "Double Right Arrow", html: "&rArr;" },
    { char: "\u21D1", name: "Double Up Arrow", html: "&uArr;" },
    { char: "\u21D3", name: "Double Down Arrow", html: "&dArr;" },
    { char: "\u21D4", name: "Double Left Right", html: "&hArr;" },
    { char: "\u2196", name: "NW Arrow", html: "&#8598;" },
    { char: "\u2197", name: "NE Arrow", html: "&#8599;" },
    { char: "\u2198", name: "SE Arrow", html: "&#8600;" },
    { char: "\u2199", name: "SW Arrow", html: "&#8601;" },
    { char: "\u21B5", name: "Return Arrow", html: "&crarr;" },
    { char: "\u27A1", name: "Black Right Arrow", html: "&#10145;" },
    { char: "\u2B05", name: "Black Left Arrow", html: "&#11013;" },
    { char: "\u2B06", name: "Black Up Arrow", html: "&#11014;" },
    { char: "\u2B07", name: "Black Down Arrow", html: "&#11015;" },
  ],
  "Latin Accented": [
    { char: "\u00E0", name: "a grave", html: "&agrave;" },
    { char: "\u00E1", name: "a acute", html: "&aacute;" },
    { char: "\u00E2", name: "a circumflex", html: "&acirc;" },
    { char: "\u00E3", name: "a tilde", html: "&atilde;" },
    { char: "\u00E4", name: "a umlaut", html: "&auml;" },
    { char: "\u00E5", name: "a ring", html: "&aring;" },
    { char: "\u00E6", name: "ae ligature", html: "&aelig;" },
    { char: "\u00E7", name: "c cedilla", html: "&ccedil;" },
    { char: "\u00E8", name: "e grave", html: "&egrave;" },
    { char: "\u00E9", name: "e acute", html: "&eacute;" },
    { char: "\u00EA", name: "e circumflex", html: "&ecirc;" },
    { char: "\u00EB", name: "e umlaut", html: "&euml;" },
    { char: "\u00EC", name: "i grave", html: "&igrave;" },
    { char: "\u00ED", name: "i acute", html: "&iacute;" },
    { char: "\u00F1", name: "n tilde", html: "&ntilde;" },
    { char: "\u00F2", name: "o grave", html: "&ograve;" },
    { char: "\u00F3", name: "o acute", html: "&oacute;" },
    { char: "\u00F4", name: "o circumflex", html: "&ocirc;" },
    { char: "\u00F6", name: "o umlaut", html: "&ouml;" },
    { char: "\u00F9", name: "u grave", html: "&ugrave;" },
    { char: "\u00FA", name: "u acute", html: "&uacute;" },
    { char: "\u00FC", name: "u umlaut", html: "&uuml;" },
    { char: "\u00FF", name: "y umlaut", html: "&yuml;" },
    { char: "\u00DF", name: "sharp s", html: "&szlig;" },
  ],
  Greek: [
    { char: "\u0391", name: "Alpha", html: "&Alpha;" },
    { char: "\u0392", name: "Beta", html: "&Beta;" },
    { char: "\u0393", name: "Gamma", html: "&Gamma;" },
    { char: "\u0394", name: "Delta", html: "&Delta;" },
    { char: "\u0395", name: "Epsilon", html: "&Epsilon;" },
    { char: "\u0396", name: "Zeta", html: "&Zeta;" },
    { char: "\u0397", name: "Eta", html: "&Eta;" },
    { char: "\u0398", name: "Theta", html: "&Theta;" },
    { char: "\u039B", name: "Lambda", html: "&Lambda;" },
    { char: "\u039C", name: "Mu", html: "&Mu;" },
    { char: "\u039E", name: "Xi", html: "&Xi;" },
    { char: "\u03A0", name: "Pi", html: "&Pi;" },
    { char: "\u03A3", name: "Sigma", html: "&Sigma;" },
    { char: "\u03A6", name: "Phi", html: "&Phi;" },
    { char: "\u03A8", name: "Psi", html: "&Psi;" },
    { char: "\u03A9", name: "Omega", html: "&Omega;" },
    { char: "\u03B1", name: "alpha", html: "&alpha;" },
    { char: "\u03B2", name: "beta", html: "&beta;" },
    { char: "\u03B3", name: "gamma", html: "&gamma;" },
    { char: "\u03B4", name: "delta", html: "&delta;" },
    { char: "\u03B5", name: "epsilon", html: "&epsilon;" },
    { char: "\u03B6", name: "zeta", html: "&zeta;" },
    { char: "\u03B7", name: "eta", html: "&eta;" },
    { char: "\u03B8", name: "theta", html: "&theta;" },
    { char: "\u03BB", name: "lambda", html: "&lambda;" },
    { char: "\u03BC", name: "mu", html: "&mu;" },
    { char: "\u03C0", name: "pi", html: "&pi;" },
    { char: "\u03C3", name: "sigma", html: "&sigma;" },
    { char: "\u03C6", name: "phi", html: "&phi;" },
    { char: "\u03C8", name: "psi", html: "&psi;" },
    { char: "\u03C9", name: "omega", html: "&omega;" },
  ],
  Symbols: [
    { char: "\u00A9", name: "Copyright", html: "&copy;" },
    { char: "\u00AE", name: "Registered", html: "&reg;" },
    { char: "\u2122", name: "Trademark", html: "&trade;" },
    { char: "\u00A7", name: "Section", html: "&sect;" },
    { char: "\u00B6", name: "Pilcrow", html: "&para;" },
    { char: "\u2020", name: "Dagger", html: "&dagger;" },
    { char: "\u2021", name: "Double Dagger", html: "&Dagger;" },
    { char: "\u2022", name: "Bullet", html: "&bull;" },
    { char: "\u2023", name: "Triangle Bullet", html: "&#8227;" },
    { char: "\u2605", name: "Black Star", html: "&#9733;" },
    { char: "\u2606", name: "White Star", html: "&#9734;" },
    { char: "\u2665", name: "Heart", html: "&hearts;" },
    { char: "\u2666", name: "Diamond", html: "&diams;" },
    { char: "\u2663", name: "Club", html: "&clubs;" },
    { char: "\u2660", name: "Spade", html: "&spades;" },
    { char: "\u266A", name: "Musical Note", html: "&#9834;" },
    { char: "\u266B", name: "Beamed Notes", html: "&#9835;" },
    { char: "\u2713", name: "Check Mark", html: "&#10003;" },
    { char: "\u2717", name: "Ballot X", html: "&#10007;" },
    { char: "\u2026", name: "Ellipsis", html: "&hellip;" },
    { char: "\u00AC", name: "Not Sign", html: "&not;" },
    { char: "\u00B5", name: "Micro Sign", html: "&micro;" },
  ],
  Punctuation: [
    { char: "\u2014", name: "Em Dash", html: "&mdash;" },
    { char: "\u2013", name: "En Dash", html: "&ndash;" },
    { char: "\u2026", name: "Ellipsis", html: "&hellip;" },
    { char: "\u00AB", name: "Left Guillemet", html: "&laquo;" },
    { char: "\u00BB", name: "Right Guillemet", html: "&raquo;" },
    { char: "\u2018", name: "Left Single Quote", html: "&lsquo;" },
    { char: "\u2019", name: "Right Single Quote", html: "&rsquo;" },
    { char: "\u201C", name: "Left Double Quote", html: "&ldquo;" },
    { char: "\u201D", name: "Right Double Quote", html: "&rdquo;" },
    { char: "\u201E", name: "Double Low Quote", html: "&bdquo;" },
    { char: "\u00A1", name: "Inverted Exclamation", html: "&iexcl;" },
    { char: "\u00BF", name: "Inverted Question", html: "&iquest;" },
    { char: "\u00B7", name: "Middle Dot", html: "&middot;" },
    { char: "\u2027", name: "Hyphenation Point", html: "&#8231;" },
    { char: "\u2010", name: "Hyphen", html: "&#8208;" },
    { char: "\u2011", name: "Non-Breaking Hyphen", html: "&#8209;" },
    { char: "\u00A0", name: "Non-Breaking Space", html: "&nbsp;" },
  ],
};

const CATEGORY_NAMES = Object.keys(CATEGORIES);

export function CharacterMapTool() {
  const [activeCategory, setActiveCategory] = useState(CATEGORY_NAMES[0]);
  const [search, setSearch] = useState("");
  const [copiedChar, setCopiedChar] = useState<string | null>(null);
  const [selectedChar, setSelectedChar] = useState<CharEntry | null>(null);

  const filteredChars = useMemo(() => {
    if (!search.trim()) {
      return CATEGORIES[activeCategory] || [];
    }
    const term = search.toLowerCase();
    const all: CharEntry[] = [];
    for (const entries of Object.values(CATEGORIES)) {
      for (const entry of entries) {
        if (
          entry.char.includes(search) ||
          entry.name.toLowerCase().includes(term) ||
          entry.html.toLowerCase().includes(term)
        ) {
          all.push(entry);
        }
      }
    }
    return all;
  }, [activeCategory, search]);

  const handleCopy = async (entry: CharEntry) => {
    await navigator.clipboard.writeText(entry.char);
    setCopiedChar(entry.char);
    setSelectedChar(entry);
    setTimeout(() => setCopiedChar(null), 1500);
  };

  const getCodePoint = (char: string): string => {
    const cp = char.codePointAt(0);
    return cp ? `U+${cp.toString(16).toUpperCase().padStart(4, "0")}` : "";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Special Characters Map</h1>
      <p className="text-gray-600 mb-6">
        Browse and copy special characters, Unicode symbols, and more. Click any character to copy
        it to your clipboard.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search characters by name, symbol, or HTML entity..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {!search.trim() && (
          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORY_NAMES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSelectedChar(null);
                }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {search.trim() && filteredChars.length === 0 && (
          <p className="text-gray-500 text-sm py-4 text-center">No characters match your search.</p>
        )}

        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5 mb-4">
          {filteredChars.map((entry, i) => (
            <button
              key={`${entry.char}-${i}`}
              onClick={() => handleCopy(entry)}
              title={`${entry.name} (click to copy)`}
              className={`relative aspect-square flex items-center justify-center text-xl rounded border transition-all hover:bg-blue-50 hover:border-blue-300 hover:scale-110 ${
                copiedChar === entry.char
                  ? "bg-green-50 border-green-400"
                  : selectedChar?.char === entry.char
                  ? "bg-blue-50 border-blue-300"
                  : "bg-white border-gray-200"
              }`}
            >
              {copiedChar === entry.char ? (
                <span className="text-xs text-green-600 font-medium">Copied</span>
              ) : (
                entry.char
              )}
            </button>
          ))}
        </div>

        {selectedChar && (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 flex items-center gap-6">
            <div className="text-5xl select-all">{selectedChar.char}</div>
            <div className="text-sm space-y-1">
              <div>
                <span className="font-medium text-gray-700">Name:</span>{" "}
                <span className="text-gray-600">{selectedChar.name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Unicode:</span>{" "}
                <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">
                  {getCodePoint(selectedChar.char)}
                </code>
              </div>
              <div>
                <span className="font-medium text-gray-700">HTML:</span>{" "}
                <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">
                  {selectedChar.html}
                </code>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>
    </div>
  );
}
