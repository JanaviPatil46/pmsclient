import { motion } from "framer-motion";

// ─── Shared timing ───────────────────────────────────────────────────────────
export const ease = [0.16, 1, 0.3, 1]; // custom spring-like ease

// ─── Page-level fade + slide up ──────────────────────────────────────────────
export function PageTransition({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Generic fade-in (for sections, cards) ───────────────────────────────────
export function FadeIn({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger container ───────────────────────────────────────────────────────
export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease },
  },
};

export function StaggerList({ children, className = "" }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}

// ─── Animated <tr> for tables ────────────────────────────────────────────────
export const trVariants = {
  hidden: { opacity: 0, y: 6 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, delay: i * 0.04, ease },
  }),
};

// ─── Skeleton shimmer block ──────────────────────────────────────────────────
export function Skeleton({ className = "" }) {
  return (
    <div
      className={`relative overflow-hidden rounded-md bg-muted before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/[0.07] before:to-transparent ${className}`}
    />
  );
}

// ─── Table skeleton rows (matches invoice/proposal/organizer layout) ──────────
export function TableSkeletonRows({ rows = 6, cols = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-border/60">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-4 py-3.5">
              <Skeleton
                className={`h-3.5 ${
                  j === 0
                    ? "w-28"
                    : j === 1
                    ? "w-16 rounded-full"
                    : j === cols - 1
                    ? "w-8"
                    : "w-20"
                }`}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ─── Chat-row skeleton ────────────────────────────────────────────────────────
export function ChatSkeletonRows({ rows = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-5 py-3.5 border-b border-border/60 last:border-0"
        >
          <Skeleton className="h-9 w-9 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-2.5 w-52" />
          </div>
          <Skeleton className="h-2.5 w-8 shrink-0" />
        </div>
      ))}
    </>
  );
}

// ─── Home action-card skeleton ────────────────────────────────────────────────
export function HomeItemSkeletonRows({ rows = 4 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-5 py-3 border-b border-border/50 last:border-0">
          <div className="flex items-center gap-2 mb-2.5">
            <Skeleton className="h-3 w-3 rounded-sm" />
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-4 w-5 rounded-full ml-auto" />
          </div>
          <div className="space-y-1.5">
            {Array.from({ length: 2 }).map((_, j) => (
              <div
                key={j}
                className="flex items-center justify-between rounded-lg border border-border/40 px-3.5 py-2.5"
              >
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-2.5 w-44" />
                </div>
                <Skeleton className="h-3 w-3 rounded-sm shrink-0" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
