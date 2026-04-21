

import React, { useState, useEffect } from "react";
import { FileText, ArrowRight } from "lucide-react";
import axios from "axios";
import ProposalPreviewDialog from "../../pages/proposals/ProposalPreviewDialog";
const ProposalsList = ({accountId}) => {
  const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_URL
  const [proposals, setProposals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
console.log("vhjs", accountId)
  const fetchProposalsAllData = async () => {
    try {
      const url = `https://www.snptaxes.com/account/proposals/byaccount/${accountId}/status/pending`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch Proposals templates");
      }
      const result = await response.json();
console.log("result proposals", result)
      setProposals(result.proposallist || []);
    } catch (error) {
      console.error("Error fetching Proposals templates:", error);
    }
  };
console.log("acc proposals", proposals)
  // useEffect(() => {
  //   fetchProposalsAllData();
  // }, []);
useEffect(() => {
  if (accountId) {
    fetchProposalsAllData();
  }
}, [accountId]);
  const handleOpenDialog = (proposal) => {
    setSelectedProposal(proposal);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProposal(null);
  };
const signProposal = async (signatureData) => {
  console.log("signatureData",signatureData)
  try {
    const response = await axios.patch(
      `${PROPOSAL_API}/proposalandels/proposalaccountwise/${signatureData.proposalId}/sign`,
      {
        
        signature: signatureData.signature,
        signedAt: signatureData.signedAt,
        signedBy:signatureData.signedBy
        
      },
      
    );
 console.log(response)
    return response.data;
   
  } catch (error) {
    console.error('Error signing proposal:', error);
    throw error;
  }
};
  return (
    <>
      {proposals.length > 0 && (
        <div className="px-5 py-3">
          <div className="flex items-center gap-2 mb-2.5">
            <FileText size={13} className="text-amber-400 shrink-0" />
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Proposals & ELs</span>
            <span className="ml-auto text-[11px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
              {proposals.length}
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {proposals.map((proposal, index) => (
              <div
                key={index}
                onClick={() => handleOpenDialog(proposal)}
                className="group flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background px-3.5 py-2.5 cursor-pointer hover:bg-muted/50 hover:border-border transition-all duration-200"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <FileText size={11} className="text-amber-400 shrink-0" />
                    <p className="text-[12px] font-semibold text-foreground">Review and Sign</p>
                  </div>
                  <p className="text-[12px] text-muted-foreground truncate mt-0.5">{proposal.general.proposalName}</p>
                </div>
                <ArrowRight size={13} className="shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      )}
      <ProposalPreviewDialog
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        proposal={selectedProposal}
      />
    </>
  );
};

export default ProposalsList;
