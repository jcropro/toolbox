import type { Metadata } from "next";
import { IpInfoTool } from "./tool";

export const metadata: Metadata = {
  title: "IP Address Lookup & Subnet Calculator - Free Online Tool",
  description:
    "Look up your public IP address, validate IPv4/IPv6 formats, and calculate subnets with CIDR notation. Free online IP tool.",
  keywords: [
    "ip address lookup",
    "my ip address",
    "subnet calculator",
    "cidr calculator",
    "ipv4 validator",
    "ipv6 validator",
    "network calculator",
    "ip tool",
  ],
};

export default function IpInfoPage() {
  return <IpInfoTool />;
}
