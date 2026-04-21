import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  IconButton,
  DialogContentText,
  TextField,
  Typography,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import { FileClock, ArrowRight } from "lucide-react";
import { toast } from "material-react-toastify";
const DocumentApprovals = ({ accountId, adminUserId }) => {
  const [clientEmail, setClientEmail] = useState(
    sessionStorage.getItem("email")
  );
  const [approvals, setApprovals] = useState([]);
  const [openViewer, setOpenViewer] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  //  const [accountId, setAccountId] = useState(sessionStorage.getItem("accountId"));

  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;

  // const fetchApprovals = async () => {
  //   try {
  //     const { data } = await axios.get(
  //       `${DOCS_MANAGMENTS}/approvals/approvalList/${accountId}/pending`
  //     );
  //     setApprovals(data.pendingApprovals || []);
  //     console.log("Fetched approvals:", data);
  //   } catch (error) {
  //     console.error("Error fetching approvals:", error);
  //   }
  // };

  const fetchApprovals = async () => {
    try {
      const { data } = await axios.get( 
        `https://www.snptaxes.com/api/accountsdoc/documents/pending-approvals?folderPath=${accountId}`
      );
      // setApprovals(data.pendingApprovals || []);
      console.log("Fetched approvals:", data);
    } catch (error) {
      console.error("Error fetching approvals:", error);
    }
  };

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // 🔹 Frontend: Update any status (read, sign, approval)
  const updateStatus = async (
    item,
    statusType,
    newValue,
    action,
    reason = ""
  ) => {
    try {
      if (!item?.path) return alert("Invalid item selected");
      console.log("item path for updating status", item.path);
      const body = {
        targetPath: item.path,
        // status: {
        //   [statusType]: newValue, // dynamic key
        // },
        status: {
          [statusType]: newValue,
          ...(action === "cancel" && reason ? { cancelReason: reason } : {}),
        },
      };

      const res = await fetch(
        "https://www.snptaxes.com/api/accountsdoc/updateStatus",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (res.ok) {
        // alert(data.message || "Status updated successfully");
        // fetchFolderTree(accountId); // refresh folder tree to reflect change
        toast.success(
          action === "approve"
            ? "Document approved successfully 🎉"
            : "Document disapproved successfully ❌"
        );
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Error updating status");
    }
  };
  const handleAction = async (id, action, reason = "") => {
    try {
      console.log("Sending approval request:", {
        id,
        action,
        description: reason,
        accountId,
        adminUserId,
      });

      const res = await axios.patch(
        `${DOCS_MANAGMENTS}/approvals/client-approvals/${id}`,
        {
          action,
          description: reason,
          accountId,
          adminUserId,
        }
      );

      console.log("✅ Approval response:", res.data);

      // Extract FULL original path
      let originalPath = "";
      if (selectedDoc?.fileUrl) {
        const splitPath = selectedDoc.fileUrl.split("/uploads/accounts/");
        if (splitPath.length > 1) {
          originalPath = splitPath[1]; // FULL path including file name
        }
        console.log("📌 Original document path:", originalPath);
      }

      // Status change
      const newStatus =
        action === "approve" ? "approvalCompleted" : "canceledApproval";

      // Update status directly using original file path
      await updateStatus(
        { path: originalPath },
        "authStatus",
        newStatus,
        action,
        cancelReason
      );
      // Cleanup UI
      setOpenViewer(false);
      setCancelDialogOpen(false);
      setCancelReason("");

      fetchApprovals(); // refresh list
    } catch (error) {
      console.error(`❌ Error performing ${action} approval:`, error);
      if (error.response) console.error("Response data:", error.response.data);
    }
  };

  const handleCancelClick = () => {
    setCancelDialogOpen(true);
  };

  const confirmCancel = () => {
    handleAction(selectedDoc._id, "cancel", cancelReason);
  };
  const handleOpenViewer = (doc) => {
    console.log("selected document", doc);
    setSelectedDoc(doc);
    setOpenViewer(true);
  };

  const handleCloseViewer = () => {
    setOpenViewer(false);
    setSelectedDoc(null);
  };

  useEffect(() => {
    if (clientEmail) fetchApprovals();
  }, [clientEmail]);

  return (
    <>
      {approvals.length > 0 && (
        <div className="px-5 py-3">
          <div className="flex items-center gap-2 mb-2.5">
            <FileClock size={13} className="text-violet-400 shrink-0" />
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Document Approvals</span>
            <span className="ml-auto text-[11px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
              {approvals.length}
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {approvals.map((doc, index) => (
              <div
                key={index}
                onClick={() => handleOpenViewer(doc)}
                className="group flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background px-3.5 py-2.5 cursor-pointer hover:bg-muted/50 hover:border-border transition-all duration-200"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <FileClock size={11} className="text-violet-400 shrink-0" />
                    <p className="text-[12px] font-semibold text-foreground truncate">{doc.filename}</p>
                  </div>
                </div>
                <ArrowRight size={13} className="shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog
        open={openViewer}
        onClose={handleCloseViewer}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            {" "}
            <DescriptionIcon fontSize="small" sx={{ color: "#f0c000" }} />
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, flexGrow: 1 }}
              noWrap
            >
              {selectedDoc?.filename || "Document"}
            </Typography>
            {selectedDoc?.description && (
              <Tooltip title={selectedDoc.description} arrow placement="right">
                <IconButton
                  size="small"
                  sx={{ color: "text.secondary" }}
                  style={{ cursor: "pointer" }}
                >
                  <WarningAmberIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          <Box>
            <IconButton onClick={handleCloseViewer}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ height: "80vh" }}>
          {selectedDoc ? (
            <iframe
              src={selectedDoc.fileUrl}
              title={selectedDoc.filename}
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              No document selected
            </Typography>
          )}
        </DialogContent>

        {selectedDoc && (
          <DialogActions sx={{ justifyContent: "center", p: 2 }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleAction(selectedDoc._id, "approve")}
            >
              Approve
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleCancelClick}
            >
              Disapprove
            </Button>
          </DialogActions>
        )}
      </Dialog>
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Cancel Document Approval</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please provide a reason for cancelling this document approval:
          </DialogContentText>
          <Typography gutterBottom>Description</Typography>
          <TextField
            autoFocus
            fullWidth
            multiline
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Close</Button>
          <Button
            variant="contained"
            color="error"
            disabled={!cancelReason.trim()}
            onClick={confirmCancel}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DocumentApprovals;
