import React, { useState } from "react";
import { UploadCloud, MessageCircle, Phone, MapPin, TrendingDown, CreditCard } from "lucide-react";
import NewChat from "../pages/chats&tasks/NewChat";
const QuickLinks = ({ accountId, accountName }) => {
  const [open, setOpen] = useState(false);
  console.log("accountId from quicklinks",accountId)
  console.log("accountName from quicklinks",accountName)
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div className="flex flex-col gap-4 font-sans">

      {/* ── Quick Links card ── */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border bg-muted/40">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <p className="text-[13px] font-semibold text-foreground tracking-tight">Quick Links</p>
        </div>
        <div className="grid grid-cols-2 gap-1 p-3">
          <button
            type="button"
            className="group flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-500/10 text-amber-500 group-hover:bg-amber-500/20 transition-colors">
              <UploadCloud size={15} strokeWidth={1.8} />
            </span>
            Upload Documents
          </button>

          <button
            type="button"
            onClick={handleOpen}
            className="group flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
              <MessageCircle size={15} strokeWidth={1.8} />
            </span>
            Chats
          </button>
        </div>
      </div>

      {/* ── Balance card ── */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border bg-muted/40">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <p className="text-[13px] font-semibold text-foreground tracking-tight">Balance</p>
        </div>
        <div className="grid grid-cols-2 divide-x divide-border">
          {/* Credits Available */}
          <div className="flex flex-col items-center gap-2 px-4 py-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/10">
              <CreditCard size={16} className="text-green-600 dark:text-green-400" strokeWidth={1.8} />
            </div>
            <p className="text-[11px] font-medium text-muted-foreground text-center">Credits Available</p>
            <p className="text-base font-bold text-green-600 dark:text-green-400">$0.00</p>
          </div>
          {/* Outstanding Balance */}
          <div className="flex flex-col items-center gap-2 px-4 py-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-warning/10">
              <TrendingDown size={16} className="text-warning" strokeWidth={1.8} />
            </div>
            <p className="text-[11px] font-medium text-muted-foreground text-center">Outstanding Balance</p>
            <p className="text-base font-bold text-warning">$0.00</p>
          </div>
        </div>
      </div>

      {/* ── Contact Info card ── */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border bg-muted/40">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <p className="text-[13px] font-semibold text-foreground tracking-tight">Contact Info</p>
        </div>
        <div className="divide-y divide-border">
          {/* Phone */}
          <div className="flex items-center gap-3 px-5 py-3.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
              <Phone size={14} className="text-primary" strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-muted-foreground">Phone</p>
              <p className="text-[13px] font-semibold text-foreground">(925) 800-3561</p>
            </div>
          </div>
          {/* Address */}
          <div className="flex items-start gap-3 px-5 py-3.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-500/10 mt-0.5">
              <MapPin size={14} className="text-amber-500" strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-muted-foreground">Address</p>
              <p className="text-[13px] font-semibold text-foreground leading-snug">
                3015 Hopyard Rd, Ste M,<br />Pleasanton, CA 94588
              </p>
            </div>
          </div>
        </div>
      </div>

      <NewChat
        open={open}
        close={handleClose}
        accId={accountId}
        accountName={accountName}
      />
    </div>
  );
};

export default QuickLinks;
