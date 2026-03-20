"use client";

import { motion } from "framer-motion";
import {
  Download,
  Database,
  Webhook,
  Shield,
  Github,
  BarChart3,
  Code2,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const docCategories = [
  {
    icon: Download,
    title: "Install",
    description: "Docker stack setup, environment configuration, and first-run guide.",
    color: "text-blue",
    bg: "bg-blue/10",
    borderColor: "border-blue/15",
  },
  {
    icon: Database,
    title: "Collections",
    description:
      "5 Qdrant collections explained — code-patterns, conventions, discussions, github, jira-data.",
    color: "text-primary-light",
    bg: "bg-primary/10",
    borderColor: "border-primary/15",
  },
  {
    icon: Webhook,
    title: "Hooks",
    description:
      "Claude Code hook pipeline — how memories flow from conversation to vector storage.",
    color: "text-accent",
    bg: "bg-accent/10",
    borderColor: "border-accent/15",
  },
  {
    icon: Shield,
    title: "Security",
    description:
      "3-layer security pipeline — PII detection, secrets scanning, and content filtering.",
    color: "text-green-400",
    bg: "bg-green-500/10",
    borderColor: "border-green-500/15",
  },
  {
    icon: Github,
    title: "Integrations",
    description:
      "GitHub sync, Jira sync, and Langfuse observability configuration.",
    color: "text-cyan",
    bg: "bg-cyan/10",
    borderColor: "border-cyan/15",
  },
  {
    icon: BarChart3,
    title: "Monitoring",
    description:
      "Prometheus metrics, Grafana dashboards, and health check endpoints.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    borderColor: "border-yellow-500/15",
  },
  {
    icon: Code2,
    title: "API",
    description:
      "REST API reference for direct collection access, search, and memory management.",
    color: "text-blue",
    bg: "bg-blue/10",
    borderColor: "border-blue/15",
  },
];

export default function DocsPage() {
  return (
    <main id="main" className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-primary-light text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest mb-6">
              Documentation
            </div>
            <h1 className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl font-bold mb-5 tracking-tight">
              AI Memory <span className="gradient-text">Docs</span>
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
              Everything you need to set up, configure, and operate AI Memory in
              production.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Doc cards */}
      <section className="pb-32 px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {docCategories.map((cat, i) => (
            <motion.div
              key={cat.title}
              variants={fadeUp}
              transition={{
                duration: 0.5,
                delay: 0.3 + i * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="gradient-border p-7 group transition-all duration-350"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-11 h-11 rounded-xl ${cat.bg} border ${cat.borderColor} flex items-center justify-center flex-shrink-0`}
                >
                  <cat.icon className={`w-5 h-5 ${cat.color}`} />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-heading)] font-semibold text-lg mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}
