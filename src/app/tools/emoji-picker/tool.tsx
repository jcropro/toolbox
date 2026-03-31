"use client";

import { useState, useMemo, useCallback } from "react";

interface EmojiEntry {
  emoji: string;
  name: string;
  category: string;
}

const EMOJIS: EmojiEntry[] = [
  // Smileys
  { emoji: "\u{1F600}", name: "Grinning Face", category: "Smileys" },
  { emoji: "\u{1F601}", name: "Beaming Face", category: "Smileys" },
  { emoji: "\u{1F602}", name: "Face with Tears of Joy", category: "Smileys" },
  { emoji: "\u{1F603}", name: "Grinning Face with Big Eyes", category: "Smileys" },
  { emoji: "\u{1F604}", name: "Grinning Squinting Face", category: "Smileys" },
  { emoji: "\u{1F605}", name: "Grinning Face with Sweat", category: "Smileys" },
  { emoji: "\u{1F606}", name: "Squinting Face with Tongue", category: "Smileys" },
  { emoji: "\u{1F609}", name: "Winking Face", category: "Smileys" },
  { emoji: "\u{1F60A}", name: "Smiling Face with Smiling Eyes", category: "Smileys" },
  { emoji: "\u{1F60B}", name: "Face Savoring Food", category: "Smileys" },
  { emoji: "\u{1F60E}", name: "Smiling Face with Sunglasses", category: "Smileys" },
  { emoji: "\u{1F60D}", name: "Smiling Face with Heart-Eyes", category: "Smileys" },
  { emoji: "\u{1F618}", name: "Face Blowing a Kiss", category: "Smileys" },
  { emoji: "\u{1F617}", name: "Kissing Face", category: "Smileys" },
  { emoji: "\u{1F619}", name: "Kissing Face with Smiling Eyes", category: "Smileys" },
  { emoji: "\u{1F61A}", name: "Kissing Face with Closed Eyes", category: "Smileys" },
  { emoji: "\u{1F642}", name: "Slightly Smiling Face", category: "Smileys" },
  { emoji: "\u{1F917}", name: "Hugging Face", category: "Smileys" },
  { emoji: "\u{1F914}", name: "Thinking Face", category: "Smileys" },
  { emoji: "\u{1F610}", name: "Neutral Face", category: "Smileys" },
  { emoji: "\u{1F611}", name: "Expressionless Face", category: "Smileys" },
  { emoji: "\u{1F636}", name: "Face Without Mouth", category: "Smileys" },
  { emoji: "\u{1F644}", name: "Face with Rolling Eyes", category: "Smileys" },
  { emoji: "\u{1F60F}", name: "Smirking Face", category: "Smileys" },
  { emoji: "\u{1F623}", name: "Persevering Face", category: "Smileys" },
  { emoji: "\u{1F625}", name: "Sad but Relieved Face", category: "Smileys" },
  { emoji: "\u{1F62E}", name: "Face with Open Mouth", category: "Smileys" },
  { emoji: "\u{1F910}", name: "Zipper-Mouth Face", category: "Smileys" },
  { emoji: "\u{1F62F}", name: "Hushed Face", category: "Smileys" },
  { emoji: "\u{1F62A}", name: "Sleepy Face", category: "Smileys" },
  { emoji: "\u{1F62B}", name: "Tired Face", category: "Smileys" },
  { emoji: "\u{1F634}", name: "Sleeping Face", category: "Smileys" },
  { emoji: "\u{1F637}", name: "Face with Medical Mask", category: "Smileys" },
  { emoji: "\u{1F912}", name: "Face with Thermometer", category: "Smileys" },
  { emoji: "\u{1F915}", name: "Face with Head-Bandage", category: "Smileys" },
  { emoji: "\u{1F922}", name: "Nauseated Face", category: "Smileys" },
  { emoji: "\u{1F927}", name: "Sneezing Face", category: "Smileys" },
  { emoji: "\u{1F631}", name: "Face Screaming in Fear", category: "Smileys" },
  { emoji: "\u{1F621}", name: "Pouting Face", category: "Smileys" },
  { emoji: "\u{1F620}", name: "Angry Face", category: "Smileys" },
  { emoji: "\u{1F47F}", name: "Angry Face with Horns", category: "Smileys" },
  { emoji: "\u{1F480}", name: "Skull", category: "Smileys" },
  { emoji: "\u{1F4A9}", name: "Pile of Poo", category: "Smileys" },
  { emoji: "\u{1F921}", name: "Clown Face", category: "Smileys" },
  { emoji: "\u{1F47B}", name: "Ghost", category: "Smileys" },
  { emoji: "\u{1F47D}", name: "Alien", category: "Smileys" },
  { emoji: "\u{1F916}", name: "Robot", category: "Smileys" },
  { emoji: "\u{1F63A}", name: "Grinning Cat", category: "Smileys" },
  // People
  { emoji: "\u{1F44D}", name: "Thumbs Up", category: "People" },
  { emoji: "\u{1F44E}", name: "Thumbs Down", category: "People" },
  { emoji: "\u{1F44A}", name: "Oncoming Fist", category: "People" },
  { emoji: "\u270C\uFE0F", name: "Victory Hand", category: "People" },
  { emoji: "\u{1F91E}", name: "Crossed Fingers", category: "People" },
  { emoji: "\u{1F44C}", name: "OK Hand", category: "People" },
  { emoji: "\u{1F44B}", name: "Waving Hand", category: "People" },
  { emoji: "\u{1F4AA}", name: "Flexed Biceps", category: "People" },
  { emoji: "\u{1F64F}", name: "Folded Hands", category: "People" },
  { emoji: "\u{1F91D}", name: "Handshake", category: "People" },
  { emoji: "\u270D\uFE0F", name: "Writing Hand", category: "People" },
  { emoji: "\u{1F485}", name: "Nail Polish", category: "People" },
  { emoji: "\u{1F933}", name: "Selfie", category: "People" },
  { emoji: "\u{1F448}", name: "Backhand Index Pointing Left", category: "People" },
  { emoji: "\u{1F449}", name: "Backhand Index Pointing Right", category: "People" },
  { emoji: "\u{1F446}", name: "Backhand Index Pointing Up", category: "People" },
  { emoji: "\u{1F447}", name: "Backhand Index Pointing Down", category: "People" },
  { emoji: "\u261D\uFE0F", name: "Index Pointing Up", category: "People" },
  { emoji: "\u{1F590}\uFE0F", name: "Hand with Fingers Splayed", category: "People" },
  { emoji: "\u{1F918}", name: "Sign of the Horns", category: "People" },
  { emoji: "\u{1F919}", name: "Call Me Hand", category: "People" },
  { emoji: "\u{1F91F}", name: "Love-You Gesture", category: "People" },
  { emoji: "\u{1F46B}", name: "Man and Woman Holding Hands", category: "People" },
  { emoji: "\u{1F468}", name: "Man", category: "People" },
  { emoji: "\u{1F469}", name: "Woman", category: "People" },
  { emoji: "\u{1F467}", name: "Girl", category: "People" },
  { emoji: "\u{1F466}", name: "Boy", category: "People" },
  { emoji: "\u{1F476}", name: "Baby", category: "People" },
  { emoji: "\u{1F474}", name: "Old Man", category: "People" },
  { emoji: "\u{1F475}", name: "Old Woman", category: "People" },
  { emoji: "\u{1F46E}", name: "Police Officer", category: "People" },
  { emoji: "\u{1F477}", name: "Construction Worker", category: "People" },
  { emoji: "\u{1F478}", name: "Princess", category: "People" },
  { emoji: "\u{1F934}", name: "Prince", category: "People" },
  // Animals
  { emoji: "\u{1F436}", name: "Dog Face", category: "Animals" },
  { emoji: "\u{1F431}", name: "Cat Face", category: "Animals" },
  { emoji: "\u{1F42D}", name: "Mouse Face", category: "Animals" },
  { emoji: "\u{1F439}", name: "Hamster", category: "Animals" },
  { emoji: "\u{1F430}", name: "Rabbit Face", category: "Animals" },
  { emoji: "\u{1F98A}", name: "Fox", category: "Animals" },
  { emoji: "\u{1F43B}", name: "Bear", category: "Animals" },
  { emoji: "\u{1F43C}", name: "Panda", category: "Animals" },
  { emoji: "\u{1F428}", name: "Koala", category: "Animals" },
  { emoji: "\u{1F42F}", name: "Tiger Face", category: "Animals" },
  { emoji: "\u{1F981}", name: "Lion", category: "Animals" },
  { emoji: "\u{1F42E}", name: "Cow Face", category: "Animals" },
  { emoji: "\u{1F437}", name: "Pig Face", category: "Animals" },
  { emoji: "\u{1F438}", name: "Frog", category: "Animals" },
  { emoji: "\u{1F435}", name: "Monkey Face", category: "Animals" },
  { emoji: "\u{1F414}", name: "Chicken", category: "Animals" },
  { emoji: "\u{1F427}", name: "Penguin", category: "Animals" },
  { emoji: "\u{1F426}", name: "Bird", category: "Animals" },
  { emoji: "\u{1F424}", name: "Baby Chick", category: "Animals" },
  { emoji: "\u{1F98B}", name: "Butterfly", category: "Animals" },
  { emoji: "\u{1F41B}", name: "Bug", category: "Animals" },
  { emoji: "\u{1F40C}", name: "Snail", category: "Animals" },
  { emoji: "\u{1F422}", name: "Turtle", category: "Animals" },
  { emoji: "\u{1F40D}", name: "Snake", category: "Animals" },
  { emoji: "\u{1F433}", name: "Whale", category: "Animals" },
  { emoji: "\u{1F420}", name: "Tropical Fish", category: "Animals" },
  { emoji: "\u{1F419}", name: "Octopus", category: "Animals" },
  { emoji: "\u{1F982}", name: "Scorpion", category: "Animals" },
  { emoji: "\u{1F980}", name: "Crab", category: "Animals" },
  { emoji: "\u{1F99A}", name: "Peacock", category: "Animals" },
  { emoji: "\u{1F984}", name: "Unicorn", category: "Animals" },
  { emoji: "\u{1F40E}", name: "Horse", category: "Animals" },
  // Food
  { emoji: "\u{1F34E}", name: "Red Apple", category: "Food" },
  { emoji: "\u{1F34A}", name: "Tangerine", category: "Food" },
  { emoji: "\u{1F34B}", name: "Lemon", category: "Food" },
  { emoji: "\u{1F34C}", name: "Banana", category: "Food" },
  { emoji: "\u{1F349}", name: "Watermelon", category: "Food" },
  { emoji: "\u{1F347}", name: "Grapes", category: "Food" },
  { emoji: "\u{1F353}", name: "Strawberry", category: "Food" },
  { emoji: "\u{1F352}", name: "Cherries", category: "Food" },
  { emoji: "\u{1F351}", name: "Peach", category: "Food" },
  { emoji: "\u{1F34D}", name: "Pineapple", category: "Food" },
  { emoji: "\u{1F345}", name: "Tomato", category: "Food" },
  { emoji: "\u{1F346}", name: "Eggplant", category: "Food" },
  { emoji: "\u{1F33D}", name: "Ear of Corn", category: "Food" },
  { emoji: "\u{1F336}\uFE0F", name: "Hot Pepper", category: "Food" },
  { emoji: "\u{1F955}", name: "Carrot", category: "Food" },
  { emoji: "\u{1F954}", name: "Potato", category: "Food" },
  { emoji: "\u{1F35E}", name: "Bread", category: "Food" },
  { emoji: "\u{1F950}", name: "Croissant", category: "Food" },
  { emoji: "\u{1F956}", name: "Baguette Bread", category: "Food" },
  { emoji: "\u{1F9C0}", name: "Cheese Wedge", category: "Food" },
  { emoji: "\u{1F356}", name: "Meat on Bone", category: "Food" },
  { emoji: "\u{1F355}", name: "Pizza", category: "Food" },
  { emoji: "\u{1F354}", name: "Hamburger", category: "Food" },
  { emoji: "\u{1F32D}", name: "Hot Dog", category: "Food" },
  { emoji: "\u{1F32E}", name: "Taco", category: "Food" },
  { emoji: "\u{1F32F}", name: "Burrito", category: "Food" },
  { emoji: "\u{1F37F}", name: "Popcorn", category: "Food" },
  { emoji: "\u{1F370}", name: "Shortcake", category: "Food" },
  { emoji: "\u{1F382}", name: "Birthday Cake", category: "Food" },
  { emoji: "\u{1F36B}", name: "Chocolate Bar", category: "Food" },
  { emoji: "\u{1F36C}", name: "Candy", category: "Food" },
  { emoji: "\u{1F369}", name: "Doughnut", category: "Food" },
  { emoji: "\u{1F36A}", name: "Cookie", category: "Food" },
  { emoji: "\u{1F366}", name: "Soft Ice Cream", category: "Food" },
  { emoji: "\u2615", name: "Hot Beverage", category: "Food" },
  { emoji: "\u{1F37A}", name: "Beer Mug", category: "Food" },
  { emoji: "\u{1F377}", name: "Wine Glass", category: "Food" },
  { emoji: "\u{1F378}", name: "Cocktail Glass", category: "Food" },
  // Travel
  { emoji: "\u{1F30D}", name: "Globe Europe-Africa", category: "Travel" },
  { emoji: "\u{1F30E}", name: "Globe Americas", category: "Travel" },
  { emoji: "\u{1F30F}", name: "Globe Asia-Australia", category: "Travel" },
  { emoji: "\u{1F3D4}\uFE0F", name: "Snow-Capped Mountain", category: "Travel" },
  { emoji: "\u{1F3D6}\uFE0F", name: "Beach with Umbrella", category: "Travel" },
  { emoji: "\u{1F3DD}\uFE0F", name: "Desert Island", category: "Travel" },
  { emoji: "\u{1F3DE}\uFE0F", name: "National Park", category: "Travel" },
  { emoji: "\u{1F3DF}\uFE0F", name: "Stadium", category: "Travel" },
  { emoji: "\u{1F3E0}", name: "House", category: "Travel" },
  { emoji: "\u{1F3E2}", name: "Office Building", category: "Travel" },
  { emoji: "\u{1F3E5}", name: "Hospital", category: "Travel" },
  { emoji: "\u{1F3EB}", name: "School", category: "Travel" },
  { emoji: "\u{1F3ED}", name: "Factory", category: "Travel" },
  { emoji: "\u{1F697}", name: "Automobile", category: "Travel" },
  { emoji: "\u{1F695}", name: "Taxi", category: "Travel" },
  { emoji: "\u{1F68C}", name: "Bus", category: "Travel" },
  { emoji: "\u{1F682}", name: "Locomotive", category: "Travel" },
  { emoji: "\u2708\uFE0F", name: "Airplane", category: "Travel" },
  { emoji: "\u{1F680}", name: "Rocket", category: "Travel" },
  { emoji: "\u{1F6F8}", name: "Flying Saucer", category: "Travel" },
  { emoji: "\u{1F6A2}", name: "Ship", category: "Travel" },
  { emoji: "\u{1F3F0}", name: "Castle", category: "Travel" },
  { emoji: "\u{1F5FC}", name: "Tokyo Tower", category: "Travel" },
  { emoji: "\u{1F5FD}", name: "Statue of Liberty", category: "Travel" },
  { emoji: "\u26EA", name: "Church", category: "Travel" },
  { emoji: "\u{1F54C}", name: "Mosque", category: "Travel" },
  // Objects
  { emoji: "\u231A", name: "Watch", category: "Objects" },
  { emoji: "\u{1F4F1}", name: "Mobile Phone", category: "Objects" },
  { emoji: "\u{1F4BB}", name: "Laptop", category: "Objects" },
  { emoji: "\u{1F5A5}\uFE0F", name: "Desktop Computer", category: "Objects" },
  { emoji: "\u{1F4F7}", name: "Camera", category: "Objects" },
  { emoji: "\u{1F4F9}", name: "Video Camera", category: "Objects" },
  { emoji: "\u{1F4FA}", name: "Television", category: "Objects" },
  { emoji: "\u{1F3A4}", name: "Microphone", category: "Objects" },
  { emoji: "\u{1F3A7}", name: "Headphone", category: "Objects" },
  { emoji: "\u{1F3B5}", name: "Musical Note", category: "Objects" },
  { emoji: "\u{1F3B6}", name: "Musical Notes", category: "Objects" },
  { emoji: "\u{1F3B8}", name: "Guitar", category: "Objects" },
  { emoji: "\u{1F3B9}", name: "Musical Keyboard", category: "Objects" },
  { emoji: "\u{1F3BA}", name: "Trumpet", category: "Objects" },
  { emoji: "\u{1F514}", name: "Bell", category: "Objects" },
  { emoji: "\u{1F4E7}", name: "Email", category: "Objects" },
  { emoji: "\u{1F4DD}", name: "Memo", category: "Objects" },
  { emoji: "\u{1F4D6}", name: "Open Book", category: "Objects" },
  { emoji: "\u{1F4DA}", name: "Books", category: "Objects" },
  { emoji: "\u{1F4CE}", name: "Paperclip", category: "Objects" },
  { emoji: "\u2702\uFE0F", name: "Scissors", category: "Objects" },
  { emoji: "\u{1F4CC}", name: "Pushpin", category: "Objects" },
  { emoji: "\u{1F512}", name: "Locked", category: "Objects" },
  { emoji: "\u{1F513}", name: "Unlocked", category: "Objects" },
  { emoji: "\u{1F511}", name: "Key", category: "Objects" },
  { emoji: "\u{1F528}", name: "Hammer", category: "Objects" },
  { emoji: "\u{1F52E}", name: "Crystal Ball", category: "Objects" },
  { emoji: "\u{1F4A1}", name: "Light Bulb", category: "Objects" },
  { emoji: "\u{1F4B0}", name: "Money Bag", category: "Objects" },
  { emoji: "\u{1F4B3}", name: "Credit Card", category: "Objects" },
  { emoji: "\u{1F48E}", name: "Gem Stone", category: "Objects" },
  { emoji: "\u{1F3AE}", name: "Video Game", category: "Objects" },
  { emoji: "\u{1F3B2}", name: "Game Die", category: "Objects" },
  // Symbols
  { emoji: "\u2764\uFE0F", name: "Red Heart", category: "Symbols" },
  { emoji: "\u{1F9E1}", name: "Orange Heart", category: "Symbols" },
  { emoji: "\u{1F49B}", name: "Yellow Heart", category: "Symbols" },
  { emoji: "\u{1F49A}", name: "Green Heart", category: "Symbols" },
  { emoji: "\u{1F499}", name: "Blue Heart", category: "Symbols" },
  { emoji: "\u{1F49C}", name: "Purple Heart", category: "Symbols" },
  { emoji: "\u{1F5A4}", name: "Black Heart", category: "Symbols" },
  { emoji: "\u{1F494}", name: "Broken Heart", category: "Symbols" },
  { emoji: "\u{1F495}", name: "Two Hearts", category: "Symbols" },
  { emoji: "\u{1F496}", name: "Sparkling Heart", category: "Symbols" },
  { emoji: "\u{1F4AF}", name: "Hundred Points", category: "Symbols" },
  { emoji: "\u{1F4A2}", name: "Anger Symbol", category: "Symbols" },
  { emoji: "\u{1F4A5}", name: "Collision", category: "Symbols" },
  { emoji: "\u{1F4AB}", name: "Dizzy", category: "Symbols" },
  { emoji: "\u{1F4AC}", name: "Speech Balloon", category: "Symbols" },
  { emoji: "\u2B50", name: "Star", category: "Symbols" },
  { emoji: "\u{1F31F}", name: "Glowing Star", category: "Symbols" },
  { emoji: "\u2728", name: "Sparkles", category: "Symbols" },
  { emoji: "\u26A1", name: "High Voltage", category: "Symbols" },
  { emoji: "\u{1F525}", name: "Fire", category: "Symbols" },
  { emoji: "\u{1F4A7}", name: "Droplet", category: "Symbols" },
  { emoji: "\u2705", name: "Check Mark Button", category: "Symbols" },
  { emoji: "\u274C", name: "Cross Mark", category: "Symbols" },
  { emoji: "\u2757", name: "Exclamation Mark", category: "Symbols" },
  { emoji: "\u2753", name: "Question Mark", category: "Symbols" },
  { emoji: "\u267B\uFE0F", name: "Recycling Symbol", category: "Symbols" },
  { emoji: "\u{1F6AB}", name: "Prohibited", category: "Symbols" },
  { emoji: "\u2795", name: "Plus", category: "Symbols" },
  { emoji: "\u2796", name: "Minus", category: "Symbols" },
  { emoji: "\u27A1\uFE0F", name: "Right Arrow", category: "Symbols" },
  { emoji: "\u{1F197}", name: "OK Button", category: "Symbols" },
  { emoji: "\u{1F199}", name: "UP! Button", category: "Symbols" },
  { emoji: "\u{1F192}", name: "COOL Button", category: "Symbols" },
  { emoji: "\u{1F195}", name: "NEW Button", category: "Symbols" },
  { emoji: "\u{1F193}", name: "FREE Button", category: "Symbols" },
  { emoji: "\u{1F3C6}", name: "Trophy", category: "Symbols" },
];

