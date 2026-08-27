"use client";

import { MessageCircle } from "lucide-react";

export default function FloatingButton() {
  return (
    <button
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-brand text-white rounded-full shadow-lg flex items-center justify-center hover:bg-brand/90 transition-colors hover:scale-105 active:scale-95"
      style={{ minWidth: 44, minHeight: 44 }}
      aria-label="Chat with us"
    >
      <MessageCircle className="h-6 w-6" strokeWidth={1.5} />
    </button>
  );
}
