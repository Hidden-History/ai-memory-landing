"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Users,
  ShieldCheck,
  FileCheck,
  Timer,
  Workflow,
  MessageSquare,
  Zap,
  ArrowRight,
  Github,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const capabilities = [
  {
    icon: Users,
    title: "Agent Team Orchestration",
    description:
      "Break complex projects into parallel workstreams with specialized agents — each with their own tools, context, and objectives.",
    color: "text-blue",
    bg: "bg-blue/10",
    borderColor: "border-blue/15",
  },
  {
    icon: ShieldCheck,
    title: "Quality Gates",
    description:
      "Automated build verification, test coverage checks, and security audits run at every stage. Nothing ships without passing.",
    color: "text-green-400",
    bg: "bg-green-500/10",
    borderColor: "border-green-500/15",
  },
  {
    icon: FileCheck,
    title: "Verified Instructions",
    description:
      "Persistent instruction sets that survive across sessions. Your preferences, standards, and rules are always enforced.",
    color: "text-primary-light",
    bg: "bg-primary/10",
    borderColor: "border-primary/15",
  },
  {
    icon: Timer,
    title: "Session Continuity",
    description:
      "Every conversation picks up where the last one left off. Context, progress, and decisions are never lost between sessions.",
    color: "text-accent",
    bg: "bg-accent/10",
    borderColor: "border-accent/15",
  },
  {
    icon: Workflow,
    title: "Multi-Phase Planning",
    description:
      "Breaks down ambitious tasks into phases with dependencies, milestones, and verification steps. Plans adapt as work progresses.",
    color: "text-cyan",
    bg: "bg-cyan/10",
    borderColor: "border-cyan/15",
  },
  {
    icon: MessageSquare,
    title: "Contextual Decisions",
    description:
      "Leverages all 5 Qdrant collections to make informed decisions — remembering past patterns, conventions, and rationale.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    borderColor: "border-yellow-500/15",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Task Intake",
    description: "Parzival receives a task, queries AI Memory for relevant context across all collections.",
  },
  {
    step: "02",
    title: "Plan Generation",
    description: "Creates a multi-phase implementation plan with quality gates at each stage.",
  },
  {
    step: "03",
    title: "Agent Dispatch",
    description: "Spawns and orchestrates specialized agents — each with focused tools and objectives.",
  },
  {
    step: "04",
    title: "Verification",
    description: "Runs quality gates: builds, tests, security audits. Iterates until all pass.",
  },
  {
    step: "05",
    title: "Memory Update",
    description: "Stores new patterns, decisions, and outcomes back into Qdrant for future sessions.",
  },
];

export default function ParzivalPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/8 border border-accent/15 text-accent text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest mb-6">
              <Bot className="w-3 h-3" />
              AI PM Agent
            </div>
            <h1 className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl lg:text-7xl font-bold mb-7 tracking-tight">
              Meet{" "}
              <span className="gradient-text-animated">Parzival</span>
            </h1>
            <p className="text-muted text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
              Your AI project manager that orchestrates agent teams, enforces
              quality gates, and maintains perfect session continuity &mdash;
              powered by AI Memory&apos;s 5 Qdrant collections.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://github.com/Hidden-History/ai-memory"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 px-8 py-4 bg-primary text-white rounded-2xl font-[family-name:var(--font-heading)] font-semibold text-lg hover:bg-primary-light transition-all duration-300 glow-primary cursor-pointer"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="https://github.com/Hidden-History/ai-memory"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-8 py-4 border border-border rounded-2xl font-[family-name:var(--font-heading)] font-medium text-lg hover:bg-surface-hover hover:border-border-hover transition-all duration-300 cursor-pointer"
              >
                <Github className="w-5 h-5" />
                View Source
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Capabilities */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl font-bold mb-5 tracking-tight">
              What Parzival <span className="gradient-text">Can Do</span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="gradient-border p-7 group cursor-pointer transition-all duration-350 hover:translate-y-[-2px]"
              >
                <div
                  className={`w-11 h-11 rounded-xl ${cap.bg} border ${cap.borderColor} flex items-center justify-center mb-5`}
                >
                  <cap.icon className={`w-5 h-5 ${cap.color}`} />
                </div>
                <h3 className="font-[family-name:var(--font-heading)] font-semibold text-lg mb-2">
                  {cap.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {cap.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Workflow */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl font-bold mb-5 tracking-tight">
              How Parzival <span className="gradient-text">Works</span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="space-y-4"
          >
            {workflowSteps.map((item, i) => (
              <motion.div
                key={item.step}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="gradient-border p-7 flex items-start gap-5 group cursor-pointer transition-all duration-350 hover:translate-y-[-2px]"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-[family-name:var(--font-mono)] text-primary-light font-semibold">
                    {item.step}
                  </span>
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-heading)] font-semibold text-lg mb-1">
                    {item.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="gradient-border p-14 md:p-20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-transparent to-primary/8" />
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-accent" />
                </div>
                <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl font-bold mb-5 tracking-tight">
                  Ready to Try{" "}
                  <span className="gradient-text">Parzival</span>?
                </h2>
                <p className="text-muted text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                  Parzival comes bundled with AI Memory. Install the stack and
                  start orchestrating.
                </p>
                <a
                  href="https://github.com/Hidden-History/ai-memory"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 px-8 py-4 bg-primary text-white rounded-2xl font-[family-name:var(--font-heading)] font-semibold text-lg hover:bg-primary-light transition-all duration-300 glow-primary cursor-pointer"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
