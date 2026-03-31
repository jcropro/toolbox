(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,23360,e=>{"use strict";var t=e.i(43476),r=e.i(71645);function o(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function l(e){let t=o(e);return(t=(t=(t=(t=(t=(t=(t=(t=(t=t.replace(/`([^`]+)`/g,"<code>$1</code>")).replace(/!\[([^\]]*)\]\(([^)]+)\)/g,'<img src="$2" alt="$1" />')).replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2">$1</a>')).replace(/\*\*\*(.+?)\*\*\*/g,"<strong><em>$1</em></strong>")).replace(/___(.+?)___/g,"<strong><em>$1</em></strong>")).replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")).replace(/__(.+?)__/g,"<strong>$1</strong>")).replace(/\*(.+?)\*/g,"<em>$1</em>")).replace(/_(.+?)_/g,"<em>$1</em>")).replace(/~~(.+?)~~/g,"<del>$1</del>")}let s=`# Welcome to Markdown

This is a **bold** and *italic* text example with a [link](https://example.com).

## Features

- Unordered list item
- Another item with \`inline code\`
- **Bold list item**

1. First ordered item
2. Second ordered item
3. Third ordered item

> This is a blockquote. It can contain **formatted** text.

### Code Block

\`\`\`
function hello() {
  console.log("Hello, world!");
}
\`\`\`

---

That's it! Start typing your own markdown on the left.`;e.s(["MarkdownToHtmlTool",0,function(){let[e,n]=(0,r.useState)(s),[i,a]=(0,r.useState)(!1),[c,d]=(0,r.useState)(!1),m=(0,r.useMemo)(()=>(function(e){let t=e.split("\n"),r=[],s=!1,n=[],i=null;function a(){i&&(r.push("ul"===i?"</ul>":"</ol>"),i=null)}for(let e=0;e<t.length;e++){let c=t[e];if(c.trimStart().startsWith("```")){s?(r.push("<pre><code>"+o(n.join("\n"))+"</code></pre>"),s=!1):(a(),s=!0,n=[]);continue}if(s){n.push(c);continue}if(""===c.trim()){a();continue}let d=c.match(/^(#{1,6})\s+(.+)$/);if(d){a();let e=d[1].length;r.push(`<h${e}>${l(d[2])}</h${e}>`);continue}if(/^(-{3,}|\*{3,}|_{3,})$/.test(c.trim())){a(),r.push("<hr />");continue}let m=c.match(/^>\s?(.*)$/);if(m){a(),r.push(`<blockquote>${l(m[1])}</blockquote>`);continue}let u=c.match(/^[\s]*[-*+]\s+(.+)$/);if(u){"ul"!==i&&(a(),r.push("<ul>"),i="ul"),r.push(`<li>${l(u[1])}</li>`);continue}let p=c.match(/^[\s]*\d+\.\s+(.+)$/);if(p){"ol"!==i&&(a(),r.push("<ol>"),i="ol"),r.push(`<li>${l(p[1])}</li>`);continue}a(),r.push(`<p>${l(c)}</p>`)}return s&&r.push("<pre><code>"+o(n.join("\n"))+"</code></pre>"),a(),r.join("\n")})(e),[e]),u=async()=>{await navigator.clipboard.writeText(m),a(!0),setTimeout(()=>a(!1),2e3)};return(0,t.jsxs)("div",{className:"max-w-6xl mx-auto px-4 py-8",children:[(0,t.jsx)("h1",{className:"text-3xl font-bold mb-2",children:"Markdown to HTML Converter"}),(0,t.jsx)("p",{className:"text-gray-600 mb-6",children:"Write or paste Markdown in the editor and see the HTML output in real-time. Supports headers, bold, italic, lists, links, code blocks, blockquotes, and more."}),(0,t.jsx)("div",{className:"ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center",children:"Ad Space"}),(0,t.jsxs)("div",{className:"bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6",children:[(0,t.jsxs)("div",{className:"flex justify-between items-center mb-4",children:[(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsx)("button",{onClick:()=>d(!1),className:`px-3 py-1 text-sm rounded-md font-medium transition-colors ${!c?"bg-blue-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`,children:"Preview"}),(0,t.jsx)("button",{onClick:()=>d(!0),className:`px-3 py-1 text-sm rounded-md font-medium transition-colors ${c?"bg-blue-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`,children:"Raw HTML"})]}),(0,t.jsx)("button",{onClick:u,className:"text-sm text-blue-600 hover:text-blue-800 font-medium",children:i?"Copied!":"Copy HTML"})]}),(0,t.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Markdown"}),(0,t.jsx)("textarea",{value:e,onChange:e=>n(e.target.value),className:"w-full h-[500px] border border-gray-300 rounded-md px-3 py-2 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"Type your markdown here...",spellCheck:!1})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:c?"HTML Source":"Preview"}),c?(0,t.jsx)("pre",{className:"w-full h-[500px] border border-gray-300 rounded-md px-3 py-2 text-sm font-mono bg-gray-50 overflow-auto whitespace-pre-wrap",children:m}):(0,t.jsx)("div",{className:"w-full h-[500px] border border-gray-300 rounded-md px-3 py-2 text-sm bg-white overflow-auto prose prose-sm max-w-none",dangerouslySetInnerHTML:{__html:m}})]})]})]}),(0,t.jsx)("div",{className:"ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center",children:"Ad Space"})]})}])}]);