"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "0163208864";

interface Props {
  productName?: string;
}

export default function WhatsAppButton({ productName }: Props) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const text = productName
    ? `Hi! I'm interested in the ${productName}.`
    : "Hi! I have a question about your shop.";

  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20BD5A] transition-colors group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={26} />
      <span className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#1A1A1A] text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
        Chat with us
      </span>
    </a>
  );
}
