import type { Metadata } from "next";
import { GuestLogin } from "@/components/GuestPortal";

export const metadata: Metadata = { title: "Guest portal", robots: { index: false, follow: false } };

export default function GuestLoginPage() {
  return <GuestLogin />;
}
