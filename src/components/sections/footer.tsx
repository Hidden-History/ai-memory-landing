"use client";

import { Brain } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-darker">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-primary/10 border border-primary/15 flex items-center justify-center">
            <Brain className="w-3 h-3 text-primary-light" />
          </div>
          <span className="font-[family-name:var(--font-heading)]">
            AI Memory
          </span>
        </div>
        <p className="text-xs">
          Built by{" "}
          <a
            href="https://github.com/Hidden-History"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-primary-light transition-colors cursor-pointer"
          >
            Hidden History
          </a>{" "}
          &middot; MIT License
        </p>
      </div>
    </footer>
  );
}
