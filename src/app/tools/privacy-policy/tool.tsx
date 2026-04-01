"use client";

import { useState, useCallback, useMemo } from "react";

export function PrivacyPolicyTool() {
  const [websiteName, setWebsiteName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [collectsCookies, setCollectsCookies] = useState(false);
  const [collectsAnalytics, setCollectsAnalytics] = useState(false);
  const [collectsEmails, setCollectsEmails] = useState(false);
  const [collectsPayment, setCollectsPayment] = useState(false);
  const [thirdPartySharing, setThirdPartySharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const siteName = websiteName || "[Website Name]";
  const siteUrl = websiteUrl || "[Website URL]";
  const email = contactEmail || "[Contact Email]";
  const company = companyName || "[Company Name]";

  const policy = useMemo(() => {
    const sections: string[] = [];

    sections.push(`PRIVACY POLICY

Last updated: ${today}

${company} ("we," "us," or "our") operates ${siteName} (${siteUrl}). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.

Please read this Privacy Policy carefully. By using the site, you agree to the collection and use of information in accordance with this policy.`);

    // Information We Collect
    let infoSection = `INFORMATION WE COLLECT

We may collect information about you in a variety of ways. The information we may collect via the website includes:

Personal Data
While using our website, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you.`;

    if (collectsEmails) {
      infoSection += ` This may include your email address, first and last name, and other information you voluntarily provide to us.`;
    }

    if (collectsPayment) {
      infoSection += `

Payment Information
If you make a purchase through our website, we may collect payment-related information such as your billing address and payment card details. All payment information is processed securely through our third-party payment processors, and we do not store your full payment card information on our servers.`;
    }

    sections.push(infoSection);

    // Cookies
    if (collectsCookies) {
      sections.push(`COOKIES AND TRACKING TECHNOLOGIES

We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with a small amount of data that are sent to your browser from a website and stored on your device.

You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.

Types of cookies we use:
- Essential cookies: Required for the website to function properly.
- Preference cookies: Remember your settings and preferences.
- Analytics cookies: Help us understand how visitors interact with our website.`);
    }

    // Analytics
    if (collectsAnalytics) {
      sections.push(`ANALYTICS

We may use third-party analytics services (such as Google Analytics) to collect, monitor, and analyze usage data in order to improve our website. These services may collect information such as your IP address, browser type, pages visited, time spent on pages, and other diagnostic data.

The analytics providers may use cookies and similar technologies to collect and analyze information about the use of our website and report on activities and trends.`);
    }

    // Use of Information
    sections.push(`HOW WE USE YOUR INFORMATION

We may use the information we collect about you for various purposes, including to:

- Provide, operate, and maintain our website
- Improve, personalize, and expand our website
- Understand and analyze how you use our website
- Develop new products, services, features, and functionality${
      collectsEmails
        ? "\n- Communicate with you, either directly or through one of our partners, including for customer service, updates, and other website-related communications\n- Send you emails and newsletters (you can opt out at any time)"
        : ""
    }${
      collectsPayment
        ? "\n- Process your transactions and manage your orders"
        : ""
    }
- Find and prevent fraud
- Comply with legal obligations`);

    // Third-Party Sharing
    if (thirdPartySharing) {
      sections.push(`THIRD-PARTY SHARING

We may share your information with third parties in certain situations, including:

- Service Providers: We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf.
- Business Transfers: We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business.
- Legal Requirements: We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, or legal process.
- With Your Consent: We may disclose your personal information for any other purpose with your consent.`);
    } else {
      sections.push(`THIRD-PARTY SHARING

We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except as described in this Privacy Policy. We may share information with trusted third parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.`);
    }

    // Data Security
    sections.push(`DATA SECURITY

We use administrative, technical, and physical security measures to protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against interception or misuse.`);

    // Your Rights
    sections.push(`YOUR RIGHTS

Depending on your location, you may have the following rights regarding your personal data:

- The right to access the personal data we hold about you
- The right to request correction of inaccurate personal data
- The right to request deletion of your personal data
- The right to object to processing of your personal data
- The right to data portability
- The right to withdraw consent

To exercise any of these rights, please contact us at ${email}.`);

    // Children's Privacy
    sections.push(`CHILDREN'S PRIVACY

Our website is not intended for children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us at ${email}.`);

    // Changes
    sections.push(`CHANGES TO THIS PRIVACY POLICY

We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.

You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.`);

    // Contact
    sections.push(`CONTACT US

If you have any questions about this Privacy Policy, please contact us:

- By email: ${email}
- By visiting: ${siteUrl}`);

    return sections.join("\n\n---\n\n");
  }, [
    siteName,
    siteUrl,
    email,
    company,
    today,
    collectsCookies,
    collectsAnalytics,
    collectsEmails,
    collectsPayment,
    thirdPartySharing,
  ]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(policy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = policy;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [policy]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([policy], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "privacy-policy.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [policy]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Privacy Policy Generator
      </h1>
      <p className="text-gray-600 mb-6">
        Fill in your website details and check the boxes that apply. A
        professional privacy policy will be generated instantly. Copy or
        download it for your site.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website Name
            </label>
            <input
              type="text"
              placeholder="My Awesome Site"
              value={websiteName}
              onChange={(e) => setWebsiteName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website URL
            </label>
            <input
              type="text"
              placeholder="https://example.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              placeholder="privacy@example.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company / Owner Name
            </label>
            <input
              type="text"
              placeholder="Acme Inc."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">
            What does your website collect or use?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                label: "Cookies",
                checked: collectsCookies,
                set: setCollectsCookies,
              },
              {
                label: "Analytics (e.g., Google Analytics)",
                checked: collectsAnalytics,
                set: setCollectsAnalytics,
              },
              {
                label: "Email addresses",
                checked: collectsEmails,
                set: setCollectsEmails,
              },
              {
                label: "Payment information",
                checked: collectsPayment,
                set: setCollectsPayment,
              },
              {
                label: "Third-party data sharing",
                checked: thirdPartySharing,
                set: setThirdPartySharing,
              },
            ].map((opt) => (
              <label
                key={opt.label}
                className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={opt.checked}
                  onChange={(e) => opt.set(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={handleCopy}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer"
        >
          {copied ? "Copied!" : "Copy to Clipboard"}
        </button>
        <button
          onClick={handleDownload}
          className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer"
        >
          Download as Text
        </button>
      </div>

      {/* Generated policy preview */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
          Generated Privacy Policy
        </p>
        <div className="prose prose-sm prose-gray max-w-none">
          {policy.split("\n\n---\n\n").map((section, i) => (
            <div key={i} className={i > 0 ? "mt-6 pt-6 border-t border-gray-200" : ""}>
              {section.split("\n").map((line, j) => {
                const trimmed = line.trim();
                if (!trimmed) return <br key={j} />;
                // All-caps lines are headings
                if (
                  trimmed === trimmed.toUpperCase() &&
                  trimmed.length > 3 &&
                  !/^\d/.test(trimmed) &&
                  !trimmed.startsWith("-")
                ) {
                  return (
                    <h3
                      key={j}
                      className="text-base font-bold text-gray-900 mt-2 mb-1"
                    >
                      {trimmed}
                    </h3>
                  );
                }
                if (trimmed.startsWith("- ")) {
                  return (
                    <p key={j} className="ml-4 text-sm text-gray-700 leading-relaxed">
                      {trimmed}
                    </p>
                  );
                }
                return (
                  <p key={j} className="text-sm text-gray-700 leading-relaxed">
                    {trimmed}
                  </p>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          About This Privacy Policy Generator
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          This tool generates a privacy policy template based on your website
          details and data collection practices. It covers personal data,
          cookies, analytics, third-party sharing, data security, user rights,
          and children&rsquo;s privacy. While this template provides a solid
          starting point, consult a legal professional to ensure full
          compliance with applicable privacy laws such as GDPR, CCPA, and
          others. Everything is generated in your browser &mdash; no data is
          sent anywhere.
        </p>
      </section>
    </div>
  );
}
