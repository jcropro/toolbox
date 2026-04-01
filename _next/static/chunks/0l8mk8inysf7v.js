(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,63711,e=>{"use strict";var t=e.i(43476),a=e.i(71645);e.s(["PrivacyPolicyTool",0,function(){let[e,o]=(0,a.useState)(""),[r,s]=(0,a.useState)(""),[i,n]=(0,a.useState)(""),[l,c]=(0,a.useState)(""),[d,u]=(0,a.useState)(!1),[m,y]=(0,a.useState)(!1),[h,p]=(0,a.useState)(!1),[g,b]=(0,a.useState)(!1),[f,x]=(0,a.useState)(!1),[v,w]=(0,a.useState)(!1),C=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),N=e||"[Website Name]",P=r||"[Website URL]",j=i||"[Contact Email]",T=l||"[Company Name]",k=(0,a.useMemo)(()=>{let e=[];e.push(`PRIVACY POLICY

Last updated: ${C}

${T} ("we," "us," or "our") operates ${N} (${P}). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.

Please read this Privacy Policy carefully. By using the site, you agree to the collection and use of information in accordance with this policy.`);let t=`INFORMATION WE COLLECT

We may collect information about you in a variety of ways. The information we may collect via the website includes:

Personal Data
While using our website, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you.`;return h&&(t+=" This may include your email address, first and last name, and other information you voluntarily provide to us."),g&&(t+=`

Payment Information
If you make a purchase through our website, we may collect payment-related information such as your billing address and payment card details. All payment information is processed securely through our third-party payment processors, and we do not store your full payment card information on our servers.`),e.push(t),d&&e.push(`COOKIES AND TRACKING TECHNOLOGIES

We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with a small amount of data that are sent to your browser from a website and stored on your device.

You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.

Types of cookies we use:
- Essential cookies: Required for the website to function properly.
- Preference cookies: Remember your settings and preferences.
- Analytics cookies: Help us understand how visitors interact with our website.`),m&&e.push(`ANALYTICS

We may use third-party analytics services (such as Google Analytics) to collect, monitor, and analyze usage data in order to improve our website. These services may collect information such as your IP address, browser type, pages visited, time spent on pages, and other diagnostic data.

The analytics providers may use cookies and similar technologies to collect and analyze information about the use of our website and report on activities and trends.`),e.push(`HOW WE USE YOUR INFORMATION

We may use the information we collect about you for various purposes, including to:

- Provide, operate, and maintain our website
- Improve, personalize, and expand our website
- Understand and analyze how you use our website
- Develop new products, services, features, and functionality${h?"\n- Communicate with you, either directly or through one of our partners, including for customer service, updates, and other website-related communications\n- Send you emails and newsletters (you can opt out at any time)":""}${g?"\n- Process your transactions and manage your orders":""}
- Find and prevent fraud
- Comply with legal obligations`),f?e.push(`THIRD-PARTY SHARING

We may share your information with third parties in certain situations, including:

- Service Providers: We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf.
- Business Transfers: We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business.
- Legal Requirements: We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, or legal process.
- With Your Consent: We may disclose your personal information for any other purpose with your consent.`):e.push(`THIRD-PARTY SHARING

We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except as described in this Privacy Policy. We may share information with trusted third parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.`),e.push(`DATA SECURITY

We use administrative, technical, and physical security measures to protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against interception or misuse.`),e.push(`YOUR RIGHTS

Depending on your location, you may have the following rights regarding your personal data:

- The right to access the personal data we hold about you
- The right to request correction of inaccurate personal data
- The right to request deletion of your personal data
- The right to object to processing of your personal data
- The right to data portability
- The right to withdraw consent

To exercise any of these rights, please contact us at ${j}.`),e.push(`CHILDREN'S PRIVACY

Our website is not intended for children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us at ${j}.`),e.push(`CHANGES TO THIS PRIVACY POLICY

We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.

You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.`),e.push(`CONTACT US

If you have any questions about this Privacy Policy, please contact us:

- By email: ${j}
- By visiting: ${P}`),e.join("\n\n---\n\n")},[N,P,j,T,C,d,m,h,g,f]),A=(0,a.useCallback)(async()=>{try{await navigator.clipboard.writeText(k),w(!0),setTimeout(()=>w(!1),2e3)}catch{let e=document.createElement("textarea");e.value=k,document.body.appendChild(e),e.select(),document.execCommand("copy"),document.body.removeChild(e),w(!0),setTimeout(()=>w(!1),2e3)}},[k]),S=(0,a.useCallback)(()=>{let e=new Blob([k],{type:"text/plain"}),t=URL.createObjectURL(e),a=document.createElement("a");a.href=t,a.download="privacy-policy.txt",document.body.appendChild(a),a.click(),document.body.removeChild(a),URL.revokeObjectURL(t)},[k]);return(0,t.jsxs)("div",{className:"max-w-4xl mx-auto px-4 py-8",children:[(0,t.jsx)("h1",{className:"text-3xl font-bold text-gray-900 mb-2",children:"Privacy Policy Generator"}),(0,t.jsx)("p",{className:"text-gray-600 mb-6",children:"Fill in your website details and check the boxes that apply. A professional privacy policy will be generated instantly. Copy or download it for your site."}),(0,t.jsx)("div",{className:"ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center",children:"Ad Space"}),(0,t.jsxs)("div",{className:"bg-white border border-gray-200 rounded-xl p-6 mb-8 space-y-5",children:[(0,t.jsxs)("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Website Name"}),(0,t.jsx)("input",{type:"text",placeholder:"My Awesome Site",value:e,onChange:e=>o(e.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Website URL"}),(0,t.jsx)("input",{type:"text",placeholder:"https://example.com",value:r,onChange:e=>s(e.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Contact Email"}),(0,t.jsx)("input",{type:"email",placeholder:"privacy@example.com",value:i,onChange:e=>n(e.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Company / Owner Name"}),(0,t.jsx)("input",{type:"text",placeholder:"Acme Inc.",value:l,onChange:e=>c(e.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium text-gray-700 mb-3",children:"What does your website collect or use?"}),(0,t.jsx)("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3",children:[{label:"Cookies",checked:d,set:u},{label:"Analytics (e.g., Google Analytics)",checked:m,set:y},{label:"Email addresses",checked:h,set:p},{label:"Payment information",checked:g,set:b},{label:"Third-party data sharing",checked:f,set:x}].map(e=>(0,t.jsxs)("label",{className:"flex items-center gap-2 text-sm text-gray-700 cursor-pointer",children:[(0,t.jsx)("input",{type:"checkbox",checked:e.checked,onChange:t=>e.set(t.target.checked),className:"rounded border-gray-300 text-blue-600 focus:ring-blue-500"}),e.label]},e.label))})]})]}),(0,t.jsxs)("div",{className:"flex flex-wrap gap-3 mb-6",children:[(0,t.jsx)("button",{onClick:A,className:"px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer",children:v?"Copied!":"Copy to Clipboard"}),(0,t.jsx)("button",{onClick:S,className:"px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer",children:"Download as Text"})]}),(0,t.jsxs)("div",{className:"bg-gray-50 border border-gray-200 rounded-xl p-6",children:[(0,t.jsx)("p",{className:"text-xs font-medium text-gray-500 uppercase tracking-wide mb-3",children:"Generated Privacy Policy"}),(0,t.jsx)("div",{className:"prose prose-sm prose-gray max-w-none",children:k.split("\n\n---\n\n").map((e,a)=>(0,t.jsx)("div",{className:a>0?"mt-6 pt-6 border-t border-gray-200":"",children:e.split("\n").map((e,a)=>{let o=e.trim();return o?o!==o.toUpperCase()||!(o.length>3)||/^\d/.test(o)||o.startsWith("-")?o.startsWith("- ")?(0,t.jsx)("p",{className:"ml-4 text-sm text-gray-700 leading-relaxed",children:o},a):(0,t.jsx)("p",{className:"text-sm text-gray-700 leading-relaxed",children:o},a):(0,t.jsx)("h3",{className:"text-base font-bold text-gray-900 mt-2 mb-1",children:o},a):(0,t.jsx)("br",{},a)})},a))})]}),(0,t.jsx)("div",{className:"ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center",children:"Ad Space"}),(0,t.jsxs)("section",{className:"mt-8 prose prose-gray max-w-none",children:[(0,t.jsx)("h2",{className:"text-xl font-semibold text-gray-900 mb-3",children:"About This Privacy Policy Generator"}),(0,t.jsx)("p",{className:"text-gray-600 text-sm leading-relaxed",children:"This tool generates a privacy policy template based on your website details and data collection practices. It covers personal data, cookies, analytics, third-party sharing, data security, user rights, and children’s privacy. While this template provides a solid starting point, consult a legal professional to ensure full compliance with applicable privacy laws such as GDPR, CCPA, and others. Everything is generated in your browser — no data is sent anywhere."})]})]})}])}]);