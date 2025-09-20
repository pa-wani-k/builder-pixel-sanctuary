import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";

const CHAT_URL =
  "https://91ced27b09e84f1097faa721e4e8da3b-main.projects.builder.my";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(480);
  const [width, setWidth] = useState(360);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="mb-3 rounded-xl border bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <div className="text-sm font-semibold">Ayursutra Assistant</div>
            <div className="flex items-center gap-2">
              <button
                aria-label="Smaller"
                className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
                onClick={() => setHeight((h) => Math.max(360, h - 60))}
              >
                −
              </button>
              <button
                aria-label="Larger"
                className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
                onClick={() => setHeight((h) => Math.min(720, h + 60))}
              >
                +
              </button>
              <button
                onClick={() => setOpen(false)}
                className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-gray-100"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <iframe
            title="Ayursutra Chatbot"
            src={CHAT_URL}
            style={{ height, width }}
            className="rounded-b-xl"
          />
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:opacity-90"
        aria-label="Toggle chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}
