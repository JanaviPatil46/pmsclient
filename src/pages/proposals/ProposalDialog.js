import React, { useState, useRef, useEffect, useContext } from "react";
import SignatureCanvas from "react-signature-canvas";
import { LoginContext } from "../../context/Context";
import { X, CheckCircle } from "lucide-react";

const ProposalDialog = ({ open, handleClose, proposal, onProposalSigned }) => {
  const { logindata } = useContext(LoginContext);
  const [loginUserId, setLoginUserId] = useState();
  useEffect(() => {
    if (logindata?.user?.id) {
      setLoginUserId(logindata.user.id);
    }
  }, [logindata]);
  console.log("proposal", proposal);
  const [selectedSection, setSelectedSection] = useState(null);
  const [signatureData, setSignatureData] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [signatureType, setSignatureType] = useState("draw"); // 'draw' or 'type'
  const [typedSignature, setTypedSignature] = useState("");
  const sectionRefs = useRef({});
  const sigCanvas = useRef(null);
  const [isSigning, setIsSigning] = useState(false);
  const contentRef = useRef(null); // Add this ref for the content container

  // Add scroll event listener
  // useEffect(() => {
  //   const contentElement = contentRef.current;
  //   if (!contentElement) return;

  //   const handleScroll = () => {
  //     const scrollPosition = contentElement.scrollTop + 300; // Adding some offset
  //     let activeSection = null;

  //     // Find which section is currently in view
  //     for (const [sectionKey, sectionElement] of Object.entries(sectionRefs.current)) {
  //       if (!sectionElement) continue;

  //       const { offsetTop, offsetHeight } = sectionElement;
  //       if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
  //         activeSection = sectionKey;
  //         break;
  //       }
  //     }

  //     if (activeSection && activeSection !== selectedSection) {
  //       setSelectedSection(activeSection);
  //     }
  //   };

  //   contentElement.addEventListener('scroll', handleScroll);
  //   return () => {
  //     contentElement.removeEventListener('scroll', handleScroll);
  //   };
  // }, [selectedSection]);
  const [isManualScroll, setIsManualScroll] = useState(false);

  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    const handleScroll = () => {
      if (isManualScroll) return; // Prevent updates during manual scroll

      const scrollPosition = contentElement.scrollTop + 300;
      let activeSection = null;

      for (const [sectionKey, sectionElement] of Object.entries(
        sectionRefs.current
      )) {
        if (!sectionElement) continue;

        const { offsetTop, offsetHeight } = sectionElement;
        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          activeSection = sectionKey;
          break;
        }
      }

      if (activeSection && activeSection !== selectedSection) {
        setSelectedSection(activeSection);
      }
    };

    contentElement.addEventListener("scroll", handleScroll);
    return () => {
      contentElement.removeEventListener("scroll", handleScroll);
    };
  }, [selectedSection, isManualScroll]);

  useEffect(() => {
    if (!proposal) return;

    if (proposal.introduction) setSelectedSection("introduction");
    else if (proposal.terms) setSelectedSection("terms");
    else if (
      proposal.servicesandinvoices &&
      proposal.Additemizedserviceswithoutcreatinginvoices === "service"
    )
      setSelectedSection("services");
    else if (
      proposal.servicesandinvoices &&
      proposal.Addinvoiceoraskfordeposit === "invoice"
    )
      setSelectedSection("invoices");
  }, [proposal]);

  useEffect(() => {
    if (selectedSection && sectionRefs.current[selectedSection]) {
      sectionRefs.current[selectedSection].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedSection]);

  const clearSignature = () => {
    sigCanvas.current.clear();
    setSignatureData(null);
  };

  const saveSignature = () => {
    if (!sigCanvas.current?.isEmpty()) {
      try {
        // Get the canvas and create a copy
        const canvas = sigCanvas.current.getCanvas();
        const tempCanvas = document.createElement("canvas");
        const ctx = tempCanvas.getContext("2d");

        // Set dimensions
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;

        // Draw the signature
        ctx.drawImage(canvas, 0, 0);

        // Convert to data URL
        const signature = tempCanvas.toDataURL("image/png");
        setSignatureData(signature);
      } catch (error) {
        console.error("Error saving signature:", error);
        alert("Failed to save signature. Please try again.");
      }
    }
  };

  const handleCompleteProposal = async () => {
    if (!termsAccepted || (!signatureData && !typedSignature)) {
      alert("Please accept the terms and provide a signature");
      return;
    }

    setIsSigning(true);
    try {
      await onProposalSigned({
        proposalId: proposal._id,
        signature: signatureData || typedSignature,
        signedAt: new Date().toISOString(),
        signedBy: loginUserId,
      });

      handleClose();
    } catch (error) {
      console.error("Error saving signature:", error);
      alert("Failed to save signature. Please try again.");
    } finally {
      setIsSigning(false);
    }
  };
  if (!proposal) return null;

  const sections = [];

  if (proposal.introduction) {
    sections.push({
      key: "introduction",
      label: proposal.introductiontextname,
      content: proposal.introductiontext,
    });
  }

  if (proposal.terms) {
    sections.push({
      key: "terms",
      label: proposal.termsandconditionsname,
      content: proposal.termsandconditions,
    });
  }

  // Add this check at the beginning of your component
  const isSigned = proposal?.status === "Signed";
  const existingSignature = proposal?.signature;
  sections.push({
    key: "signature",
    label: "Sign & accept",
    content: (
      <div className="max-w-lg">
        {isSigned ? (
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle size={16} className="text-green-500" />
              Signed on {new Date(proposal.signedAt).toLocaleString()}
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-2">Signature:</p>
              {existingSignature.startsWith("data:image") ? (
                <img
                  src={existingSignature}
                  alt="Saved signature"
                  className="max-w-xs rounded-lg border border-border bg-white p-2"
                />
              ) : (
                <div className="rounded-lg border border-border bg-muted/30 px-5 py-4 text-2xl font-[cursive] text-foreground">
                  {existingSignature}
                </div>
              )}
            </div>

            <label className="flex items-start gap-2.5 cursor-not-allowed select-none">
              <input type="checkbox" checked disabled className="mt-1 accent-primary" />
              <span className="text-sm text-muted-foreground">
                Terms accepted on {new Date(proposal.signedAt).toLocaleString()}
              </span>
            </label>

            <button
              disabled
              className="w-full rounded-lg bg-primary/50 px-4 py-2.5 text-sm font-semibold text-primary-foreground cursor-not-allowed opacity-60"
            >
              Already Signed
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground text-center">Your signature</p>

            {/* Toggle */}
            <div className="flex rounded-lg border border-border overflow-hidden w-fit mx-auto">
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
                  {t === "draw" ? "Draw Signature" : "Type Signature"}
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
                      className: "signature-canvas w-full",
                      style: { background: "transparent" },
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={clearSignature}
                    disabled={isSigning}
                    className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={saveSignature}
                    disabled={isSigning}
                    className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                  >
                    Save Signature
                  </button>
                </div>
                {signatureData && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
                      <CheckCircle size={14} />
                      Signature saved
                    </div>
                    <img
                      src={signatureData}
                      alt="Saved signature"
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
                  placeholder="Type your name as signature"
                  value={typedSignature}
                  onChange={(e) => setTypedSignature(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-3 text-xl font-[cursive] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                {typedSignature && (
                  <div className="rounded-lg border border-border bg-muted/20 px-5 py-5 text-2xl font-[cursive] text-foreground">
                    {typedSignature}
                  </div>
                )}
              </div>
            )}

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                disabled={isSigning}
                className="mt-1 accent-primary"
              />
              <span className="text-sm text-foreground">
                I accept the above terms and TaxDome's Terms of Service
              </span>
            </label>

            {/* Complete */}
            <button
              type="button"
              onClick={handleCompleteProposal}
              disabled={
                !termsAccepted ||
                (signatureType === "draw" ? !signatureData : !typedSignature) ||
                isSigning
              }
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSigning ? "Processing…" : "Complete"}
            </button>
          </div>
        )}
      </div>
    ),
  });

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
                  {proposal?.proposalname || "Proposal"}
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
                    {sections.map((section) => (
                      <li key={section.key}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSection(section.key);
                            setIsManualScroll(true);
                            sectionRefs.current[section.key]?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                            setTimeout(() => setIsManualScroll(false), 800);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors rounded-none border-l-2 ${
                            selectedSection === section.key
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-transparent text-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {section.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Right scrollable content */}
                <div
                  ref={contentRef}
                  className="flex-1 overflow-y-auto scroll-smooth px-8 py-6"
                >
                  {sections.map((section) => (
                    <div
                      key={section.key}
                      ref={(el) => (sectionRefs.current[section.key] = el)}
                      className="mb-10"
                    >
                      <h2 className="text-base font-semibold text-foreground mb-2">
                        {section.label}
                      </h2>
                      <hr className="border-border mb-4" />
                      {typeof section.content === "string" ? (
                        <div
                          className="prose prose-sm max-w-none text-foreground leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: section.content }}
                        />
                      ) : (
                        section.content
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProposalDialog;
