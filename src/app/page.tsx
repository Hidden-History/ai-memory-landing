"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  Brain,
  Layers,
  Zap,
  RefreshCw,
  User,
  MessageSquare,
  FolderOpen,
  Link2,
  ArrowRight,
  Github,
  Star,
  Terminal,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Database,
  Shield,
} from "lucide-react";

// ─── Animations ─────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeUp}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Navbar ─────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={`fixed top-4 left-4 right-4 z-50 mx-auto max-w-6xl flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-500 ${
        scrolled
          ? "bg-surface/90 backdrop-blur-2xl border border-border shadow-2xl shadow-primary/5"
          : "bg-transparent"
      }`}
    >
      <a href="#" className="flex items-center gap-2.5 cursor-pointer">
        <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
          <Brain className="w-4 h-4 text-primary-light" />
        </div>
        <span className="font-[family-name:var(--font-heading)] font-semibold text-lg tracking-tight">
          AI Memory
        </span>
      </a>
      <div className="hidden md:flex items-center gap-8 text-sm">
        {["Features", "How it Works", "Integration", "Pricing"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
            className="text-muted hover:text-foreground transition-colors duration-200 cursor-pointer"
          >
            {item}
          </a>
        ))}
        <a
          href="https://github.com/Hidden-History/ai-memory"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary-light rounded-xl hover:bg-primary/20 transition-all duration-200 border border-primary/15 hover:border-primary/30 cursor-pointer"
        >
          <Github className="w-4 h-4" />
          <span>GitHub</span>
        </a>
      </div>
    </motion.nav>
  );
}

// ─── Hero ───────────────────────────────────────────────
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 80]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Spline 3D Background */}
      <div className="absolute inset-0 z-0">
        <iframe
          src="https://my.spline.design/untitled-VxFW1ij8GcJCNpYucJwR4UDe/"
          frameBorder="0"
          width="100%"
          height="100%"
          className="absolute inset-0 scale-110"
          style={{ pointerEvents: "none" }}
          title="AI Memory 3D Scene"
          loading="lazy"
        />
        {/* Strong gradient overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/30 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
        <div className="absolute bottom-0 h-48 w-full bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Ambient glow orbs */}
      <div className="absolute top-1/3 left-1/5 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[150px] animate-pulse-glow" />
      <div className="absolute bottom-1/3 right-1/5 w-[400px] h-[400px] bg-accent/6 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue/4 rounded-full blur-[200px]" />

      {/* Hero Content */}
      <motion.div
        style={{ opacity, scale, y }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 mb-10 rounded-full border border-border bg-surface/40 backdrop-blur-xl text-sm text-muted"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            Open Source &middot; Built for Claude Code
          </motion.div>

          {/* Headline */}
          <h1 className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight leading-[1.05] mb-7">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="block"
            >
              Give Your AI
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.7 }}
              className="block gradient-text-animated"
            >
              Persistent Memory
            </motion.span>
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Your AI forgets everything between sessions. AI Memory fixes that
            &mdash; structured, file-based memory that survives restarts, grows
            over time, and makes every conversation smarter.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="https://github.com/Hidden-History/ai-memory"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-2.5 px-8 py-4 bg-primary text-white rounded-2xl font-[family-name:var(--font-heading)] font-semibold text-lg hover:bg-primary-light transition-all duration-300 glow-primary cursor-pointer overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2.5">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </a>
            <a
              href="https://github.com/Hidden-History/ai-memory"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-8 py-4 border border-border rounded-2xl font-[family-name:var(--font-heading)] font-medium text-lg hover:bg-surface-hover hover:border-border-hover transition-all duration-300 cursor-pointer backdrop-blur-sm"
            >
              <Github className="w-5 h-5" />
              View on GitHub
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="flex items-center justify-center gap-8 mt-16 text-sm text-muted-darker"
          >
            {[
              { label: "Memory Types", value: "4" },
              { label: "Zero Config", value: "0s" },
              { label: "MIT Licensed", value: "Free" },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-3">
                {i > 0 && (
                  <div className="w-px h-4 bg-border" />
                )}
                <div className="text-center">
                  <div className="font-[family-name:var(--font-heading)] font-semibold text-foreground text-lg">
                    {stat.value}
                  </div>
                  <div className="text-xs">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute -bottom-16 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-muted-darker/50 rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-2 bg-muted-darker rounded-full" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Features Bento Grid ────────────────────────────────
const features = [
  {
    icon: Brain,
    title: "Persistent Memory",
    description:
      "Memories persist as Markdown files with frontmatter. They survive restarts, updates, and context window resets. Your AI never starts from scratch again.",
    className: "md:col-span-2 md:row-span-2",
    gradient: "from-primary/15 via-accent/5 to-transparent",
    iconBg: "bg-primary/15",
    large: true,
  },
  {
    icon: Layers,
    title: "4 Memory Types",
    description:
      "User, Feedback, Project, and Reference \u2014 each optimized for different context.",
    className: "md:col-span-1",
    gradient: "from-blue/15 via-transparent to-transparent",
    iconBg: "bg-blue/15",
  },
  {
    icon: RefreshCw,
    title: "Automatic Recall",
    description:
      "MEMORY.md index loads every session. Relevant memories surface automatically.",
    className: "md:col-span-1",
    gradient: "from-accent/15 via-transparent to-transparent",
    iconBg: "bg-accent/15",
  },
  {
    icon: Zap,
    title: "Cross-Session Context",
    description:
      "Remembers your role, preferences, past corrections, and project context.",
    className: "md:col-span-1",
    gradient: "from-cyan/10 via-transparent to-transparent",
    iconBg: "bg-cyan/15",
  },
  {
    icon: Shield,
    title: "Private & Local",
    description:
      "All memory files live on your machine. No cloud, no sync, no third parties.",
    className: "md:col-span-1",
    gradient: "from-green-500/10 via-transparent to-transparent",
    iconBg: "bg-green-500/15",
  },
  {
    icon: Terminal,
    title: "Zero Config",
    description:
      "Just start talking. The AI creates and manages memory files automatically.",
    className: "md:col-span-1",
    gradient: "from-primary/10 via-transparent to-transparent",
    iconBg: "bg-primary/15",
  },
  {
    icon: Database,
    title: "No Database Needed",
    description:
      "Plain Markdown files. No vector DB, no embeddings, no infrastructure.",
    className: "md:col-span-1",
    gradient: "from-blue/10 via-transparent to-transparent",
    iconBg: "bg-blue/15",
  },
];

function Features() {
  return (
    <section id="features" className="relative py-32 px-6">
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-30" />

      <div className="max-w-6xl mx-auto relative">
        <AnimatedSection className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-primary-light text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest mb-6">
            <Sparkles className="w-3 h-3" />
            Features
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">
            Memory That <span className="gradient-text">Actually Works</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
            Not a vector database. Not embeddings. Simple, structured files your
            AI reads and writes \u2014 transparent and hackable.
          </p>
        </AnimatedSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              transition={{
                duration: 0.5,
                delay: i * 0.06,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className={`gradient-border p-7 relative overflow-hidden group cursor-pointer transition-all duration-350 hover:translate-y-[-2px] ${feature.className}`}
            >
              {/* Hover gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative z-10">
                <div
                  className={`icon-glow w-12 h-12 rounded-2xl ${feature.iconBg} border border-white/5 flex items-center justify-center mb-5`}
                >
                  <feature.icon className="w-5 h-5 text-primary-light" />
                </div>
                <h3
                  className={`font-[family-name:var(--font-heading)] font-semibold mb-3 ${
                    feature.large ? "text-2xl" : "text-lg"
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`text-muted leading-relaxed ${
                    feature.large ? "text-base" : "text-sm"
                  }`}
                >
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── How It Works ───────────────────────────────────────
const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "You Have a Conversation",
    description:
      "Chat with your AI as usual. Mention your role, preferences, or project details naturally.",
    color: "text-blue",
    bg: "bg-blue/10",
    borderColor: "border-blue/20",
  },
  {
    number: "02",
    icon: Brain,
    title: "Memory Gets Saved",
    description:
      "The AI detects memorable context and writes it to structured Markdown files with YAML metadata.",
    color: "text-primary-light",
    bg: "bg-primary/10",
    borderColor: "border-primary/20",
  },
  {
    number: "03",
    icon: RefreshCw,
    title: "New Session Starts",
    description:
      "Next conversation, MEMORY.md index is loaded into context automatically. No action needed.",
    color: "text-accent",
    bg: "bg-accent/10",
    borderColor: "border-accent/20",
  },
  {
    number: "04",
    icon: Zap,
    title: "Memory Recalled",
    description:
      "Your AI reads relevant memory files and adapts behavior \u2014 no repeated instructions needed.",
    color: "text-cyan",
    bg: "bg-cyan/10",
    borderColor: "border-cyan/20",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-primary-light text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest mb-6">
            How It Works
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">
            Four Steps to{" "}
            <span className="gradient-text">Smarter Sessions</span>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, i) => (
            <AnimatedSection key={step.number} delay={i * 0.1}>
              <div className="gradient-border p-8 h-full group cursor-pointer transition-all duration-350 hover:translate-y-[-2px]">
                <div className="flex items-start gap-5">
                  {/* Step number + icon */}
                  <div className="flex-shrink-0 relative">
                    <div
                      className={`w-14 h-14 rounded-2xl ${step.bg} border ${step.borderColor} flex items-center justify-center`}
                    >
                      <step.icon className={`w-6 h-6 ${step.color}`} />
                    </div>
                    <span className="absolute -top-2 -right-2 text-[10px] font-[family-name:var(--font-mono)] text-muted-darker bg-surface/90 px-1.5 py-0.5 rounded-md border border-border">
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Connecting flow line */}
        <AnimatedSection delay={0.5}>
          <div className="flex items-center justify-center gap-3 mt-10 text-muted-darker">
            {["Conversation", "Save", "Load", "Recall"].map((label, i) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-xs font-[family-name:var(--font-mono)]">
                  {label}
                </span>
                {i < 3 && (
                  <ArrowRight className="w-3 h-3" />
                )}
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Code Example ───────────────────────────────────────
const codeFiles = {
  user: {
    filename: "user_role.md",
    path: "~/.claude/projects/my-project/memory/user_role.md",
    lines: [
      { text: "---", type: "delimiter" },
      { text: "name: Senior React Developer", type: "key" },
      { text: "description: User is experienced with React, new to backend", type: "key" },
      { text: "type: user", type: "key" },
      { text: "---", type: "delimiter" },
      { text: "", type: "blank" },
      { text: "Deep expertise in React, TypeScript, and Next.js.", type: "content" },
      { text: "Currently learning Go for backend services.", type: "content" },
      { text: "", type: "blank" },
      { text: "Frame backend explanations using frontend analogies", type: "content" },
      { text: '(e.g., "middleware is like a React context provider', type: "content" },
      { text: 'that wraps every request").', type: "content" },
    ],
  },
  feedback: {
    filename: "feedback_terse.md",
    path: "~/.claude/projects/my-project/memory/feedback_terse.md",
    lines: [
      { text: "---", type: "delimiter" },
      { text: "name: No trailing summaries", type: "key" },
      { text: "description: User wants terse responses, no recap", type: "key" },
      { text: "type: feedback", type: "key" },
      { text: "---", type: "delimiter" },
      { text: "", type: "blank" },
      { text: "Stop summarizing what you just did at the end of", type: "content" },
      { text: "every response \u2014 the user can read the diff.", type: "content" },
      { text: "", type: "blank" },
      { text: "**Why:** User finds it redundant and noisy.", type: "highlight" },
      { text: "**How to apply:** End responses with the action,", type: "highlight" },
      { text: "not a summary of the action.", type: "highlight" },
    ],
  },
  project: {
    filename: "project_auth.md",
    path: "~/.claude/projects/my-project/memory/project_auth.md",
    lines: [
      { text: "---", type: "delimiter" },
      { text: "name: Auth middleware rewrite", type: "key" },
      { text: "description: Rewriting auth for compliance", type: "key" },
      { text: "type: project", type: "key" },
      { text: "---", type: "delimiter" },
      { text: "", type: "blank" },
      { text: "Auth middleware rewrite driven by legal/compliance", type: "content" },
      { text: "requirements around session token storage.", type: "content" },
      { text: "", type: "blank" },
      { text: "**Why:** Legal flagged current approach.", type: "highlight" },
      { text: "**How to apply:** Scope decisions should favor", type: "highlight" },
      { text: "compliance over ergonomics.", type: "highlight" },
    ],
  },
};

type TabKey = keyof typeof codeFiles;

function CodeExample() {
  const [activeTab, setActiveTab] = useState<TabKey>("user");
  const [copied, setCopied] = useState(false);

  const file = codeFiles[activeTab];

  const handleCopy = () => {
    const text = file.lines.map((l) => l.text).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const typeColor: Record<string, string> = {
    delimiter: "text-muted-darker/60",
    key: "text-primary-light",
    content: "text-foreground/75",
    highlight: "text-accent",
    blank: "",
  };

  return (
    <section className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-primary-light text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest mb-6">
            Memory Format
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">
            Simple <span className="gradient-text">Markdown Files</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
            No databases. No embeddings. Just structured Markdown with YAML
            frontmatter \u2014 readable, editable, and version-controllable.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div className="gradient-border overflow-hidden glow-primary">
            {/* Tab bar */}
            <div className="flex items-center justify-between border-b border-border/50 px-1 bg-surface/30">
              <div className="flex">
                {(Object.keys(codeFiles) as TabKey[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-3.5 text-xs font-[family-name:var(--font-mono)] transition-all duration-200 cursor-pointer border-b-2 ${
                      activeTab === tab
                        ? "text-primary-light border-primary bg-primary/5"
                        : "text-muted-darker hover:text-muted border-transparent"
                    }`}
                  >
                    {codeFiles[tab].filename}
                  </button>
                ))}
              </div>
              <button
                onClick={handleCopy}
                className="p-2.5 mr-2 text-muted-darker hover:text-foreground transition-colors cursor-pointer rounded-lg hover:bg-white/5"
                aria-label="Copy code"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Code content */}
            <div className="p-6 overflow-x-auto bg-[#06061a]/50">
              <pre className="font-[family-name:var(--font-mono)] text-[13px] leading-7">
                <code>
                  {file.lines.map((line, i) => (
                    <div key={`${activeTab}-${i}`} className="flex hover:bg-white/[0.02] rounded">
                      <span className="select-none text-muted-darker/40 w-8 flex-shrink-0 text-right mr-6 text-xs leading-7">
                        {i + 1}
                      </span>
                      <span className={typeColor[line.type]}>
                        {line.text || "\u00A0"}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>

            {/* File path bar */}
            <div className="border-t border-border/30 px-5 py-2.5 flex items-center gap-2.5 text-[11px] text-muted-darker font-[family-name:var(--font-mono)] bg-surface/20">
              <FolderOpen className="w-3 h-3" />
              {file.path}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Memory Types ───────────────────────────────────────
const memoryTypes = [
  {
    icon: User,
    name: "User",
    tag: "user",
    description: "Role, goals, expertise, and preferences",
    example: "User is a senior React dev, new to Go",
    color: "text-blue",
    bg: "bg-blue/10",
    borderColor: "border-blue/15",
    accentDot: "bg-blue",
  },
  {
    icon: MessageSquare,
    name: "Feedback",
    tag: "feedback",
    description: "Corrections, style preferences, and rules",
    example: "Don't add trailing summaries to responses",
    color: "text-primary-light",
    bg: "bg-primary/10",
    borderColor: "border-primary/15",
    accentDot: "bg-primary",
  },
  {
    icon: FolderOpen,
    name: "Project",
    tag: "project",
    description: "Ongoing work, decisions, and deadlines",
    example: "Auth rewrite driven by compliance requirements",
    color: "text-accent",
    bg: "bg-accent/10",
    borderColor: "border-accent/15",
    accentDot: "bg-accent",
  },
  {
    icon: Link2,
    name: "Reference",
    tag: "reference",
    description: "External systems, dashboards, and docs",
    example: "Bugs tracked in Linear INGEST project",
    color: "text-cyan",
    bg: "bg-cyan/10",
    borderColor: "border-cyan/15",
    accentDot: "bg-cyan",
  },
];

function MemoryTypes() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-primary-light text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest mb-6">
            Memory Types
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">
            Four Types, <span className="gradient-text">One System</span>
          </h2>
        </AnimatedSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {memoryTypes.map((type, i) => (
            <motion.div
              key={type.name}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="gradient-border p-6 group cursor-pointer transition-all duration-350 hover:translate-y-[-2px]"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-11 h-11 rounded-xl ${type.bg} border ${type.borderColor} flex items-center justify-center flex-shrink-0`}
                >
                  <type.icon className={`w-5 h-5 ${type.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <h3 className="font-[family-name:var(--font-heading)] font-semibold text-lg">
                      {type.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-surface text-[10px] font-[family-name:var(--font-mono)] text-muted-darker border border-border">
                      type: {type.tag}
                    </span>
                  </div>
                  <p className="text-muted text-sm mb-3 leading-relaxed">
                    {type.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-[family-name:var(--font-mono)] text-muted-darker">
                    <div className={`w-1.5 h-1.5 rounded-full ${type.accentDot}`} />
                    <span className="italic truncate">&quot;{type.example}&quot;</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Integration / Terminal ─────────────────────────────
const terminalLines = [
  { text: "$ claude", color: "text-foreground", delay: 0 },
  {
    text: "Loading MEMORY.md index... 6 memories found",
    color: "text-muted-darker",
    delay: 600,
  },
  { text: "", color: "", delay: 900 },
  {
    text: '> "Help me refactor the auth middleware"',
    color: "text-primary-light",
    delay: 1200,
  },
  { text: "", color: "", delay: 1500 },
  {
    text: "\u2714 Reading memory: user_role.md",
    color: "text-accent",
    delay: 1800,
  },
  {
    text: "\u2714 Reading memory: feedback_terse.md",
    color: "text-accent",
    delay: 2100,
  },
  {
    text: "\u2714 Reading memory: project_auth_rewrite.md",
    color: "text-accent",
    delay: 2400,
  },
  { text: "", color: "", delay: 2700 },
  {
    text: "I remember you're a senior React dev working on the auth",
    color: "text-green-400",
    delay: 3000,
  },
  {
    text: "rewrite for compliance. The current middleware stores",
    color: "text-green-400",
    delay: 3150,
  },
  {
    text: "session tokens in a way legal flagged. Let me refactor",
    color: "text-green-400",
    delay: 3300,
  },
  {
    text: "it with the compliance-first approach we discussed.",
    color: "text-green-400",
    delay: 3450,
  },
];

function Integration() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timers = terminalLines.map((_, i) =>
      setTimeout(() => setVisibleLines(i + 1), terminalLines[i].delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  return (
    <section id="integration" className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-primary-light text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest mb-6">
            Integration
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">
            Works with{" "}
            <span className="gradient-text">Claude Code</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
            Built for Claude Code&apos;s project memory system. Start a session and
            your AI already knows who you are and what you&apos;re working on.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div ref={ref} className="gradient-border overflow-hidden glow-primary">
            {/* Terminal header */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border/30 bg-surface/30">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-[11px] text-muted-darker font-[family-name:var(--font-mono)]">
                  Terminal &mdash; claude
                </span>
              </div>
              <div className="w-16" />
            </div>

            {/* Terminal body */}
            <div className="p-6 min-h-[380px] font-[family-name:var(--font-mono)] text-sm leading-7 bg-[#06061a]/50">
              {terminalLines.slice(0, visibleLines).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className={line.color}
                >
                  {line.text || "\u00A0"}
                </motion.div>
              ))}
              {visibleLines > 0 && visibleLines < terminalLines.length && (
                <span className="inline-block w-2 h-5 bg-primary-light/80 animate-pulse ml-0.5" />
              )}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Pricing (21st.dev animated-pricing-page) ──────────
import { PricingPage } from "@/components/ui/animated-pricing-page";

function Pricing() {
  return (
    <section id="pricing" className="relative py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-primary-light text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest mb-6">
            Pricing
          </div>
        </AnimatedSection>
        <PricingPage />
      </div>
    </section>
  );
}

// ─── GitHub CTA ─────────────────────────────────────────
function GitHubCTA() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.github.com/repos/Hidden-History/ai-memory")
      .then((r) => r.json())
      .then((data) => {
        if (data.stargazers_count !== undefined) setStars(data.stargazers_count);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative py-32 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <AnimatedSection>
          <div className="gradient-border p-14 md:p-20 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />

            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-surface border border-border flex items-center justify-center">
                <Github className="w-8 h-8 text-foreground" />
              </div>

              <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">
                Open Source &<br />
                <span className="gradient-text">Community Driven</span>
              </h2>

              <p className="text-muted text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                AI Memory is MIT licensed. Star the repo, file issues, submit
                PRs \u2014 help shape how AI agents remember.
              </p>

              {stars !== null && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-surface/80 border border-border text-sm mb-10"
                >
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-[family-name:var(--font-mono)] font-medium">
                    {stars.toLocaleString()} stars on GitHub
                  </span>
                </motion.div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://github.com/Hidden-History/ai-memory"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 px-8 py-4 bg-foreground text-background rounded-2xl font-[family-name:var(--font-heading)] font-semibold text-lg hover:bg-foreground/90 transition-all duration-300 cursor-pointer"
                >
                  <Star className="w-5 h-5" />
                  Star on GitHub
                  <ExternalLink className="w-4 h-4 opacity-40 group-hover:opacity-70 transition-opacity" />
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Footer ─────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-border/50 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-darker">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-primary/10 border border-primary/15 flex items-center justify-center">
            <Brain className="w-3 h-3 text-primary-light" />
          </div>
          <span className="font-[family-name:var(--font-heading)]">AI Memory</span>
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
          </a>
          {" "}&middot; MIT License
        </p>
      </div>
    </footer>
  );
}

// ─── Page ───────────────────────────────────────────────
export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <div className="section-divider" />
      <Features />
      <div className="section-divider" />
      <HowItWorks />
      <div className="section-divider" />
      <CodeExample />
      <div className="section-divider" />
      <MemoryTypes />
      <div className="section-divider" />
      <Integration />
      <div className="section-divider" />
      <Pricing />
      <div className="section-divider" />
      <GitHubCTA />
      <Footer />
    </main>
  );
}
