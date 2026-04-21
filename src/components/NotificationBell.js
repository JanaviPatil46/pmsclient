import * as React from "react";
import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCheck,
  Info,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";

// ─── API constants ────────────────────────────────────────────────────────────
const CHAT_API = process.env.REACT_APP_CHAT_API;
const INVOICE_API = process.env.REACT_APP_INVOICES_URL;

// ─── Relative time helper ─────────────────────────────────────────────────────
function relativeTime(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const typeConfig = {
  success: {
    Icon: CheckCircle,
    bg: "bg-green-500/10",
    color: "text-green-500",
  },
  info: {
    Icon: Info,
    bg: "bg-primary/10",
    color: "text-primary",
  },
  warning: {
    Icon: AlertTriangle,
    bg: "bg-amber-500/10",
    color: "text-amber-500",
  },
};

// ─── NotificationSkeleton ─────────────────────────────────────────────────────
function NotificationSkeleton() {
  return (
    <div className="flex gap-3 px-4 py-3 border-b border-border/60 last:border-0">
      <div className="h-8 w-8 rounded-full bg-muted animate-pulse shrink-0" />
      <div className="flex-1 space-y-2 py-0.5">
        <div className="h-3 w-28 rounded bg-muted animate-pulse" />
        <div className="h-2.5 w-44 rounded bg-muted animate-pulse" />
      </div>
    </div>
  );
}

// ─── NotificationItem ─────────────────────────────────────────────────────────
function NotificationItem({ notification, onRead }) {
  const { Icon, bg, color } = typeConfig[notification.type] || typeConfig.info;

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onRead(notification.id)}
      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors duration-150 border-b border-border/60 last:border-0 ${
        notification.read
          ? "hover:bg-muted/30"
          : "bg-primary/[0.025] hover:bg-primary/[0.05]"
      }`}
    >
      {/* Type icon */}
      <span
        className={`shrink-0 flex h-8 w-8 items-center justify-center rounded-full ${bg}`}
      >
        <Icon size={14} className={color} strokeWidth={2} />
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p
            className={`text-[13px] truncate leading-snug ${
              notification.read
                ? "text-muted-foreground font-normal"
                : "text-foreground font-semibold"
            }`}
          >
            {notification.title}
          </p>
          <span className="shrink-0 text-[11px] text-muted-foreground">
            {notification.time}
          </span>
        </div>
        <p className="text-[12px] text-muted-foreground mt-0.5 truncate leading-snug">
          {notification.description}
        </p>
      </div>

      {/* Unread dot */}
      {!notification.read && (
        <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
      )}
    </motion.button>
  );
}

// ─── NotificationDropdown ─────────────────────────────────────────────────────
function NotificationDropdown({ notifications, loading, onRead, onMarkAll, onClose }) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -6 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="absolute right-0 top-full mt-2 w-[340px] rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden origin-top-right"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-semibold text-foreground">
            Notifications
          </p>
          {unreadCount > 0 && (
            <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-1.5 py-0 text-[10px] font-bold text-primary">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAll}
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-muted"
              title="Mark all as read"
            >
              <CheckCheck size={12} />
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="flex items-center justify-center h-6 w-6 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-[360px] overflow-y-auto overscroll-contain">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <NotificationSkeleton key={i} />
          ))
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Bell size={20} className="text-muted-foreground" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium text-foreground">You're all caught up</p>
            <p className="text-[12px] text-muted-foreground">No new notifications right now.</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {notifications.map((n, i) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onRead={onRead}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-border px-4 py-2.5">
          <button className="w-full text-center text-[12px] text-muted-foreground hover:text-primary transition-colors font-medium py-0.5">
            View all notifications
          </button>
        </div>
      )}
    </motion.div>
  );
}

// ─── NotificationBell (main export) ──────────────────────────────────────────
export default function NotificationBell() {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [notifications, setNotifications] = React.useState([]);
  const containerRef = useRef(null);

  // Fetch real data from 3 sources in parallel
  React.useEffect(() => {
    const accountId = sessionStorage.getItem("accountId");
    if (!accountId) { setLoading(false); return; }

    const fetchAll = async () => {
      try {
        const [chatsRes, approvalsRes, invoicesRes] = await Promise.allSettled([
          fetch(`${CHAT_API}/chats/chatsaccountwise/isactivechat/${accountId}/true`)
            .then((r) => r.json()),
          fetch(`https://www.snptaxes.com/api/accountsdoc/documents/pending-approvals?folderPath=${accountId}`)
            .then((r) => r.json()),
          fetch(`${INVOICE_API}/workflow/invoices/invoice/invoicelistby/accountid/${accountId}`)
            .then((r) => r.json()),
        ]);

        const items = [];

        // ── Unread chats → info notifications ──
        if (chatsRes.status === "fulfilled") {
          const chats = chatsRes.value?.chataccountwise || [];
          chats.forEach((chat) => {
            const unread = (chat.description || []).filter(
              (m) => m.isRead === false && m.fromwhome === "Admin"
            ).length;
            if (unread > 0) {
              items.push({
                id: `chat-${chat._id}`,
                type: "info",
                title: "Unread Message",
                description: `${unread} unread message${unread > 1 ? "s" : ""} in "${chat.chatsubject || "Chat"}"`,
                time: relativeTime(chat.updatedAt),
                read: false,
              });
            }
          });
        }

        // ── Pending approvals → warning notifications ──
        if (approvalsRes.status === "fulfilled") {
          const docs = approvalsRes.value?.documents || [];
          docs.forEach((doc) => {
            items.push({
              id: `approval-${doc._id || doc.approvalId}`,
              type: "warning",
              title: "Approval Required",
              description: `"${doc.filename || doc.name || "Document"}" is waiting for your approval.`,
              time: relativeTime(doc.createdAt || doc.updatedAt),
              read: false,
            });
          });
        }

        // ── Unpaid invoices → warning notifications ──
        if (invoicesRes.status === "fulfilled") {
          const invoices = invoicesRes.value?.invoice || [];
          invoices
            .filter((inv) => inv.invoiceStatus?.toLowerCase() !== "paid")
            .forEach((inv) => {
              items.push({
                id: `invoice-${inv._id}`,
                type: "warning",
                title: "Invoice Due",
                description: `Invoice #${inv.invoicenumber} of $${inv.summary?.total?.toFixed(2) || "0.00"} is ${inv.invoiceStatus || "unpaid"}.`,
                time: relativeTime(inv.invoicedate),
                read: false,
              });
            });
        }

        // Sort newest-first (already ordered by insertion; approvals + invoices may lack date)
        setNotifications(items);
      } catch (err) {
        console.error("NotificationBell fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAll = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div ref={containerRef} className="relative shrink-0">
      {/* Bell button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.93 }}
        aria-label="Open notifications"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center justify-center h-8 w-8 rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
          open
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
      >
        <Bell size={17} strokeWidth={1.8} />
      </motion.button>

      {/* Unread badge */}
      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className="pointer-events-none absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center px-1 ring-2 ring-background"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <NotificationDropdown
            notifications={notifications}
            loading={loading}
            onRead={handleRead}
            onMarkAll={handleMarkAll}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
