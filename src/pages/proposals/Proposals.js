import { useState, useContext, useEffect } from "react";
import { LoginContext } from "../../context/Context";
import axios from "axios";
import ProposalPreviewDialog from "../proposals//ProposalPreviewDialog";
import { data } from "react-router-dom";
import { toast } from "material-react-toastify";
import { FileText } from "lucide-react";
const Proposals = () => {
  const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_URL
    const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const { logindata } = useContext(LoginContext);
  const [loginuserid, setLoginUserId] = useState("");
  const [proposalsList, setProposalsList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
const [accountId, setAccountId] = useState(sessionStorage.getItem("accountId"));
 useEffect(() => {
  if (accountId) {
    fetchPrprosalsAllData(accountId);
  }
}, [accountId]);

  const fetchPrprosalsAllData = async (accId) => {
    try {
      const url = `https://www.snptaxes.com/account/proposals/byaccount/${accId}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch proposals");
      const result = await response.json();
      console.log("result",result)
      setProposalsList(result.proposallist);
    } catch (error) {
      console.error("Error fetching proposals:", error);
    }
  };

  const handleOpenDialog = (proposal) => {
    setSelectedProposal(proposal);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProposal(null);
fetchPrprosalsAllData(accountId);
  };

  const statusConfig = {
    Pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    Signed: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400",
    "Partially Signed": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  };

  return (
    <div className="w-full max-w-[1700px] p-4 space-y-6">
      {/* Page heading */}
      <div className="flex items-center gap-2">
        <FileText size={22} className="text-primary shrink-0" />
        <h1 className="text-2xl font-bold text-foreground">Proposals & ELs</h1>
      </div>

      {/* Table card */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Proposal Name", "Status", "Date"].map((label) => (
                  <th
                    key={label}
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {proposalsList.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No proposals found.
                  </td>
                </tr>
              ) : (
                proposalsList.map((row) => (
                  <tr
                    key={row._id}
                    className="hover:bg-muted/40 transition-colors cursor-pointer"
                    onClick={() => handleOpenDialog(row)}
                  >
                    <td className="px-4 py-3">
                      <span
                        title="View Details"
                        className="font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {row.general.proposalName || "Untitled"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          statusConfig[row.status] ?? "bg-muted text-muted-foreground"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(row.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProposalPreviewDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        proposal={selectedProposal}
      />
    </div>
  );
};

export default Proposals;
