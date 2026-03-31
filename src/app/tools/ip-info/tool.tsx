"use client";

import { useState, useEffect, useCallback } from "react";

function isValidIPv4(ip: string): boolean {
  const parts = ip.split(".");
  if (parts.length !== 4) return false;
  return parts.every((p) => {
    if (!/^\d{1,3}$/.test(p)) return false;
    const n = parseInt(p, 10);
    return n >= 0 && n <= 255 && String(n) === p;
  });
}

function isValidIPv6(ip: string): boolean {
  // Handle :: shorthand
  const expanded = ip.toLowerCase();
  if (expanded === "::") return true;
  const doubleColonCount = (expanded.match(/::/g) || []).length;
  if (doubleColonCount > 1) return false;

  let groups: string[];
  if (doubleColonCount === 1) {
    const [left, right] = expanded.split("::");
    const leftGroups = left ? left.split(":") : [];
    const rightGroups = right ? right.split(":") : [];
    const fillCount = 8 - leftGroups.length - rightGroups.length;
    if (fillCount < 0) return false;
    groups = [...leftGroups, ...Array(fillCount).fill("0"), ...rightGroups];
  } else {
    groups = expanded.split(":");
  }

  if (groups.length !== 8) return false;
  return groups.every((g) => /^[0-9a-f]{1,4}$/.test(g));
}

function ipToLong(ip: string): number {
  const parts = ip.split(".").map(Number);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function longToIp(n: number): string {
  return [
    (n >>> 24) & 255,
    (n >>> 16) & 255,
    (n >>> 8) & 255,
    n & 255,
  ].join(".");
}

interface SubnetResult {
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  subnetMask: string;
  wildcardMask: string;
  totalHosts: number;
  usableHosts: number;
  cidr: number;
}

function calculateSubnet(ip: string, cidr: number): SubnetResult | null {
  if (!isValidIPv4(ip) || cidr < 0 || cidr > 32) return null;

  const ipLong = ipToLong(ip);
  const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  const wildcard = (~mask) >>> 0;
  const network = (ipLong & mask) >>> 0;
  const broadcast = (network | wildcard) >>> 0;
  const totalHosts = Math.pow(2, 32 - cidr);
  const usableHosts = cidr >= 31 ? totalHosts : totalHosts - 2;

  return {
    networkAddress: longToIp(network),
    broadcastAddress: longToIp(broadcast),
    firstHost: cidr >= 31 ? longToIp(network) : longToIp(network + 1),
    lastHost: cidr >= 31 ? longToIp(broadcast) : longToIp(broadcast - 1),
    subnetMask: longToIp(mask),
    wildcardMask: longToIp(wildcard),
    totalHosts,
    usableHosts: Math.max(usableHosts, 0),
    cidr,
  };
}

export function IpInfoTool() {
  const [publicIp, setPublicIp] = useState<string | null>(null);
  const [ipLoading, setIpLoading] = useState(true);
  const [ipError, setIpError] = useState<string | null>(null);

  const [validateInput, setValidateInput] = useState("");
  const [validationResult, setValidationResult] = useState<string | null>(null);

  const [subnetIp, setSubnetIp] = useState("192.168.1.0");
  const [subnetCidr, setSubnetCidr] = useState(24);
  const [subnetResult, setSubnetResult] = useState<SubnetResult | null>(null);

  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((r) => r.json())
      .then((data) => {
        setPublicIp(data.ip);
        setIpLoading(false);
      })
      .catch(() => {
        setIpError("Could not fetch public IP.");
        setIpLoading(false);
      });
  }, []);

  const handleValidate = useCallback(() => {
    const trimmed = validateInput.trim();
    if (!trimmed) {
      setValidationResult(null);
      return;
    }
    if (isValidIPv4(trimmed)) {
      setValidationResult("Valid IPv4 address");
    } else if (isValidIPv6(trimmed)) {
      setValidationResult("Valid IPv6 address");
    } else {
      setValidationResult("Invalid IP address (not valid IPv4 or IPv6)");
    }
  }, [validateInput]);

  const handleSubnetCalculate = useCallback(() => {
    const result = calculateSubnet(subnetIp.trim(), subnetCidr);
    setSubnetResult(result);
  }, [subnetIp, subnetCidr]);

  useEffect(() => {
    handleSubnetCalculate();
  }, [handleSubnetCalculate]);

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        IP Address Lookup & Subnet Calculator
      </h1>
      <p className="text-gray-600 mb-6">
        Find your public IP address, validate IP formats, and calculate subnet
        details from CIDR notation. All processing runs in your browser.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Public IP */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Your Public IP Address
        </h2>
        {ipLoading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>Detecting...</span>
          </div>
        ) : ipError ? (
          <p className="text-red-600 text-sm">{ipError}</p>
        ) : (
          <div className="flex items-center gap-3">
            <code className="text-2xl font-mono font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
              {publicIp}
            </code>
            <button
              onClick={() => handleCopy(publicIp || "", "publicIp")}
              className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {copiedField === "publicIp" ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </div>

      {/* IP Validator */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          IP Address Validator
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={validateInput}
            onChange={(e) => setValidateInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleValidate()}
            placeholder="Enter an IP address (e.g., 192.168.1.1 or ::1)"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <button
            onClick={handleValidate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer"
          >
            Validate
          </button>
        </div>
        {validationResult && (
          <p
            className={`mt-3 text-sm font-medium ${
              validationResult.startsWith("Valid")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {validationResult}
          </p>
        )}
      </div>

      {/* Subnet Calculator */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Subnet Calculator
        </h2>
        <div className="flex gap-2 mb-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              IP Address
            </label>
            <input
              type="text"
              value={subnetIp}
              onChange={(e) => setSubnetIp(e.target.value)}
              placeholder="192.168.1.0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="w-24">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              CIDR (/{subnetCidr})
            </label>
            <input
              type="number"
              min={0}
              max={32}
              value={subnetCidr}
              onChange={(e) =>
                setSubnetCidr(
                  Math.min(32, Math.max(0, parseInt(e.target.value, 10) || 0))
                )
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {subnetResult ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "Network Address", value: subnetResult.networkAddress },
              { label: "Broadcast Address", value: subnetResult.broadcastAddress },
              { label: "First Usable Host", value: subnetResult.firstHost },
              { label: "Last Usable Host", value: subnetResult.lastHost },
              { label: "Subnet Mask", value: subnetResult.subnetMask },
              { label: "Wildcard Mask", value: subnetResult.wildcardMask },
              { label: "Total Addresses", value: subnetResult.totalHosts.toLocaleString() },
              { label: "Usable Hosts", value: subnetResult.usableHosts.toLocaleString() },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3"
              >
                <span className="text-sm text-gray-600">{label}</span>
                <code className="text-sm font-mono font-semibold text-gray-800">
                  {value}
                </code>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-red-600 text-sm">
            Enter a valid IPv4 address and CIDR prefix (0-32).
          </p>
        )}
      </div>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          About This Tool
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Your public IP is detected using the free ipify API. The IP validator
          checks against both IPv4 (dotted-decimal) and IPv6 (colon-hex)
          formats. The subnet calculator accepts any valid IPv4 address with a
          CIDR prefix length (0-32) and computes network address, broadcast
          address, host range, subnet mask, wildcard mask, and total host count.
        </p>
      </section>
    </div>
  );
}
