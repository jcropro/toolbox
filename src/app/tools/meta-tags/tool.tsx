"use client";

import { useState, useCallback, useMemo } from "react";

export function MetaTagsTool() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [author, setAuthor] = useState("");
  const [robotsIndex, setRobotsIndex] = useState("index");
  const [robotsFollow, setRobotsFollow] = useState("follow");

  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [ogType, setOgType] = useState("website");

  const [twitterCard, setTwitterCard] = useState("summary_large_image");
  const [twitterTitle, setTwitterTitle] = useState("");
  const [twitterDescription, setTwitterDescription] = useState("");
  const [twitterImage, setTwitterImage] = useState("");

  const [copied, setCopied] = useState(false);

  const generatedTags = useMemo(() => {
    const lines: string[] = [];

    if (title) lines.push(`<title>${escHtml(title)}</title>`);
    if (description)
      lines.push(
        `<meta name="description" content="${escAttr(description)}" />`
      );
    if (keywords)
      lines.push(`<meta name="keywords" content="${escAttr(keywords)}" />`);
    if (author)
      lines.push(`<meta name="author" content="${escAttr(author)}" />`);
    lines.push(
      `<meta name="robots" content="${robotsIndex}, ${robotsFollow}" />`
    );

    // Open Graph
    if (ogTitle || title)
      lines.push(
        `<meta property="og:title" content="${escAttr(ogTitle || title)}" />`
      );
    if (ogDescription || description)
      lines.push(
        `<meta property="og:description" content="${escAttr(ogDescription || description)}" />`
      );
    if (ogImage)
      lines.push(
        `<meta property="og:image" content="${escAttr(ogImage)}" />`
      );
    lines.push(
      `<meta property="og:type" content="${escAttr(ogType)}" />`
    );

    // Twitter Card
    lines.push(
      `<meta name="twitter:card" content="${escAttr(twitterCard)}" />`
    );
    if (twitterTitle || title)
      lines.push(
        `<meta name="twitter:title" content="${escAttr(twitterTitle || title)}" />`
      );
    if (twitterDescription || description)
      lines.push(
        `<meta name="twitter:description" content="${escAttr(twitterDescription || description)}" />`
      );
    if (twitterImage || ogImage)
      lines.push(
        `<meta name="twitter:image" content="${escAttr(twitterImage || ogImage)}" />`
      );

    return lines.join("\n");
  }, [
    title,
    description,
    keywords,
    author,
    robotsIndex,
    robotsFollow,
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
  ]);

  const copyTags = useCallback(() => {
    navigator.clipboard.writeText(generatedTags);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [generatedTags]);

  const previewTitle = title || "Page Title";
  const previewDesc = description || "A description of the page content will appear here in search results.";
  const previewUrl = "https://example.com/page";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Meta Tag Generator</h1>
      <p className="text-gray-600 mb-6">
        Generate SEO-optimized meta tags, Open Graph tags, and Twitter Card tags
        for your website. Preview how your page will look in Google search
        results.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Column */}
        <div className="space-y-6">
          {/* Basic Meta Tags */}
          <fieldset className="border border-gray-200 rounded-lg p-4">
            <legend className="text-lg font-semibold px-2">
              Basic Meta Tags
            </legend>
            <div className="space-y-3 mt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My Awesome Page"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  maxLength={70}
                />
                <span className="text-xs text-gray-400">
                  {title.length}/70 characters
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A brief description of the page..."
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  rows={3}
                  maxLength={160}
                />
                <span className="text-xs text-gray-400">
                  {description.length}/160 characters
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keywords
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="seo, meta tags, generator"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Author Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="flex gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Indexing
                  </label>
                  <select
                    value={robotsIndex}
                    onChange={(e) => setRobotsIndex(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="index">index</option>
                    <option value="noindex">noindex</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Following
                  </label>
                  <select
                    value={robotsFollow}
                    onChange={(e) => setRobotsFollow(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="follow">follow</option>
                    <option value="nofollow">nofollow</option>
                  </select>
                </div>
              </div>
            </div>
          </fieldset>

          {/* Open Graph */}
          <fieldset className="border border-gray-200 rounded-lg p-4">
            <legend className="text-lg font-semibold px-2">Open Graph</legend>
            <div className="space-y-3 mt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  og:title
                </label>
                <input
                  type="text"
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                  placeholder="Defaults to page title"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  og:description
                </label>
                <textarea
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                  placeholder="Defaults to page description"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  og:image URL
                </label>
                <input
                  type="url"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  og:type
                </label>
                <select
                  value={ogType}
                  onChange={(e) => setOgType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="website">website</option>
                  <option value="article">article</option>
                  <option value="product">product</option>
                  <option value="profile">profile</option>
                  <option value="video.other">video</option>
                  <option value="music.song">music</option>
                </select>
              </div>
            </div>
          </fieldset>

          {/* Twitter Card */}
          <fieldset className="border border-gray-200 rounded-lg p-4">
            <legend className="text-lg font-semibold px-2">Twitter Card</legend>
            <div className="space-y-3 mt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Type
                </label>
                <select
                  value={twitterCard}
                  onChange={(e) => setTwitterCard(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="summary">summary</option>
                  <option value="summary_large_image">
                    summary_large_image
                  </option>
                  <option value="app">app</option>
                  <option value="player">player</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={twitterTitle}
                  onChange={(e) => setTwitterTitle(e.target.value)}
                  placeholder="Defaults to page title"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={twitterDescription}
                  onChange={(e) => setTwitterDescription(e.target.value)}
                  placeholder="Defaults to page description"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={twitterImage}
                  onChange={(e) => setTwitterImage(e.target.value)}
                  placeholder="Defaults to og:image"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </fieldset>
        </div>

        {/* Output Column */}
        <div className="space-y-6">
          {/* Google Preview */}
          <div>
            <h2 className="text-lg font-semibold mb-3">
              Google Search Preview
            </h2>
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="text-sm text-green-700 truncate">
                {previewUrl}
              </div>
              <div className="text-xl text-blue-700 hover:underline cursor-pointer truncate">
                {previewTitle}
              </div>
              <div className="text-sm text-gray-600 line-clamp-2">
                {previewDesc}
              </div>
            </div>
          </div>

          {/* Generated Tags */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Generated Meta Tags</h2>
              <button
                onClick={copyTags}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium"
              >
                {copied ? "Copied!" : "Copy All"}
              </button>
            </div>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto font-mono whitespace-pre-wrap max-h-[500px] overflow-y-auto">
              {generatedTags || "<!-- Fill in the fields to generate meta tags -->"}
            </pre>
          </div>
        </div>
      </div>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>
    </div>
  );
}

function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escAttr(s: string): string {
  return s.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
