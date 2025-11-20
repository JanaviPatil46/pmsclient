

import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions, Tooltip,
  IconButton,DialogContentText,TextField
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import { toast } from "material-react-toastify";
const DocumentApprovals = ({ accountId,adminUserId }) => {
  const [clientEmail, setClientEmail] = useState(sessionStorage.getItem("email"));
  const [approvals, setApprovals] = useState([]);
  const [openViewer, setOpenViewer] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  //  const [accountId, setAccountId] = useState(sessionStorage.getItem("accountId"));

  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;

  
  const fetchApprovals = async () => {
    try {
      const { data } = await axios.get(
        `${DOCS_MANAGMENTS}/approvals/approvalList/${accountId}/pending`
      );
      setApprovals(data.pendingApprovals || []);
    } catch (error) {
      console.error("Error fetching approvals:", error);
    }
  };
 const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  

 

    // 🔹 Frontend: Update any status (read, sign, approval)
    const updateStatus = async (item, statusType, newValue,action,reason = "") => {
      try {
        if (!item?.path) return alert("Invalid item selected");
  
        const body = {
          targetPath: item.path,
          // status: {
          //   [statusType]: newValue, // dynamic key
          // },
           status: {
        [statusType]: newValue,
        ...(action === "cancel" && reason ? { cancelReason: reason } : {})
      }
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

 // ✅ Extract parent folder path from fileUrl
    if (selectedDoc?.fileUrl) {
      // Remove base URL and '/uploads/accounts/'
      let relativePath = selectedDoc.fileUrl.split("/uploads/accounts/")[1];

      if (relativePath) {
        // Remove filename from the end
        const parts = relativePath.split("/");
        parts.pop(); // remove the file name (Invoice_14.pdf)
        const parentPath = parts.join("/");

        console.log("📁 Extracted parentPath:", parentPath);

        // Determine new status
        const newStatus = action === "approve" ? "approvalCompleted" : "cancledApproval";

        // Call updateStatus
        // await updateStatus({ path: parentPath }, "authStatus", newStatus,action);
        await updateStatus(
  { path: parentPath },
  "authStatus",
  newStatus,
  action,
  cancelReason
);

      } else {
        console.warn("⚠️ Could not extract parentPath from fileUrl:", selectedDoc.fileUrl);
      }
    }
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
    console.log("selected document",doc)
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
        <Box>
          <Stack
            sx={{
              p: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Typography
              component="h2"
              variant="subtitle2"
              gutterBottom
              sx={{ fontWeight: "600" }}
            >
              Pending Approvals ({approvals.length})
            </Typography>
          </Stack>

          <Box mt={2}>
            {approvals.map((doc, index) => (
              <Stack key={index} mb={1.5}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                    transition: "all 0.3s",
                    cursor: "pointer",
                    "&:hover": {
                      boxShadow: 3,
                      backgroundColor: "#f9f9f9",
                    },
                  }}
                  onClick={() => handleOpenViewer(doc)}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <DescriptionIcon fontSize="small" sx={{ color: "#f0c000" }} />
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {doc.filename}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Stack>
            ))}
          </Box>
        </Box>
      )}

   
        <Dialog open={openViewer} onClose={handleCloseViewer} fullWidth maxWidth="md">
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent:"space-between"}}>
          <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:2}}> <DescriptionIcon fontSize="small" sx={{ color: "#f0c000" }} />
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, flexGrow: 1 }}
            noWrap
          >
            {selectedDoc?.filename || "Document"}
          </Typography>

          {selectedDoc?.description && (
            <Tooltip title={selectedDoc.description} arrow placement="right">
              <IconButton size="small" sx={{ color: "text.secondary" }} style={{cursor:'pointer'}}>
                <WarningAmberIcon />
              </IconButton>
            </Tooltip>
          )}</Box>
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
              // onClick={() => handleAction(selectedDoc._id, "cancel")}
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
