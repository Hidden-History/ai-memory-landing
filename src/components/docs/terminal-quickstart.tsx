"use client";

import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-clipboard";

const COMMANDS = [
  {
    prompt: "$",
    command: "git clone https://github.com/Hidden-History/ai-memory.git && cd ai-memory",
    delay: 0,
  },
  {
    prompt: "$",
    command: "cp .env.example .env && docker compose up -d",
    delay: 0.8,
  },
  {
    prompt: "$",
    command: "curl http://localhost:8000/health",
    delay: 1.6,
  },
];

const RESPONSE = {
  text: '{"status": "healthy", "collections": 5, "qdrant": "connected"}',
  delay: 2.4,
};

const charVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

function CopyButton({ text }: { text: string }) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        copy(text);
      }}
      className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-2 py-1 rounded-lg text-xs cursor-pointer"
      style={{
        fontFamily: "var(--font-mono)",
        background: "rgba(0, 245, 255, 0.08)",
        border: "1px solid rgba(0, 245, 255, 0.2)",
        color: copied ? "#00FF88" : "#00F5FF",
      }}
      aria-label={copied ? "Copied" : "Copy command"}
    >
      {copied ? (
        <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Copied!</span>
      ) : (
        <span className="flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</span>
      )}
    </button>
  );
}

function TypingLine({ prompt, text, delay, color }: { prompt?: string; text: string; delay: number; color: string }) {
  return (
    <motion.div
      className="group relative py-1.5 px-1 -mx-1 rounded-lg hover:bg-white/[0.02] transition-colors"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <motion.span
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.02, delayChildren: delay },
          },
        }}
      >
        {prompt && (
          <span style={{ color: "#7A8AAA" }}>{prompt} </span>
        )}
        {text.split("").map((char, i) => (
          <motion.span
            key={i}
            variants={charVariants}
            style={{ color }}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
      {prompt && <CopyButton text={text} />}
    </motion.div>
  );
}

export function TerminalQuickstart() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "#0C0E1A",
        border: "1px solid rgba(0, 245, 255, 0.1)",
        boxShadow: "0 0 60px rgba(0,0,0,0.4), 0 0 30px rgba(0,245,255,0.03)",
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-3 px-5 h-10"
        style={{
          background: "rgba(15, 20, 50, 0.8)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#FEBC2E" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
        </div>
        <span
          className="text-xs flex-1 text-center"
          style={{ color: "#5A6480", fontFamily: "var(--font-mono)" }}
        >
          terminal
        </span>
      </div>

      {/* Code area */}
      <div className="p-6" style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}>
        {COMMANDS.map((cmd, i) => (
          <TypingLine
            key={i}
            prompt={cmd.prompt}
            text={cmd.command}
            delay={cmd.delay}
            color="#E8EAF0"
          />
        ))}

        {/* Response line */}
        <TypingLine
          text={RESPONSE.text}
          delay={RESPONSE.delay}
          color="#00FF88"
        />

        {/* Blinking cursor */}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          className="inline-block w-2 h-4 mt-2 ml-1"
          style={{ background: "#00F5FF" }}
        />
      </div>
    </div>
  );
}