const CATEGORIES = ["All", "Smileys", "People", "Animals", "Food", "Travel", "Objects", "Symbols"];

function getCodePoint(emoji: string): string {
  const codePoints = [...emoji]
    .map((c) => {
      const cp = c.codePointAt(0);
      if (cp === undefined) return "";
      if (cp === 0xfe0f) return ""; // skip variation selectors
      return "U+" + cp.toString(16).toUpperCase().padStart(4, "0");
    })
    .filter(Boolean);
  return codePoints.join(" ");
}

export function EmojiPickerTool() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [copied, setCopied] = useState<string | null>(null);
  const [selected, setSelected] = useState<EmojiEntry | null>(null);

  const filtered = useMemo(() => {
    return EMOJIS.filter((e) => {
      const matchesCategory = category === "All" || e.category === category;
      const matchesSearch = !search.trim() || e.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  const handleCopy = useCallback(async (emoji: string) => {
    try {
      await navigator.clipboard.writeText(emoji);
      setCopied(emoji);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = emoji;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(emoji);
      setTimeout(() => setCopied(null), 1500);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Emoji Picker</h1>
      <p className="text-gray-600 mb-6">
        Search and browse emojis by category. Click any emoji to copy it to your clipboard.
        View emoji names and Unicode code points.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search emojis by name..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors cursor-pointer ${
                category === cat
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Emoji grid */}
        <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1">
          {filtered.map((entry, i) => (
            <button
              key={`${entry.emoji}-${i}`}
              onClick={() => {
                handleCopy(entry.emoji);
                setSelected(entry);
              }}
              title={entry.name}
              className={`relative w-10 h-10 flex items-center justify-center text-2xl rounded-lg hover:bg-blue-50 transition-colors cursor-pointer ${
                copied === entry.emoji ? "bg-green-100 ring-2 ring-green-400" : ""
              } ${selected?.emoji === entry.emoji ? "bg-blue-50 ring-2 ring-blue-400" : ""}`}
            >
              {entry.emoji}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-8">No emojis found matching your search.</p>
        )}

        <p className="text-xs text-gray-400 mt-3 text-center">
          Showing {filtered.length} of {EMOJIS.length} emojis
        </p>
      </div>

      {/* Selected emoji details */}
      {selected && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Selected Emoji</h2>
          <div className="flex items-center gap-6">
            <span className="text-6xl">{selected.emoji}</span>
            <div>
              <p className="font-medium text-gray-900">{selected.name}</p>
              <p className="text-sm text-gray-500">Category: {selected.category}</p>
              <p className="text-sm font-mono text-gray-500">{getCodePoint(selected.emoji)}</p>
              <button
                onClick={() => handleCopy(selected.emoji)}
                className="mt-2 px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
              >
                {copied === selected.emoji ? "Copied!" : "Copy Emoji"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Emoji Picker</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Browse over 200 popular emojis organized by category. Search by name, filter by
          type, and click any emoji to instantly copy it to your clipboard. Each emoji shows
          its official Unicode name and code point. Everything runs in your browser with no
          data sent to any server.
        </p>
      </section>
    </div>
  );
}
