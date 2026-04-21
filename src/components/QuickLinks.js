import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  UploadCloud,
  MessageCircle,
  Phone,
  MapPin,
  TrendingDown,
  CreditCard,
  Copy,
  Check,
  Link2,
} from "lucide-react";
import NewChat from "../pages/chats&tasks/NewChat";
import { useNavigate } from "react-router-dom";

const ease = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.26, ease } },
};

const CardShell = ({ children, className = "" }) => (
  <motion.div
    variants={cardVariants}
    whileHover={{ y: -2, boxShadow: "0 4px 24px 0 rgba(0,0,0,0.07)" }}
    transition={{ duration: 0.18 }}
    className={`rounded-xl border border-border bg-card shadow-sm overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

const CardHeader = ({ label, hint }) => (
  <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border bg-muted/40">
    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
    <p className="text-[13px] font-semibold text-foreground tracking-tight flex-1">{label}</p>
    {hint && (
      <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
        {hint}
      </kbd>
    )}
  </div>
);

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }, [text]);
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      onClick={copy}
      title="Copy"
      className="ml-auto p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
    >
      {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
    </motion.button>
  );
};

const QuickLinks = ({ accountId, accountName }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4 font-sans"
    >
      {/* ── Quick Links card ── */}
      <CardShell>
        <CardHeader label="Quick Links" hint="⌘⇧Q" />
        <div className="grid grid-cols-2 gap-1 p-3">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/client/document")}
            className="group flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-500/10 text-amber-500 group-hover:bg-amber-500/20 transition-colors">
              <UploadCloud size={15} strokeWidth={1.8} />
            </span>
            Documents
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setOpen(true)}
            className="group flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
              <MessageCircle size={15} strokeWidth={1.8} />
            </span>
            New Chat
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/client/billing")}
            className="group flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-green-500/10 text-green-600 group-hover:bg-green-500/20 transition-colors">
              <CreditCard size={15} strokeWidth={1.8} />
            </span>
            Billing
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/client/chatstasks")}
            className="group flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-violet-500/10 text-violet-500 group-hover:bg-violet-500/20 transition-colors">
              <Link2 size={15} strokeWidth={1.8} />
            </span>
            Tasks
          </motion.button>
        </div>
      </CardShell>

      {/* ── Balance card ── */}
      <CardShell>
        <CardHeader label="Balance" />
        <div className="grid grid-cols-2 divide-x divide-border">
          <div className="flex flex-col items-center gap-2 px-4 py-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/10">
              <CreditCard size={16} className="text-green-600 dark:text-green-400" strokeWidth={1.8} />
            </div>
            <p className="text-[11px] font-medium text-muted-foreground text-center">Credits Available</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">$0.00</p>
          </div>
          <div className="flex flex-col items-center gap-2 px-4 py-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/10">
              <TrendingDown size={16} className="text-orange-500" strokeWidth={1.8} />
            </div>
            <p className="text-[11px] font-medium text-muted-foreground text-center">Outstanding</p>
            <p className="text-lg font-bold text-orange-500">$0.00</p>
          </div>
        </div>
      </CardShell>

      {/* ── Contact Info card ── */}
      <CardShell>
        <CardHeader label="Contact Info" />
        <div className="divide-y divide-border">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
              <Phone size={14} className="text-primary" strokeWidth={1.8} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-muted-foreground">Phone</p>
              <p className="text-[13px] font-semibold text-foreground">(925) 800-3561</p>
            </div>
            <CopyButton text="(925) 800-3561" />
          </div>

          <div className="flex items-start gap-3 px-5 py-3.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-500/10 mt-0.5">
              <MapPin size={14} className="text-amber-500" strokeWidth={1.8} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-muted-foreground">Address</p>
              <p className="text-[13px] font-semibold text-foreground leading-snug">
                3015 Hopyard Rd, Ste M,<br />Pleasanton, CA 94588
              </p>
            </div>
            <CopyButton text="3015 Hopyard Rd, Ste M, Pleasanton, CA 94588" />
          </div>
        </div>
      </CardShell>

      <NewChat
        open={open}
        close={() => setOpen(false)}
        accId={accountId}
        accountName={accountName}
      />
    </motion.div>
  );
};

export default QuickLinks;
