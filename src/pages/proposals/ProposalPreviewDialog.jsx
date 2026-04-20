


import React, { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import axios from "axios";
import HTMLReactParser from "html-react-parser";
import { toast } from "material-react-toastify";
import { X, CheckCircle, ChevronDown } from "lucide-react";

const ProposalPreviewDialog = ({ open, handleClose, proposal }) => {
  const [activeStep, setActiveStep] = useState("general");
  // Signature States
  const [signatureType, setSignatureType] = useState("draw");
  const [signatureData, setSignatureData] = useState(null);
  const [typedSignature, setTypedSignature] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const sigCanvas = useRef(null);
  
  // Check if proposal is signed
  const isSigned = proposal?.status === "Signed";
  
  // Determine enabled sections
  const steps = [
    { id: "introduction", label: "Introduction", enabled: proposal?.general?.introductionEnabled },
    { id: "terms", label: "Terms & Conditions", enabled: proposal?.general?.termsEnabled },
    { id: "services", label: "Services", enabled: proposal?.general?.servicesEnabled },
    { id: "payments", label: "Payments", enabled: proposal?.general?.paymentsEnabled },
    { id: "signature", label: "Sign & Accept", enabled: true },
  ].filter(s => s.enabled);

  const introRef = useRef(null);
  const termsRef = useRef(null);
  const servicesRef = useRef(null);
  const paymentsRef = useRef(null);
  const signatureRef = useRef(null);
  const refMap = {
    introduction: introRef,
    terms: termsRef,
    services: servicesRef,
    payments: paymentsRef,
    signature: signatureRef,
  };

  const handleStepClick = (id) => {
    const sectionRef = refMap[id];
    if (sectionRef?.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setActiveStep(id);
  };

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;

    for (let step of steps) {
      const stepRef = refMap[step.id];
      if (stepRef?.current) {
        const offsetTop = stepRef.current.offsetTop;
        if (scrollTop + 50 >= offsetTop) {
          setActiveStep(step.id);
        }
      }
    }
  };

  /** ✅ Complete button action */
  const handleCompleteProposal = async () => {
    try {
      setIsSigning(true);

      const payload = {
        status: "Signed",
        signedAt: new Date(),
        signature: signatureType === "draw" ? signatureData : typedSignature,
      };

      await axios.post(`https://www.snptaxes.com/account/proposals/sign/${proposal._id}`, payload);
      toast.success("Proposal signed successfully");
      handleClose();
    } catch (err) {
      console.error("Signature save error:", err);
    } finally {
      setIsSigning(false);
    }
  };

  const [invoiceAccordionOpen, setInvoiceAccordionOpen] = useState(false);

  return (
    <>
      {open && (
        <>
          <div className="fixed inset-0 z-[1200] bg-black/50" onClick={handleClose} />
          <div className="fixed inset-0 z-[1201] flex items-stretch justify-center pointer-events-none">
            <div
              className="pointer-events-auto flex flex-col bg-background shadow-2xl w-full max-w-5xl h-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card shrink-0">
                <h1 className="text-lg font-semibold text-foreground truncate">
                  {proposal?.general?.proposalName || "Proposal"}
                </h1>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="flex flex-1 overflow-hidden">
                {/* Left nav */}
                <nav className="w-56 shrink-0 border-r border-border bg-card overflow-y-auto">
                  <ul className="py-2">
                    {steps.map((step) => (
                      <li key={step.id}>
                        <button
                          type="button"
                          onClick={() => handleStepClick(step.id)}
                          className={`w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors rounded-none border-l-2 ${
                            activeStep === step.id
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-transparent text-foreground hover:bg-muted"
                          } ${isSigned ? "text-green-600 dark:text-green-400" : ""}`}
                        >
                          {isSigned && (
                            <CheckCircle size={14} className="text-green-500 shrink-0" />
                          )}
                          {step.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Right scrollable content */}
                <div
                  className="flex-1 overflow-y-auto px-6 md:px-10 py-6"
                  onScroll={handleScroll}
                >
                  {/* INTRODUCTION */}
                  {proposal?.general?.introductionEnabled && (
                    <div ref={introRef} className="mb-8">
                      <h2 className="text-base font-semibold text-foreground mb-2">
                        {proposal?.introduction?.title || "Introduction"}
                      </h2>
                      <div className="prose prose-sm max-w-none text-foreground leading-relaxed">
                        {HTMLReactParser(proposal?.introduction?.description || "")}
                      </div>
                      <hr className="border-border mt-4" />
                    </div>
                  )}

                  {/* TERMS */}
                  {proposal?.general?.termsEnabled && (
                    <div ref={termsRef} className="mb-8">
                      <h2 className="text-base font-semibold text-foreground mb-2">Terms & Conditions</h2>
                      <div className="prose prose-sm max-w-none text-foreground leading-relaxed">
                        {HTMLReactParser(proposal?.terms?.description || "")}
                      </div>
                      <hr className="border-border mt-4" />
                    </div>
                  )}

                  {/* SERVICES — ITEMIZED */}
                  {proposal?.general?.servicesEnabled && proposal?.services?.option === "services" && (
                    <div ref={servicesRef} className="mb-8">
                      <h2 className="text-base font-semibold text-foreground mb-3">Services</h2>
                      <div className="rounded-xl border border-border overflow-hidden">
                        <div className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] bg-muted/40 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          <span>Service</span>
                          <span className="text-right">Rate</span>
                          <span className="text-right">Qty</span>
                          <span className="text-right">Tax</span>
                          <span className="text-right">Amount</span>
                        </div>
                        {proposal?.services?.itemizedData?.lineItems?.map((item, i) => {
                          const rate = Number(item.rate || 0);
                          const qty = Number(item.quantity || 1);
                          const taxRate = proposal?.services?.itemizedData?.taxRate || 0;
                          const base = rate * qty;
                          const tax = item.tax ? (base * taxRate) / 100 : 0;
                          const total = base + tax;
                          return (
                            <div key={i} className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] border-t border-border px-3 py-2 text-sm text-foreground">
                              <div>
                                <p className="font-semibold">{item.productorService}</p>
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                              </div>
                              <span className="text-right">${rate.toFixed(2)}</span>
                              <span className="text-right">{qty}</span>
                              <span className="text-right">${tax.toFixed(2)}</span>
                              <span className="text-right">${total.toFixed(2)}</span>
                            </div>
                          );
                        })}
                        <div className="border-t border-border px-3 py-2 flex justify-end text-sm font-bold text-foreground">
                          Total: ${proposal?.services?.itemizedData?.totalAmount?.toFixed(2)}
                        </div>
                      </div>
                      <hr className="border-border mt-4" />
                    </div>
                  )}

                  {/* SERVICES — INVOICE */}
                  {proposal?.general?.servicesEnabled && proposal?.services?.option === "invoice" && (
                    <div ref={servicesRef} className="mb-8">
                      <h2 className="text-base font-semibold text-foreground mb-3">Invoice</h2>
                      <div className="space-y-3 mb-4">
                        {[
                          { label: "Amount", value: `$${proposal?.services?.invoices?.[0]?.totalAmount?.toFixed(2)}` },
                          { label: "Invoice will be issued", value: proposal?.services?.invoices?.[0]?.issueinvoice || "N/A" },
                          { label: "Description", value: proposal?.services?.invoices?.[0]?.description || "N/A" },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
                            <div className="rounded-lg bg-muted/30 border border-border px-3 py-2 text-sm text-foreground">{value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Accordion */}
                      <div className="rounded-xl border border-border overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setInvoiceAccordionOpen((v) => !v)}
                          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-foreground bg-muted/20 hover:bg-muted/40 transition-colors"
                        >
                          Invoice details
                          <ChevronDown
                            size={16}
                            className={`transition-transform ${invoiceAccordionOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                        {invoiceAccordionOpen && (
                          <div className="border-t border-border">
                            <div className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] bg-muted/40 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              <span>Service</span>
                              <span className="text-right">Rate</span>
                              <span className="text-right">Qty</span>
                              <span className="text-right">Tax</span>
                              <span className="text-right">Amount</span>
                            </div>
                            {proposal?.services?.invoices?.[0]?.lineItems?.map((item, i) => {
                              const rate = Number(item.rate || 0);
                              const qty = Number(item.quantity || 1);
                              const taxRate = proposal?.services?.invoices?.[0]?.taxRate || 0;
                              const base = rate * qty;
                              const tax = item.tax ? (base * taxRate) / 100 : 0;
                              const total = base + tax;
                              return (
                                <div key={i} className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] border-t border-border px-3 py-2 text-sm text-foreground">
                                  <div>
                                    <p className="font-semibold">{item.productorService}</p>
                                    <p className="text-xs text-muted-foreground">{item.description}</p>
                                  </div>
                                  <span className="text-right">${rate.toFixed(2)}</span>
                                  <span className="text-right">{qty}</span>
                                  <span className="text-right">${tax.toFixed(2)}</span>
                                  <span className="text-right">${total.toFixed(2)}</span>
                                </div>
                              );
                            })}
                            <div className="border-t border-border px-3 py-2 flex justify-end text-sm font-bold text-foreground">
                              Total: ${proposal?.services?.invoices?.[0]?.totalAmount?.toFixed(2)}
                            </div>
                          </div>
                        )}
                      </div>
                      <hr className="border-border mt-4" />
                    </div>
                  )}

                  {/* PAYMENTS */}
                  {proposal?.general?.paymentsEnabled && (
                    <div ref={paymentsRef} className="mb-8">
                      <h2 className="text-base font-semibold text-foreground mb-2">Payments</h2>
                      <div className="rounded-xl border border-border bg-muted/10 px-4 py-3 space-y-1 text-sm text-foreground">
                        <p><span className="font-semibold">Method:</span> {proposal?.payments?.method}</p>
                        <p><span className="font-semibold">Amount:</span> ${proposal?.payments?.amount}</p>
                      </div>
                      <hr className="border-border mt-4" />
                    </div>
                  )}

                  {/* SIGNATURE SECTION */}
                  <div ref={signatureRef} className="mb-8 max-w-lg">
                    <h2 className="text-base font-semibold text-foreground mb-2">Sign & Accept</h2>
                    <hr className="border-border mb-4" />

                    {proposal?.status === "Signed" ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle size={15} className="text-green-500" />
                          Signed on {new Date(proposal.signedAt).toLocaleString()}
                        </div>
                        <p className="text-sm font-semibold text-foreground">Signature:</p>
                        {proposal?.signature?.startsWith("data:image") ? (
                          <img
                            src={proposal.signature}
                            alt="signature"
                            className="max-w-xs rounded-lg border border-border bg-white p-2 mt-1"
                          />
                        ) : (
                          <div className="rounded-lg border border-border bg-muted/20 px-5 py-4 text-2xl font-[cursive] text-foreground mt-1">
                            {proposal.signature}
                          </div>
                        )}
                        <button
                          disabled
                          className="rounded-lg bg-primary/50 px-4 py-2 text-sm font-semibold text-primary-foreground cursor-not-allowed opacity-60 mt-2"
                        >
                          Already Signed
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {/* Toggle */}
                        <div className="flex rounded-lg border border-border overflow-hidden w-fit">
                          {["draw", "type"].map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setSignatureType(t)}
                              className={`px-5 py-2 text-sm font-medium transition-colors ${
                                signatureType === t
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-background text-foreground hover:bg-muted"
                              }`}
                            >
                              {t === "draw" ? "Draw" : "Type"}
                            </button>
                          ))}
                        </div>

                        {/* Draw */}
                        {signatureType === "draw" && (
                          <div className="space-y-3">
                            <div className="rounded-lg border border-border bg-muted/20 overflow-hidden">
                              <SignatureCanvas
                                ref={sigCanvas}
                                penColor="black"
                                canvasProps={{
                                  width: 500,
                                  height: 200,
                                  className: "w-full",
                                  style: { background: "transparent" },
                                }}
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => sigCanvas.current.clear()}
                                className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                              >
                                Clear
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (sigCanvas.current.isEmpty()) {
                                    toast.warning("Please draw your signature first");
                                    return;
                                  }
                                  setSignatureData(sigCanvas.current.toDataURL("image/png"));
                                }}
                                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                              >
                                Save Signature
                              </button>
                            </div>
                            {signatureData && (
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
                                  <CheckCircle size={14} />
                                  Signature saved successfully
                                </div>
                                <img
                                  src={signatureData}
                                  alt="preview"
                                  className="max-w-xs rounded-lg border border-border bg-white p-2"
                                />
                              </div>
                            )}
                          </div>
                        )}

                        {/* Type */}
                        {signatureType === "type" && (
                          <div className="space-y-3">
                            <input
                              type="text"
                              placeholder="Type your full name"
                              value={typedSignature}
                              onChange={(e) => setTypedSignature(e.target.value)}
                              className="w-full rounded-lg border border-border bg-background px-3 py-3 text-2xl font-[cursive] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                            />
                            {typedSignature && (
                              <div className="rounded-lg border border-border bg-muted/20 px-5 py-5 text-2xl font-[cursive] text-foreground">
                                {typedSignature}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Terms checkbox */}
                        <label className="flex items-start gap-2.5 cursor-pointer select-none mt-2">
                          <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            disabled={proposal?.status === "Signed"}
                            className="mt-1 accent-primary"
                          />
                          <span className="text-sm text-foreground">I accept the Terms & Conditions</span>
                        </label>

                        {/* Complete */}
                        <button
                          type="button"
                          disabled={
                            isSigning ||
                            !termsAccepted ||
                            (signatureType === "draw" ? !signatureData : !typedSignature) ||
                            proposal?.status === "Signed"
                          }
                          onClick={handleCompleteProposal}
                          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSigning ? "Saving…" : "Complete Proposal"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProposalPreviewDialog;