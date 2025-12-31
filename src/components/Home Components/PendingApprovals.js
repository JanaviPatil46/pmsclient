import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Tooltip,
  DialogActions,
  Button,
  IconButton,
  DialogContentText,
  TextField, Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import axios from "axios";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { toast } from "material-react-toastify";
import { useNavigate } from "react-router-dom";
const PendingApprovals = ({ accountId, adminUserId }) => {
  const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
const [selectedInvoiceFile, setSelectedInvoiceFile] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [openViewer, setOpenViewer] = useState(false);
    const [accountName, setAccountName] = useState("");
     const fetchAccountDetails = async () => {
      try {
        const res = await axios.get(
          `https://www.snptaxes.com/api/accounts/${accountId}`
        );
        // setAccount(res.data);
        console.log("result account", res.data);
        setAccountName(res.data.accountName);
        console.log("account name", res.data.accountName);
        // setAdminUserId(res.data.adminUserId.email);
      } catch (error) {
        console.error("Error fetching account details:", error);
      }
    };

    useEffect(() => {
      // if (loginUserId) {
      fetchAccountDetails();
      // }
    }, [accountId]);
    const INVOICE_NEW = process.env.REACT_APP_INVOICES_URL;
    const fetchInvoicesByIds = async (ids = []) => {
      try {
        if (!ids.length) return [];

        // Create an array of fetch promises
        const fetchPromises = ids.map((id) => {
          const url = `${INVOICE_NEW}/workflow/invoices/invoice/invoicelist/invoicelistbyid/${id}`;
          return fetch(url, { method: "GET", redirect: "follow" }).then((res) =>
            res.json()
          );
        });

        // Wait for all invoices to be fetched
        const results = await Promise.all(fetchPromises);

        // Filter only valid invoices and transform them
        const invoices = results
          .filter((result) => result?.invoice)
          .map((result) => {
            const inv = result.invoice;

            const lineItems = inv.lineItems.map((item) => ({
              productName: item.productorService || "",
              description: item.description || "",
              rate: String(item.rate || "0.00"),
              qty: String(item.quantity || "1"),
              amount: String(item.amount || "0.00"),
              tax: item.tax || false,
              isDiscount: item.isDiscount || false,
            }));

            return {
              _id: inv._id,
              invoicenumber: inv.invoicenumber,
              invoicedate: inv.invoicedate,
              account: inv.account
                ? { value: inv.account._id, label: inv.account.accountName }
                : null,
              invoicetemplate: inv.invoicetemplate
                ? {
                    value: inv.invoicetemplate._id,
                    label: inv.invoicetemplate.templatename,
                  }
                : null,
              paymentMethod: {
                value: inv.paymentMethod,
                label: inv.paymentMethod,
              },
              teammember: inv.teammember
                ? { value: inv.teammember._id, label: inv.teammember.username }
                : null,
              description: inv.description,
              emailToClient: inv.emailinvoicetoclient,
              scheduledInvoice: inv.scheduleinvoice,
              payInvoiceWithCredits: inv.payInvoicewithcredits,
              isEmailInvoice: inv.emailinvoicetoclient,
              reminders: inv.reminders,
              lineItems,
              summary: inv.summary || {},
            };
          });

        return invoices;
      } catch (error) {
        console.error("Error fetching invoices:", error);
        return [];
      }
    };
  const handleOpenViewer = async(doc) => {
    console.log("selected document", doc);
     const hasPendingInvoice =
    doc?.meta?.lockInvoiceStatus === "pendingpayment" &&
    Array.isArray(doc?.meta?.invoiceLock) &&
    doc.meta.invoiceLock.length > 0;

  if (hasPendingInvoice) {
    // 🔒 Show invoice dialog FIRST
    // setSelectedInvoiceFile(doc);
     const invoices = await fetchInvoicesByIds(doc.meta.invoiceLock);
     console.log("fetched invoices for dialog", invoices);
          // Save for dialog
        //   setSelectedInvoiceFile({
        //     path: fullPath,
        //     name: fileName,
        //     meta: {
        //       ...meta,
        //       invoices, // Attach the full invoice objects here
        //     },
        //   });
  setSelectedInvoiceFile({
        _id: doc._id,
        name: doc.name,
        path: doc.path,
        invoices, // <-- flat invoices array
      });
    setInvoiceDialogOpen(true);
    return;
  }
    setSelectedDoc(doc);
    setOpenViewer(true);
  };

     const navigate = useNavigate();

    const handlePayInvoice = () => {
      if (!selectedInvoiceFile?.invoices?.length) return;

      navigate("/client/payinvoice", {
        state: {
          selectedInvoices: selectedInvoiceFile.invoices,
          accountName: accountName, // Replace with dynamic account name if available
        },
      });
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

      // ✅ Extract fileUrl from API response
      const fileUrl = res.data?.approval?.fileUrl;

      if (!fileUrl) {
        console.error("❌ fileUrl missing in approval response");
        return;
      }

      // ✅ Extract relative path after /uploads/accounts/
      const splitPath = fileUrl.split("/uploads/accounts/");
      if (splitPath.length < 2) {
        console.error("❌ Invalid fileUrl format:", fileUrl);
        return;
      }

      const originalPath = splitPath[1]; // FULL relative path
      console.log("📌 Original document path:", originalPath);

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

      fetchPendingApprovals(); // refresh list
    } catch (error) {
      console.error(`❌ Error performing ${action} approval:`, error);
      if (error.response) console.error("Response data:", error.response.data);
    }
  };
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
  const handleCancelClick = () => {
    setCancelDialogOpen(true);
  };

  const confirmCancel = () => {
    handleAction(selectedDoc.meta.approvalId, "cancel", cancelReason);
  };
  const handleCloseViewer = () => {
    setOpenViewer(false);
    setSelectedDoc(null);
  };
  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://www.snptaxes.com/api/accountsdoc/documents/pending-approvals?folderPath=${accountId}`
      );
      setDocuments(res.data.documents || []);
    } catch (err) {
      console.error("Failed to load pending approvals", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingApprovals();
  }, []);
  const FILE_BASE_URL = "https://snptaxes.com/uploads/accounts";
  return (
    <Box p={3}>
      {/* Header */}
      <Box mb={3} display="flex" alignItems="center" gap={1}>
        <Typography variant="h6" fontWeight={600}>
          Pending Approvals ({documents.length})
        </Typography>
       
      </Box>

      {/* Loading */}
      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

     

      {/* Cards */}
      <Grid container spacing={2}>
        {documents.map((doc, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              elevation={2}
              sx={{
                height: "100%",
                borderRadius: 2,
                transition: "0.2s",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
              onClick={() => handleOpenViewer(doc)}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <DescriptionIcon color="warning" />
                  <Typography variant="subtitle1" fontWeight={600} noWrap>
                    {doc.name}
                  </Typography>
                </Box>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

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
              {selectedDoc?.meta.name || "Document"}
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
              src={`${FILE_BASE_URL}/${selectedDoc.path}`}
              title={selectedDoc.name}
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
              onClick={() =>
                handleAction(selectedDoc.meta.approvalId, "approve")
              }
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
      <Dialog
  open={invoiceDialogOpen}
  onClose={() => setInvoiceDialogOpen(false)}
  fullWidth
  maxWidth="sm"
>
  <DialogTitle>Invoice Details</DialogTitle>

  <DialogContent>
    {selectedInvoiceFile?.invoices?.length ? (
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Invoice Number</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {selectedInvoiceFile.invoices.map((invoice) => (
            <TableRow key={invoice._id}>
              <TableCell>{invoice.invoicenumber}</TableCell>
              <TableCell>
                {invoice.description || "No description"}
              </TableCell>
              <TableCell align="right">
                ${invoice.summary?.total?.toFixed(2) || "0.00"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ) : (
      <Typography>No invoices available for this file.</Typography>
    )}
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setInvoiceDialogOpen(false)}>Close</Button>

    {selectedInvoiceFile?.invoices?.length > 0 && (
      <Button
        variant="contained"
        color="primary"
        onClick={handlePayInvoice}
      >
        Pay
      </Button>
    )}
  </DialogActions>
</Dialog>

    </Box>
  );
};

export default PendingApprovals;
