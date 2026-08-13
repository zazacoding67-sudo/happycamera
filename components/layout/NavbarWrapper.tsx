"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import type { MegaMenuItem } from "@/lib/navigation";

export default function NavbarWrapper({ navMenus }: { navMenus: MegaMenuItem[] }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <Navbar navMenus={navMenus} />;
}
