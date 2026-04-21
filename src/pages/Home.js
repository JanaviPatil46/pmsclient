import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import QuickLinks from "../components/QuickLinks";
import OrganizersList from "../components/Home Components/OrganizersList";
import BillingList from "../components/Home Components/BillingList";
import ChatsList from "../components/Home Components/ChatsList";
import ProposalsList from "../components/Home Components/ProposalsList";
import axios from "axios";
import DocuSealWrapper from "../components/Home Components/DocuSealWrapper";
import DocumnetApprovals from "../components/Home Components/DocumnetApprovals";
import DocuSealMultiSigner from "../components/Home Components/DocuSealMultiSigner";
import PendingApprovals from "../components/Home Components/PendingApprovals";
import { PageTransition, FadeIn, HomeItemSkeletonRows } from "../components/ui/motion";
import useShortcuts from "../src/hooks/useShortcuts";

const ease = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease } },
};

const useSectionHighlight = (ref) => {
  const highlight = useCallback(() => {
    if (!ref.current) return;
    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    ref.current.classList.add("ring-2", "ring-primary/40", "ring-offset-2");
    setTimeout(() => {
      ref.current?.classList.remove("ring-2", "ring-primary/40", "ring-offset-2");
    }, 1800);
  }, [ref]);
  return highlight;
};

const Home = () => {
  const [accountId] = useState(sessionStorage.getItem("accountId"));
  const [adminUserId, setAdminUserId] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountLoading, setAccountLoading] = useState(true);

  const pendingRef = useRef(null);
  const quickLinksRef = useRef(null);

  const focusPending = useSectionHighlight(pendingRef);
  const focusQuickLinks = useSectionHighlight(quickLinksRef);

  useShortcuts([
    {
      id: "home_focus_pending",
      keys: ["meta", "shift", "a"],
      action: focusPending,
      scope: "dashboard",
      description: "Focus Pending Actions",
      group: "Dashboard",
    },
    {
      id: "home_focus_quicklinks",
      keys: ["meta", "shift", "q"],
      action: focusQuickLinks,
      scope: "dashboard",
      description: "Focus Quick Links",
      group: "Dashboard",
    },
  ]);

  const fetchAccountDetails = useCallback(async () => {
    if (!accountId) { setAccountLoading(false); return; }
    try {
      setAccountLoading(true);
      const res = await axios.get(`https://www.snptaxes.com/api/accounts/${accountId}`);
      setAccountName(res.data.accountName);
      setAdminUserId(res.data.adminUserId.emailSyncEmail);
    } catch (_) {
    } finally {
      setAccountLoading(false);
    }
  }, [accountId]);

  useEffect(() => { fetchAccountDetails(); }, [fetchAccountDetails]);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <PageTransition className="w-full max-w-[1700px] flex-1 h-[90vh] overflow-auto">
      <div className="p-4 sm:p-6 flex flex-col gap-6">

        {/* Greeting */}
        <FadeIn>
          <div className="flex flex-col gap-0.5">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {greeting}{accountName ? `, ${accountName}` : ""}
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Here's what needs your attention today.
            </p>
          </div>
        </FadeIn>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start"
        >
          {/* Pending Actions card */}
          <motion.div
            variants={cardVariants}
            ref={pendingRef}
            className="rounded-xl border border-border bg-card shadow-sm overflow-hidden transition-shadow duration-200 hover:shadow-md"
          >
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border bg-muted/20">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <p className="text-[13px] font-semibold text-foreground tracking-tight">
                Waiting for action
              </p>
              <kbd className="ml-auto rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                ⌘⇧A
              </kbd>
            </div>

            <div className="divide-y divide-border/50">
              {accountLoading ? (
                <HomeItemSkeletonRows rows={3} />
              ) : (
                <>
                  <OrganizersList accountId={accountId} />
                  <BillingList accountId={accountId} />
                  <ChatsList accountId={accountId} />
                  <ProposalsList accountId={accountId} />
                  <DocuSealWrapper accountId={accountId} />
                  <DocuSealMultiSigner accountId={accountId} />
                  <DocumnetApprovals accountId={accountId} adminUserId={adminUserId} />
                  <PendingApprovals accountId={accountId} adminUserId={adminUserId} />
                </>
              )}
            </div>
          </motion.div>

          {/* Quick Links sidebar */}
          <motion.div variants={cardVariants} ref={quickLinksRef} className="sticky top-0">
            <QuickLinks accountId={accountId} accountName={accountName} />
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Home;
