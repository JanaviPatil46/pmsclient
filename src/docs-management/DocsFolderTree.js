import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Typography,
  Box,
  Paper,
  IconButton,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DescriptionIcon from "@mui/icons-material/Description";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import FileUploadDrawer from "./drawers/FileUploadDrawer";
import CreteFolderDrawer from "./drawers/CreteFolderDrawer";
import FolderUploadDrawer from "./drawers/FolderUploadDrawer";
import RenameDrawer from "./drawers/RenameDrawer";
import MoveDrawer from "./drawers/MoveDrawer";
import {
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
} from "@mui/icons-material";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { Eye, PenTool, Stamp, Lock } from "lucide-react";
import {
  Folder as FolderClosedIcon,
  FolderOpen as FolderOpenIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import ParentFolderMenu from "./ParentFolderMenu";
import FolderMenu from "./FolderMenu";
import FileMenu from "./FileMenu";
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileAlt,
} from "react-icons/fa";
import axios from "axios";
import { AiFillFileUnknown } from "react-icons/ai";
import { DocusealForm } from "@docuseal/react";
import { toast } from "material-react-toastify";
import CancelIcon from "@mui/icons-material/Cancel";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";

const DocsFolderTree = () => {
  const [accountId, setAccountId] = useState(
    sessionStorage.getItem("accountId")
  );
  const SIGNATURE_API = process.env.REACT_APP_ESIGNATURE_API;
  console.log("acount id for the documentation", accountId);
  const [error, setError] = useState("");
  const FolderTreeView = ({ accountId }) => {
    const [clientEmail, setClientEmail] = useState(
      sessionStorage.getItem("email")
    ); // store client email
    console.log("folder structure of account is", accountId);
    const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
    const [selectedInvoiceFile, setSelectedInvoiceFile] = useState(null);

    const [expandedFolders, setExpandedFolders] = useState({});
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [selectedFolderForMenu, setSelectedFolderForMenu] = useState(null);
    const [newFolderDrawerOpen, setNewFolderDrawerOpen] = useState(null);
    const [folderUploaDrawerOpen, setFolderUploaDrawerOpen] = useState(null);
    const [renameDrawer, SetRenameDrawer] = useState(null);
    const [fileUploadDrawerOpen, setFileUploadDrawerOpen] = useState(null);
    const [moveDrawerOpen, setMoveDrawerOpen] = useState(null);

    const [folderTree, setFolderTree] = useState([]);
    // State for document approval dialog
    const [openViewer, setOpenViewer] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [adminUserId, setAdminUserId] = useState("");
    const [accountName, setAccountName] = useState("");

    // console.log("hgjhg",data)
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);

    // State for bulk operations
    const [bulkMoveDrawerOpen, setBulkMoveDrawerOpen] = useState(false);

    const [bulkOperationLoading, setBulkOperationLoading] = useState(false);

  

  const handleTrashClick = () => {
   navigate(`/client/trashDocs`);
  };

  
    // const getAllChildrenPaths = (item) => {
    //   const paths = [item.path];
    //   if (item.children && item.children.length > 0) {
    //     item.children.forEach((child) => {
    //       paths.push(...getAllChildrenPaths(child));
    //     });
    //   }
    //   return paths;
    // };
    const getAllChildrenPaths = (item) => {
      const paths = [];

      // ❌ Skip this item entirely if readOnly
      if (item.meta?.readOnly) return paths;

      paths.push(item.path);

      if (item.children && item.children.length > 0) {
        item.children.forEach((child) => {
          paths.push(...getAllChildrenPaths(child));
        });
      }

      return paths;
    };

    const handleSelectItem = (path) => {
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(path)) {
          newSet.delete(path);
        } else {
          newSet.add(path);
        }
        return newSet;
      });
    };
    // Update handleFolderSelect
    const handleFolderSelect = (item) => {
      const allChildPaths = getAllChildrenPaths(item);

      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        const allSelected = allChildPaths.every((path) => newSet.has(path));

        if (allSelected) {
          allChildPaths.forEach((path) => newSet.delete(path));
        } else {
          allChildPaths.forEach((path) => newSet.add(path));
        }
        return newSet;
      });
    };

    // Update isFolderPartiallySelected
    const isFolderPartiallySelected = (item) => {
      const allChildPaths = getAllChildrenPaths(item);
      const selectedCount = allChildPaths.filter((path) =>
        selectedItems.has(path)
      ).length;
      return selectedCount > 0 && selectedCount < allChildPaths.length;
    };
    // Update handleSelectAll
    const handleSelectAll = () => {
      if (selectAll) {
        setSelectedItems(new Set());
      } else {
        const allPaths = new Set();
        const collectPaths = (items) => {
          items.forEach((item) => {
            allPaths.add(item.path);
            if (item.children && item.children.length > 0) {
              collectPaths(item.children);
            }
          });
        };
        collectPaths(folderTree);
        setSelectedItems(allPaths);
      }
      setSelectAll(!selectAll);
    };

    const fetchAccountDetails = async () => {
      try {
        const res = await axios.get(
          `https://www.snptaxes.com/api/accounts/${accountId}`
        );
        // setAccount(res.data);
        console.log("result account", res.data);
        setAccountName(res.data.accountName);
        console.log("account name", res.data.accountName);
        setAdminUserId(res.data.adminUserId.email);
      } catch (error) {
        console.error("Error fetching account details:", error);
      }
    };

    useEffect(() => {
      // if (loginUserId) {
      fetchAccountDetails();
      // }
    }, [accountId]);
    // API call to fetch folder tree for a given template ID
    const fetchFolderTree = async (accountId) => {
      try {
        const res = await fetch(
          `https://www.snptaxes.com/api/accountsdoc/files/list/clientView?folderPath=${accountId}`
        );
        console.log("responce", res);
        const data = await res.json();
        console.log("janavi patil", data.contents);
        if (res.ok) {
          setFolderTree(data.contents);
          // Check for pending approval documents
          checkForPendingApprovals(data.contents);
        } else {
          setError("Failed to fetch folder tree");
        }
      } catch (err) {
        setError("Error fetching folder tree");
      }
    };
    // Function to check for pending approval documents in the folder tree
    const checkForPendingApprovals = (treeItems) => {
      const pendingApprovalFiles = [];

      const traverseTree = (items) => {
        items.forEach((item) => {
          const meta = item.meta || {};

          // Check if file has pendingApproval status and approvalId
          if (
            item.type === "file" &&
            meta.authStatus === "pendingApproval" &&
            meta.approvalId
          ) {
            // Construct file URL from the path
            const fileUrl = `https://www.snptaxes.com/uploads/accounts/${accountId}/${item.path}`;

            pendingApprovalFiles.push({
              _id: meta.approvalId,
              filename: item.name,
              fileUrl: fileUrl,
              description: meta.description || "",
              path: item.path,
            });
          }

          // Recursively check children
          if (item.children && item.children.length > 0) {
            traverseTree(item.children);
          }
        });
      };

      traverseTree(treeItems);

      // If pending approval files found, open the first one
      if (pendingApprovalFiles.length > 0) {
        console.log("Found pending approval documents:", pendingApprovalFiles);
        // You could show a notification or open the first document
        // handleOpenViewer(pendingApprovalFiles[0]);
      }

      return pendingApprovalFiles;
    };
    useEffect(() => {
      if (accountId) {
        fetchFolderTree(accountId);
      }
    }, [accountId]);

    const toggleFolder = (path, isReadOnly) => {
      if (isReadOnly) return;
      setExpandedFolders((prev) => ({
        ...prev,
        [path]: !prev[path],
      }));
    };

    const handleMenuOpen = (event, item) => {
      event.stopPropagation();
      setMenuAnchorEl(event.currentTarget);
      // setSelectedFolderForMenu(folder);
      // Check if it's the specific "Client Uploaded Documents" folder
      const isClientUploadedDocs =
        item.name?.toLowerCase() === "client uploaded documents";
      // Set the item with proper type information
      setSelectedFolderForMenu({
        ...item,
        isFile: item.type === "file",
        isFolder: item.type === "folder",
        // Check if it's a parent folder (root level)
        // isParent: !item.path.includes('/') && item.type === 'folder'
        isParent:
          (!item.path.includes("/") && item.type === "folder") ||
          isClientUploadedDocs,
      });
    };

    const handleMenuClose = () => {
      setMenuAnchorEl(null);
    };
    // Toggle read/unread
    const toggleReadStatus = (item) => {
      const newValue = !(item.meta?.readStatus || false);
      updateStatus(item, "readStatus", newValue);
      // console.log("kujaki janavi", item.path);
    };
    const SIGN_STATUSES = [
      "sendForSignature",
      "pendingSignature",
      "signatureCompleted",
    ];
    const APPROVAL_STATUSES = [
      "sendForApproval",
      "pendingApproval",
      "canceledApproval",
      "approvalCompleted",
    ];
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

        const body = {
          targetPath: item.path,
          status: {
            [statusType]: newValue, // dynamic key
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
          alert(data.message || "Status updated successfully");
          // fetchFolderTree(accountId); // refresh folder tree to reflect change
        } else {
          alert(data.error || "Failed to update status");
        }
      } catch (err) {
        console.error("Error updating status:", err);
        alert("Error updating status");
      }
    };

    const toggleReadOnly = async (item) => {
      try {
        const newStatus = !item.meta.readOnly;

        // 📍 Use correct backend endpoint
        const endpoint =
          item.type === "folder"
            ? "https://www.snptaxes.com/api/accountsdoc/folder/readonly"
            : "https://www.snptaxes.com/api/accountsdoc/file/readonly";

        const body =
          item.type === "folder"
            ? { folderPath: item.path, readOnly: newStatus }
            : { filePath: item.path, readOnly: newStatus };

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await res.json();

        if (res.ok) {
          fetchFolderTree(accountId);

          // 🗂️ Collapse folder if it’s locked
          if (item.type === "folder" && newStatus) {
            setExpandedFolders((prev) => {
              const updated = { ...prev };
              delete updated[item.path];
              return updated;
            });
          }

          handleMenuClose();
          alert(data.message || "Updated successfully");
        } else {
          alert("Error: " + data.error);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to update read-only status");
      }
    };
    const handleBulkDelete = async () => {
      if (selectedItems.size === 0) {
        toast.warning("Please select items to delete");
        return;
      }

      const confirmDelete = window.confirm(
        `Are you sure you want to delete ${selectedItems.size} item(s)? This cannot be undone!`
      );
      if (!confirmDelete) return;

      setBulkOperationLoading(true);
      try {
        const paths = Array.from(selectedItems);

        console.log("Deleting paths:", paths); // Debug log

        const response = await fetch(
          "https://www.snptaxes.com/api/accountsdoc/bulk-delete",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paths }),
          }
        );

        const data = await response.json();
        console.log("Bulk delete response:", data); // Debug log

        if (response.ok) {
          if (data.success) {
            toast.success(
              `${data.summary.success} item(s) deleted successfully`
            );
            if (data.errors && data.errors.length > 0) {
              toast.warning(`${data.errors.length} item(s) failed to delete`);
              console.log("Failed deletions:", data.errors);
            }
          } else {
            toast.error(data.message || "Failed to delete some items");
          }

          // Clear selection regardless of partial success
          setSelectedItems(new Set());
          fetchFolderTree(accountId);
        } else {
          toast.error(data.message || "Failed to delete items");
        }
      } catch (err) {
        console.error("Bulk delete error:", err);
        toast.error("Error deleting items: " + err.message);
      } finally {
        setBulkOperationLoading(false);
      }
    };

       // Bulk Trash
const handleBulkTrash = async () => {
  if (selectedItems.size === 0) {
    toast.warning("Please select items to move to trash");
    return;
  }

  const confirmTrash = window.confirm(
    `Are you sure you want to move ${selectedItems.size} item(s) to trash?`
  );
  if (!confirmTrash) return;

  setBulkOperationLoading(true);

  try {
    const paths = Array.from(selectedItems);

    console.log("Trashing paths:", paths); // Debug log

    const response = await fetch(
      "https://www.snptaxes.com/api/accountsdoc/bulktrash",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetPaths: paths ,trashedBy: "Client" }),
      }
    );

    const data = await response.json();
    console.log("Bulk trash response:", data); // Debug log

    if (response.ok) {
      if (data.success) {
        toast.success(
          `${data.trashedItems.length} item(s) moved to trash successfully`
        );

        if (data.failedItems && data.failedItems.length > 0) {
          toast.warning(`${data.failedItems.length} item(s) failed`);
          console.log("Failed trash items:", data.failedItems);
        }
      } else {
        toast.error(data.message || "Failed to trash some items");
      }

      // Clear selection regardless of partial success
      setSelectedItems(new Set());
      fetchFolderTree(accountId);
    } else {
      toast.error(data.message || "Failed to trash items");
    }
  } catch (err) {
    console.error("Bulk trash error:", err);
    toast.error("Error moving items to trash: " + err.message);
  } finally {
    setBulkOperationLoading(false);
  }
};
    const handleBulkDownload = async () => {
      if (selectedItems.size === 0) {
        toast.warning("Please select items to download");
        return;
      }

      setBulkOperationLoading(true);
      try {
        const paths = Array.from(selectedItems);
        const res = await fetch(
          "https://www.snptaxes.com/api/accountsdoc/download",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paths }),
          }
        );

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Download failed");
        }

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `selected_items_${new Date().getTime()}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        toast.success("Download started");
      } catch (err) {
        console.error("Bulk download error:", err);
        toast.error("Failed to download items");
      } finally {
        setBulkOperationLoading(false);
      }
    };
    // 🗑️ Delete File or Folder (Universal)
    const deleteItem = async (item) => {
      if (!item?.path) return alert("Invalid path");

      const confirmDelete = window.confirm(
        `Are you sure you want to delete "${item.name}"? This cannot be undone!`
      );
      if (!confirmDelete) return;

      try {
        const response = await fetch(
          "https://www.snptaxes.com/api/accountsdoc/delete",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ targetPath: item.path }),
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          alert(data.message);
          fetchFolderTree(accountId);
        } else {
          alert(data.message || "Failed to delete");
        }
      } catch (err) {
        console.error("Error deleting item:", err);
        alert("Error deleting file or folder");
      }

      handleMenuClose();
    };
    // 🗑️ Move File or Folder to Trash (Soft delete)
const trashItem = async (item) => {
  if (!item?.path) return alert("Invalid path");

  const confirmTrash = window.confirm(
    `Are you sure you want to move "${item.name}" to Trash?`
  );
  if (!confirmTrash) return;

  try {
    const response = await fetch(
      "https://www.snptaxes.com/api/accountsdoc/trash",
      {
        method: "PATCH", // ✅ trash = PATCH
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetPath: item.path, trashedBy: "Client" }),
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      toast.success(data.message || "Moved to trash");
      setTimeout(() => {
        fetchFolderTree(accountId); // refresh tree
      }, 500);
    } else {
      toast.error(data.message || "Failed to move to trash");
    }
  } catch (err) {
    console.error("Error trashing item:", err);
    toast.error("Error moving item to trash");
  }

  handleMenuClose();
};
    const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
    const targetEmail = sessionStorage.getItem("email");
    const [selectedSlug, setSelectedSlug] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    // Function to open the signature dialog
    const openSignatureDialog = (slug) => {
      setSelectedSlug(slug);
      setDialogOpen(true);
    };

    // Function to close the dialog
    const handleCloseDialog = () => {
      setDialogOpen(false);
      setSelectedSlug(null);
    };
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
    const navigate = useNavigate();

    const handlePayInvoice = () => {
      if (!selectedInvoiceFile?.meta?.invoices?.length) return;

      navigate("/client/payinvoice", {
        state: {
          selectedInvoices: selectedInvoiceFile.meta.invoices,
          accountName: accountName, // Replace with dynamic account name if available
        },
      });
    };
    const handleFileClick = async (fullPath, fileName, meta = {}) => {
      console.log("file clicked", fullPath, fileName, meta);
      try {
        if (
          meta.newTags?.some((tag) => tag.isSystemTag && tag.tagName === "New")
        ) {
          await fetch(
            "https://www.snptaxes.com/api/accountsdoc/remove-new-tag",
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ filePath: fullPath }),
            }
          );

          // 🔄 REFRESH folder tree so parent tags update
          await fetchFolderTree(accountId);
        }
        // 🔒 Handle locked invoices
        if (meta.invoiceLock?.length) {
          // Fetch full invoices by IDs
          const invoices = await fetchInvoicesByIds(meta.invoiceLock);

          if (!invoices.length) {
            alert("Failed to fetch invoice details.");
            return;
          }

          // Save for dialog
          setSelectedInvoiceFile({
            path: fullPath,
            name: fileName,
            meta: {
              ...meta,
              invoices, // Attach the full invoice objects here
            },
          });

          setInvoiceDialogOpen(true);
          return;
        }
        // Check if this is a pending approval document
        if (meta.authStatus === "pendingApproval" && meta.approvalId) {
          fetApprovalDetails(meta.approvalId);
          return;
        }

        // Check if this is a pending e-signature document
        if (meta.esignRequestId && meta.signStatus === "pendingSignature") {
          try {
            const response = await fetch(
              `https://www.snptaxes.com/signature/byid/${meta.esignRequestId}`,
              {
                method: "GET",
                redirect: "follow",
              }
            );
            const result = await response.json();
            console.log("Signature details:", result);

            // Assuming result is the full submission object
            const submission = result;
            console.log("Full Submission:", submission);

            // Check if submission has submitters array
            if (
              !submission.submitters ||
              !Array.isArray(submission.submitters)
            ) {
              console.error("No submitters array found in response");
              alert("Error loading signature request: Invalid data structure");
              return;
            }

            // Find matching submitters for the current user
            const matchingSubmitters = submission.submitters
              .map((s) => ({
                slug: s.slug,
                email: s.email,
                submissionId: s.submission_id,
                templateName: s.name,
                createdAt: submission.createdAt,
                fileUrl: submission.fileUrl,
                externalId: submission.externalId,
                submissionData: submission,
                status: s.status,
                completed_at: s.completed_at,
                role: s.role,
                allCompleted: submission.submitters.every(
                  (submitter) =>
                    submitter.status === "completed" ||
                    submitter.completed_at !== null
                ),
              }))
              .filter((s) => s.email === targetEmail && !s.completed_at);

            console.log("Matching Submitters:", matchingSubmitters);

            // If we found matching submitters, open the dialog with the first one
            if (matchingSubmitters.length > 0) {
              // Get the first matching submitter's slug
              const firstSlug = matchingSubmitters[0].slug;
              console.log("Opening signature dialog with slug:", firstSlug);
              openSignatureDialog(firstSlug);
            } else {
              // Check why no matches were found
              const userSubmitters = submission.submitters.filter(
                (s) => s.email === targetEmail
              );
              if (userSubmitters.length > 0) {
                // User exists but has already completed
                const completedSubmitter = userSubmitters[0];
                if (completedSubmitter.completed_at) {
                  alert("You have already signed this document.");
                  // Open the document after alert
                  setTimeout(() => {
                    openDocument(fullPath, fileName);
                  }, 500);
                } else {
                  alert(
                    "You are not authorized to sign this document at this time."
                  );
                }
              } else {
                alert("You are not listed as a signer for this document.");
              }
            }
          } catch (error) {
            console.error("Error fetching signature details:", error);
            alert("Error loading signature request.");
          }
          return;
        }

        // 🔒 Prevent opening locked files
        if (meta.readOnly) {
          alert("This file is locked and cannot be opened.");
          return;
        }

        // ✅ Open the document (for non-signature files or if user has already signed)
        openDocument(fullPath, fileName);
      } catch (error) {
        console.error("Error opening/downloading file:", error);
      }
    };

    // Helper function to open/download document
    const openDocument = (fullPath, fileName) => {
      try {
        // ✅ Construct full file URL
        const fileUrl = `https://www.snptaxes.com/uploads/accounts/${fullPath}`;
        console.log("Opening document:", fileUrl);

        // ✅ Detect file extension (case-insensitive)
        const fileExt = fileName.split(".").pop().toLowerCase();

        // ✅ Extensions that can open in browser
        const viewableExtensions = ["pdf", "jpg", "jpeg", "png", "gif", "txt"];

        if (viewableExtensions.includes(fileExt)) {
          // Open supported file types in a new tab
          window.open(fileUrl, "_blank", "noopener,noreferrer");
        } else {
          // Force download for unsupported types (e.g., docx, xlsx, zip, etc.)
          const link = document.createElement("a");
          link.href = fileUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (error) {
        console.error("Error opening document:", error);
        alert("Error opening document. Please try again.");
      }
    };

    const fetApprovalDetails = async (id) => {
      try {
        const response = await fetch(
          `https://www.snptaxes.com/approvals/approvals/${id}`,
          {
            method: "GET",
            redirect: "follow",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch approval");
        }

        const data = await response.json();
        console.log("Approval Data:", data);
        // return data;
        setSelectedDoc(data.approval);
        setOpenViewer(true);
      } catch (error) {
        console.error("Error fetching approval:", error);
        return null;
      }
    };

    // Function to handle approval actions
    const handleApprovalAction = async (id, action, reason = "") => {
      try {
        console.log("Sending approval request:", {
          id,
          action,
          description: reason,
          accountId,
          adminUserId,
        });

        // This is your existing approval endpoint
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

        // Refresh the folder tree to update status
        fetchFolderTree(accountId);
      } catch (error) {
        console.error(`❌ Error performing ${action} approval:`, error);
        if (error.response)
          console.error("Response data:", error.response.data);
      }
    };

    const handleCloseViewer = () => {
      setOpenViewer(false);
      setSelectedDoc(null);
    };

    const handleCancelClick = () => {
      setCancelDialogOpen(true);
    };

    const confirmCancel = () => {
      if (selectedDoc) {
        handleApprovalAction(selectedDoc._id, "cancel", cancelReason);
      }
    };
    const getFileIcon = (fileName) => {
      const ext = fileName.split(".").pop().toLowerCase();

      switch (ext) {
        case "pdf":
          return <FaFilePdf color="#d32f2f" size={18} />;
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
          return <FaFileImage color="#1976d2" size={18} />;
        case "doc":
        case "docx":
          return <FaFileWord color="#1565c0" size={18} />;
        case "xls":
        case "xlsx":
          return <FaFileExcel color="#2e7d32" size={18} />;
        case "txt":
        case "md":
          return <FaFileAlt color="#616161" size={18} />;
        default:
          return <AiFillFileUnknown color="#757575" size={18} />;
      }
    };
    const INVOICE_LOCK_STATUSES = ["pendingpayment", "paymentcompleted"];

    const invoiceStatusTextMap = {
      pendingpayment: "Pending Payment",
      paymentcompleted: "Payment Completed",
    };
    const approvalStatusTextMap = {
      sendForApproval: "Send for Approval",
      pendingApproval: "Waiting for Approval",
      canceledApproval: "canceledApproval",
      approvalCompleted: "Approval Completed",
    };
    const statusTextMap = {
      sendForSignature: "Send for Sign",
      pendingSignature: "Waiting for Signature",
      signatureCompleted: "Signature Received",
    };

    const formatUploadedAt = (dateValue) => {
      if (!dateValue) return "";

      // If already in "DEC-19 2025" format
      if (
        typeof dateValue === "string" &&
        /^[A-Z]{3}-\d{2} \d{4}$/.test(dateValue)
      ) {
        return dateValue;
      }

      const date = new Date(dateValue);
      if (isNaN(date)) return dateValue;

      return date
        .toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
        .toUpperCase()
        .replace(",", "") // remove comma
        .replace(" ", "-"); // replace first space with dash
    };

    const UploadedInfo = ({ meta }) => {
      if (!meta?.uploadedAt) return null;

      return (
        <Typography variant="caption" sx={{ fontWeight: "bold" }}>
          {formatUploadedAt(meta.uploadedAt)}
        </Typography>
      );
    };
    //     const UploadedInfo = ({ meta }) => {
    //   if (!meta) return null;

    //   return (
    //     <Typography variant="caption" sx={{ fontWeight: "bold" }}>
    //       {meta.uploadedAt}
    //     </Typography>
    //   );
    // };
    const getStatusChip = (meta, isFolder) => {
      // Return null for folders - don't show status chips for folders
      if (isFolder) return null;

      const chips = [];

      // ======= SIGNATURE STATUS =======
      if (SIGN_STATUSES.includes(meta.signStatus)) {
        let color = "default";

        if (meta.signStatus === "pendingSignature") color = "warning";
        if (meta.signStatus === "signatureCompleted") color = "success";

        chips.push(
          <Chip
            key="signChip"
            label={statusTextMap[meta.signStatus]}
            size="small"
            variant="outlined"
            color={color}
          />
        );
      }

      // ======= APPROVAL STATUS =======
      if (APPROVAL_STATUSES.includes(meta.authStatus)) {
        let color = "default";
        let chip;

        if (meta.authStatus === "pendingApproval") color = "warning";
        if (meta.authStatus === "approvalCompleted") color = "success";
        if (meta.authStatus === "canceledApproval") color = "error";

        if (meta.authStatus === "canceledApproval" && meta.cancelReason) {
          chip = (
            <Tooltip title={meta.cancelReason} placement="top-end">
              <Chip
                key="approvalCanceledChip"
                label="Approval Canceled"
                size="small"
                variant="outlined"
                color="error"
                sx={{ cursor: "pointer" }}
              />
            </Tooltip>
          );
        } else {
          chip = (
            <Chip
              key="approvalChip"
              label={approvalStatusTextMap[meta.authStatus]}
              size="small"
              variant="outlined"
              color={color}
            />
          );
        }

        chips.push(chip);
      }

      // ======= INVOICE LOCK STATUS =======
      if (INVOICE_LOCK_STATUSES.includes(meta.lockInvoiceStatus)) {
        let color = "default";
        if (meta.lockInvoiceStatus === "pendingpayment") color = "warning";
        if (meta.lockInvoiceStatus === "paymentcompleted") color = "success";

        chips.push(
          <Chip
            key="invoiceLockChip"
            label={invoiceStatusTextMap[meta.lockInvoiceStatus]}
            size="small"
            variant="outlined"
            color={color}
          />
        );
      }

      // ======= SHOW NOTHING IF NO STATUS =======
      if (chips.length === 0) return null;

      return <Box sx={{ display: "flex", gap: 1 }}>{chips}</Box>;
    };
    const findNewSystemTag = (item) => {
      console.log("Finding 'New' tag in item:", item);
      // Check current item
      const newTag = item.meta?.newTags?.find(
        (tag) => tag.isSystemTag && tag.tagName === "New"
      );

      if (newTag) return newTag;

      // Check children recursively
      if (item.children && item.children.length > 0) {
        for (const child of item.children) {
          const childTag = findNewSystemTag(child);
          if (childTag) return childTag;
        }
      }

      return null;
    };
    const renderTableRows = (
      items,
      level = 0,
      parentPath = "",
      isInsideRestricted = false
    ) => {
      return items.map((item) => {
        console.log("itemlist", item);
        // const fullPath = parentPath ? `${parentPath}/${item.name}` : item.name;
        const fullPath = item.path;
        const meta = item.meta || {};
        const isFolder = item.type === "folder";
        const isSelected = selectedItems.has(fullPath);

        const restrictedFolderName = "firm documents shared with client";

        const isRootFolder = level === 0 && isFolder;

        const isFirmDocsRoot =
          isRootFolder &&
          item.name?.toLowerCase() === restrictedFolderName.toLowerCase();

        const insideRestricted = isInsideRestricted || isFirmDocsRoot;

        // same meaning as renderTree
        const hideMenu = insideRestricted;
        // Update the helper function to use item.path for children
        const getAllChildrenPaths = (item) => {
          const paths = [item.path];
          if (item.children && item.children.length > 0) {
            item.children.forEach((child) => {
              paths.push(...getAllChildrenPaths(child));
            });
          }
          return paths;
        };

        // Update isFolderPartiallySelected to use item.path
        const isPartiallySelected = isFolder
          ? isFolderPartiallySelected(item)
          : false;
        const handleSafeFileClick = () => {
          if (meta.readOnly) {
            alert("This file is locked and cannot be opened.");
            return;
          }
          if (!isFolder) {
            handleFileClick(fullPath, item.name, meta);
          }
        };
        const inheritedNewTag = isFolder ? findNewSystemTag(item) : null;
        return (
          <React.Fragment key={fullPath}>
            <TableRow
              className={isFolder ? "folder-row" : ""}
              sx={{
                bgcolor: isSelected ? "#b2d8ff" : "transparent",
                borderRadius: 1,
                mb: 0.5,
                cursor: item.meta?.readOnly ? "not-allowed" : "pointer",

                "&:hover": {
                  bgcolor: "#b2d8ff",
                },
              }}
            >
              {/* Checkbox Column - Only checkboxes here */}
              <TableCell sx={{ width: "50px", paddingLeft: 2 }}>
                {isFolder ? (
                  <Checkbox
                    size="small"
                    checked={isSelected}
                    indeterminate={isPartiallySelected}
                    // onChange={() => handleFolderSelect(item)}
                    // disabled={insideRestricted} // ✅ disable
                    disabled={insideRestricted || meta.readOnly}
                    onChange={() => {
                      if (insideRestricted || meta.readOnly) return; // ✅ block selection
                      handleFolderSelect(item);
                    }}
                  />
                ) : (
                  <Checkbox
                    size="small"
                    checked={isSelected}
                    // onChange={() => handleSelectItem(fullPath)}
                    disabled={insideRestricted || meta.readOnly} // ✅ disable
                    onChange={() => {
                      if (insideRestricted || meta.readOnly) return; // ✅ block selection
                      handleSelectItem(fullPath);
                    }}
                  />
                )}
              </TableCell>

              {/* Name Column with indentation */}
              <TableCell sx={{ paddingLeft: level * 4 + 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {isFolder ? (
                    <>
                      <IconButton
                        size="small"
                        onClick={() => toggleFolder(fullPath, meta.readOnly)}
                        disabled={meta.readOnly}
                        sx={{ mr: 0.5 }}
                      >
                        {expandedFolders[fullPath] ? (
                          <FolderOpenIcon color="#1976d2" />
                        ) : (
                          <FolderClosedIcon color="#757575" />
                        )}
                      </IconButton>
                      <Typography
                        variant="body2"
                        sx={{
                          ml: 0.5,
                          fontWeight: "medium",
                          color: meta.readOnly ? "#999" : "inherit",
                          cursor: "pointer",
                        }}
                        onClick={() => toggleFolder(fullPath, meta.readOnly)}
                      >
                        {item.name}
                        {inheritedNewTag && (
                          <Chip
                            label={inheritedNewTag.tagName}
                            size="small"
                            color="success"
                            sx={{
                              backgroundColor: inheritedNewTag.tagColour,
                              // color: "#fff",
                              height: 18,
                              fontSize: "0.7rem",
                              ml: 0.8,
                            }}
                          />
                        )}
                        {meta.readOnly && (
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{ color: "error.main", ml: 1 }}
                          >
                            (Locked)
                          </Typography>
                        )}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Box sx={{ mr: 1 }}>{getFileIcon(item.name)}</Box>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: meta.readOnly ? "#999" : "#1976d2",
                            textDecoration: meta.readOnly
                              ? "none"
                              : "underline",
                            cursor: meta.readOnly ? "not-allowed" : "pointer",
                          }}
                          onClick={handleSafeFileClick}
                        >
                          {item.name}
                          {meta.newTags?.map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag.tagName}
                              size="small"
                              color="success"
                              sx={{
                                backgroundColor: tag.tagColour,
                                // color: "#fff",
                                height: 18,
                                fontSize: "0.7rem",
                                ml: 2,
                              }}
                            />
                          ))}
                        </Typography>

                        {/* Status chips for files only */}
                      </Box>
                    </>
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ mt: 0.5 }}>{getStatusChip(meta, isFolder)}</Box>
              </TableCell>

              {/* Last Modified Column */}
              <TableCell>
                <UploadedInfo meta={meta} />
              </TableCell>
              <TableCell>
                <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                  {meta.uploadedBy}
                </Typography>
              </TableCell>

              <TableCell align="right">
                {!hideMenu && (
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, { ...item, fullPath })}
                  >
                    <MoreVertIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>

            {/* Render children if folder is expanded */}
            {isFolder &&
              expandedFolders[fullPath] &&
              item.children &&
              item.children.length > 0 &&
              renderTableRows(
                item.children,
                level + 1,
                fullPath,
                insideRestricted
              )}
          </React.Fragment>
        );
      });
    };

    return (
      <Box sx={{ margin: "auto", p: 3 }}>
        {/* Action Buttons */}
        <Box sx={{ p: 3, maxWidth: "1000px", mx: "auto" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
              maxWidth: "600px",
              width: "100%",
              mx: "auto",
              my: 3,
            }}
          >
            <Button
              // variant="contained"
              fullWidth
              startIcon={<FolderIcon />}
              onClick={() => {
                setNewFolderDrawerOpen(true);
                handleMenuClose();
              }}
              color="primary"
              sx={{
                backgroundColor: "text.menu",
                color: "primary.contrastText",
                "&:hover": {
                  backgroundColor: "menu.dark",
                  boxShadow: 1,
                },
                transition: "background-color 0.2s ease",
              }}
            >
              Create Folder
            </Button>

            <Button
              // variant="contained"
              fullWidth
              startIcon={<UploadFileIcon />}
              onClick={() => setFileUploadDrawerOpen(true)}
              color="primary"
              sx={{
                backgroundColor: "text.menu",
                color: "primary.contrastText",
                "&:hover": {
                  backgroundColor: "menu.dark",
                  boxShadow: 1,
                },
                transition: "background-color 0.2s ease",
              }}
            >
              Upload File
            </Button>

            <Button
              // variant="contained"
              fullWidth
              startIcon={<DriveFolderUploadIcon />}
              onClick={() => setFolderUploaDrawerOpen(true)}
              color="primary"
              sx={{
                backgroundColor: "text.menu",
                color: "primary.contrastText",
                "&:hover": {
                  backgroundColor: "menu.dark",
                  boxShadow: 1,
                },
                transition: "background-color 0.2s ease",
              }}
            >
              Upload Folder
            </Button>

              <Button
            fullWidth
            startIcon={<DeleteIcon />}
            onClick={handleTrashClick}
            color="error"
            sx={{
              backgroundColor: "error.main",
              color: "white",
              "&:hover": {
                backgroundColor: "error.dark",
                boxShadow: 1,
              },
              transition: "background-color 0.2s ease",
            }}
          >
            View Trash
          </Button>
          </Box>

          {selectedItems.size > 0 && (
            <Paper
              elevation={2}
              sx={{
                p: 2,
                mb: 3,
                // bgcolor: "#e3f2fd",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {selectedItems.size} item(s) selected
              </Typography>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {/* <Button
                  variant="contained"
                  size="small"
                  startIcon={<DriveFileMoveIcon />}
                  onClick={() => setBulkMoveDrawerOpen(true)}
                  disabled={bulkOperationLoading}
                >
                  Move
                </Button>
                
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<LockIcon />}
                  onClick={() => setBulkLockDialogOpen(true)}
                  disabled={bulkOperationLoading}
                >
                  Lock/Unlock
                </Button> */}
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<DriveFileMoveIcon />}
                  onClick={() => setBulkMoveDrawerOpen(true)}
                  disabled={bulkOperationLoading}
                >
                  Move
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={handleBulkTrash}
                  disabled={bulkOperationLoading}
                >
                  Delete
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={handleBulkDownload}
                  disabled={bulkOperationLoading}
                >
                  Download
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setSelectedItems(new Set())}
                  disabled={bulkOperationLoading}
                >
                  Clear Selection
                </Button>
              </Box>
            </Paper>
          )}

          {/* Drawers */}
          <FileUploadDrawer
            isOpen={fileUploadDrawerOpen}
            onClose={() => setFileUploadDrawerOpen(false)}
            folderTree={folderTree}
            fetchFolderTree={() => fetchFolderTree(accountId)}
            selectedFolderForMenu={selectedFolderForMenu}
          />

          <CreteFolderDrawer
            isOpen={newFolderDrawerOpen}
            onClose={() => {
              setNewFolderDrawerOpen(false);
            }}
            accountId={accountId}
            folderTree={folderTree}
            fetchFolderTree={() => fetchFolderTree(accountId)}
            selectedFolderForMenu={selectedFolderForMenu}
          />

          <FolderUploadDrawer
            isOpen={folderUploaDrawerOpen}
            onClose={() => setFolderUploaDrawerOpen(false)}
            folderTree={folderTree}
            fetchFolderTree={() => fetchFolderTree(accountId)}
            selectedFolderForMenu={selectedFolderForMenu}
          />

          <MoveDrawer
            isOpen={moveDrawerOpen}
            onClose={() => {
              setMoveDrawerOpen(false);
            }}
            folderTree={folderTree}
            fetchFolderTree={() => fetchFolderTree(accountId)}
            selectedFolderForMenu={selectedFolderForMenu}
          />

          <RenameDrawer
            isOpen={renameDrawer}
            onClose={() => {
              SetRenameDrawer(false);
            }}
            folderTree={folderTree}
            fetchFolderTree={() => fetchFolderTree(accountId)}
            selectedFolderForMenu={selectedFolderForMenu}
          />

          <MoveDrawer
            isOpen={bulkMoveDrawerOpen}
            onClose={() => setBulkMoveDrawerOpen(false)}
            folderTree={folderTree}
            fetchFolderTree={fetchFolderTree}
            // Bulk mode props
            isBulkOperation={true}
            selectedPaths={Array.from(selectedItems)} // Array of selected paths
            onMoveComplete={(targetPath) => {
              // Optional callback after successful move
              console.log("Bulk move completed to:", targetPath);
              setSelectedItems(new Set()); // Clear selection
            }}
          />
        </Box>
        {openViewer && (
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
                <DescriptionIcon fontSize="small" sx={{ color: "#f0c000" }} />
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, flexGrow: 1 }}
                  noWrap
                >
                  {selectedDoc?.filename || "Document"}
                </Typography>

                {selectedDoc?.description && (
                  <Tooltip
                    title={selectedDoc.description}
                    arrow
                    placement="right"
                  >
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
                  onClick={() =>
                    handleApprovalAction(selectedDoc._id, "approve")
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
        )}

        {/* Cancel Reason Dialog */}
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
          open={dialogOpen}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="lg"
        >
          <DialogTitle>
            Signing Form
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            {selectedSlug && (
              <DocusealForm
                src={`https://docuseal.com/s/${selectedSlug}`}
                email={targetEmail}
                onComplete={async (data) => {
                  console.log("Post-sign data:", data);

                  try {
                    // 1️⃣ Update this specific submitter's status and replace document
                    const updateSubmitterRes = await fetch(
                      `${SIGNATURE_API}/signautrelist/update-submitter/${data.template.external_id}`,
                      {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          submitterEmail: targetEmail,
                          submissionId: data.submission_id,
                        }),
                      }
                    );

                    const updateData = await updateSubmitterRes.json();

                    if (updateData.success) {
                      console.log("✅ Document replaced with latest signature");

                      // 2️⃣ Check if ALL submitters have now completed
                      if (updateData.allCompleted) {
                        console.log(
                          "🎉 All submitters have completed signing!"
                        );

                        // Extract parent folder path
                        const fullPath = decodeURIComponent(
                          updateData.esignRecord.fileUrl.split(
                            "/uploads/accounts/"
                          )[1]
                        );
                        console.log("Full file path:", fullPath);
                        const parentFolderPath = fullPath
                          .split("/")
                          .slice(0, -1)
                          .join("/");
                        console.log("Parent folder path:", parentFolderPath);
                        // 3️⃣ Update the final status only when ALL have signed
                        await updateStatus(
                          { path: fullPath },
                          "signStatus",
                          "signatureCompleted"
                        );

                        // 4️⃣ Notify admin
                        await fetch(`${SIGNATURE_API}/notify-admin`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            clientName: targetEmail,
                            documentName: selectedSlug,
                            message: "All parties have completed signing",
                          }),
                        });

                        alert(
                          "All signatures completed! Document has been fully executed."
                        );
                      } else {
                        console.log(
                          `✅ You have signed. Document updated. Waiting for ${updateData.pendingCount} more signer(s).`
                        );
                        alert(
                          `Thank you for signing! Document has been updated. Waiting for ${updateData.pendingCount} more signer(s) to complete.`
                        );
                      }
                    } else {
                      alert("Error updating signature status.");
                    }
                  } catch (err) {
                    console.error("Error handling post-sign actions", err);
                    alert("Error while updating sign status.");
                  }

                  handleCloseDialog();
                  // Refresh the data
                  // window.location.reload();
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={invoiceDialogOpen}
          onClose={() => setInvoiceDialogOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Invoice Details</DialogTitle>
          <DialogContent>
            {selectedInvoiceFile?.meta?.invoices?.length ? (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Invoice Number</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedInvoiceFile.meta.invoices.map((invoice) => (
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
            {selectedInvoiceFile?.meta?.invoices?.length > 0 && (
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

        {/* Folder Explorer */}
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            📜 Folder Explorer
          </Typography>
          {/* {folderTree ? (
            renderTree(folderTree)
          ) : (
            <Typography>Loading folder data...</Typography>
          )} */}
          {folderTree && folderTree.length > 0 ? (
            <>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: "50px" }}>
                        {/* <Checkbox
                          checked={selectAll}
                          indeterminate={selectedItems.size > 0 && !selectAll}
                          onChange={handleSelectAll}
                        /> */}
                      </TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Uploaded</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{renderTableRows(folderTree)}</TableBody>
                </Table>
              </TableContainer>

              {/* Selected Items Summary */}
              {selectedItems.size > 0 && (
                <Paper elevation={1} sx={{ p: 2, mt: 2 }}>
                  <Typography variant="subtitle1">
                    {selectedItems.size} item(s) selected
                  </Typography>
                </Paper>
              )}
            </>
          ) : (
            <Typography sx={{ p: 2, textAlign: "center" }}>
              Loading folder data...
            </Typography>
          )}
        </Paper>

        {selectedFolderForMenu ? (
          selectedFolderForMenu.isParent ? (
            // 📁 Parent Folder Menu
            <ParentFolderMenu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
              onCreateFolder={() => setNewFolderDrawerOpen(true)}
            />
          ) : selectedFolderForMenu.isFile ? (
            // 📄 File Menu
            <FileMenu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
              selectedItem={selectedFolderForMenu}
              onRename={() => SetRenameDrawer(true)}
              onMove={() => setMoveDrawerOpen(true)}
              accId={accountId}
              onToggleReadStatus={toggleReadStatus}
              onToggleReadOnly={toggleReadOnly}
              onDelete={trashItem}
              onDownload={handleFileClick}
            />
          ) : (
            // 📂 Child Folder Menu
            <FolderMenu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
              selectedItem={selectedFolderForMenu}
              onCreateFolder={() => setNewFolderDrawerOpen(true)}
              onUploadFile={() => setFileUploadDrawerOpen(true)}
              onUploadFolder={() => setFolderUploaDrawerOpen(true)}
              onRename={() => SetRenameDrawer(true)}
              onMove={() => setMoveDrawerOpen(true)}
              onToggleReadStatus={toggleReadStatus}
              onToggleReadOnly={toggleReadOnly}
              onDelete={trashItem}
            />
          )
        ) : null}
      </Box>
    );
  };
  return (
    <Box sx={{ p: 3 }}>
      <FolderTreeView accountId={accountId} />
    </Box>
  );
};

export default DocsFolderTree;

// const renderTree = (
//   items,
//   level = 0,
//   parentPath = "",
//   isInsideRestricted = false
// ) => {
//   const getStatusChip = (meta) => {
//     const chips = [];

//     // ======= SIGNATURE STATUS =======
//     if (SIGN_STATUSES.includes(meta.signStatus)) {
//       let color = "default";

//       if (meta.signStatus === "pendingSignature") color = "warning";
//       if (meta.signStatus === "signatureCompleted") color = "success";

//       chips.push(
//         <Chip
//           key="signChip"
//           label={statusTextMap[meta.signStatus]}
//           size="small"
//           variant="outlined"
//           color={color}
//         />
//       );
//     }

//     // ======= APPROVAL STATUS =======
//     if (APPROVAL_STATUSES.includes(meta.authStatus)) {
//       let color = "default";
//       let chip = (
//         <Chip
//           key="approvalChip"
//           label={approvalStatusTextMap[meta.authStatus]}
//           size="small"
//           variant="outlined"
//           color={color}
//         />
//       );

//       if (meta.authStatus === "pendingApproval") color = "warning";
//       if (meta.authStatus === "approvalCompleted") color = "success";
//       if (meta.authStatus === "canceledApproval") color = "error";

//       // Handle tooltip only for canceled approval
//       if (meta.authStatus === "canceledApproval" && meta.cancelReason) {
//         chip = (
//           <Tooltip title={meta.cancelReason} placement="top-end">
//             <Chip
//               key="approvalCanceledChip"
//               label="Approval Canceled"
//               size="small"
//               variant="outlined"
//               color="error"
//               sx={{ cursor: "pointer" }}
//             />
//           </Tooltip>
//         );
//       } else {
//         chip = (
//           <Chip
//             key="approvalChip"
//             label={approvalStatusTextMap[meta.authStatus]}
//             size="small"
//             variant="outlined"
//             color={color}
//           />
//         );
//       }

//       chips.push(chip);
//     }
//     // ⭐ NEW — INVOICE LOCK STATUS
//     if (INVOICE_LOCK_STATUSES.includes(meta.lockInvoiceStatus)) {
//       let color = "default";
//       if (meta.lockInvoiceStatus === "pendingpayment") color = "warning";
//       if (meta.lockInvoiceStatus === "paymentcompleted") color = "success";

//       chips.push(
//         <Chip
//           key="invoiceLockChip"
//           label={invoiceStatusTextMap[meta.lockInvoiceStatus]}
//           size="small"
//           variant="outlined"
//           color={color}
//         />
//       );
//     }
//     // ======= SHOW NOTHING IF NO STATUS =======
//     if (chips.length === 0) return null;

//     return <Box sx={{ display: "flex", gap: 1, ml: 1 }}>{chips}</Box>;
//   };

//   return (
//     <Box component="ul" sx={{ listStyle: "none", pl: level * 2, mb: 1 }}>
//       {items.map((item) => {
//         const fullPath = parentPath
//           ? `${parentPath}/${item.name}`
//           : item.name;
//         const meta = item.meta || {};

//         const isFolder = item.type === "folder";
//         const isFile = item.type === "file";
//         const isRootFolder = level === 0 && isFolder;

//         // Restricted folder name
//         const restrictedFolderName = "firm documents shared with client";

//         // Check if this is the restricted root folder
//         const isFirmDocsRoot =
//           isRootFolder &&
//           item.name?.toLowerCase() === restrictedFolderName.toLowerCase();

//         // Track whether we are inside restricted area
//         const insideRestricted = isInsideRestricted || isFirmDocsRoot;

//         const hideMenu = insideRestricted;

//         const getColor = (status) => (status ? "#1976d2" : "#9e9e9e");

//         const StatusIcons = () => (
//           <Box
//             sx={{ display: "flex", gap: 1, alignItems: "center", ml: 1 }}
//           >
//             <Eye size={16} color={getColor(meta.readStatus)} />

//             <Lock size={16} color={meta.readOnly ? "#e53935" : "#9e9e9e"} />
//           </Box>
//         );

//         const handleSafeFileClick = () => {
//           if (meta.readOnly) {
//             alert("This file is locked and cannot be opened.");
//             return;
//           }
//           handleFileClick(fullPath, item.name, meta);
//         };

//         return (
//           <li key={fullPath} style={{ marginBottom: 8 }}>
//             {isFolder ? (
//               <Box
//                 sx={{
//                   p: 1,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   borderRadius: 2,
//                   cursor: "pointer",
//                   backgroundColor: isRootFolder ? "#f0f7ff" : "#fff",
//                   color: "black",
//                   "&:hover": { backgroundColor: "#f5f5f5", color: "black" },
//                   transition: "background-color 0.2s ease-in-out",
//                 }}
//                 onClick={() => toggleFolder(fullPath, meta.readOnly)}
//               >
//                 <Box
//                   display="flex"
//                   alignItems="center"
//                   sx={{ flexGrow: 1, gap: 1 }}
//                 >
//                   {expandedFolders[fullPath] ? (
//                     <FolderOpenIcon color="#1976d2" size={18} />
//                   ) : (
//                     <FolderClosedIcon color="#757575" size={18} />
//                   )}

//                   <Typography
//                     variant="body1"
//                     fontWeight="medium"
//                     sx={{ wordBreak: "break-word" }}
//                   >
//                     {item.name}

//                     {meta.readOnly && (
//                       <Typography
//                         variant="caption"
//                         sx={{ color: "red", fontWeight: "bold", ml: 1 }}
//                       >
//                         (Locked)
//                       </Typography>
//                     )}
//                   </Typography>
//                 </Box>

//                 {!hideMenu && (
//                   <IconButton
//                     size="small"
//                     onClick={(e) =>
//                       handleMenuOpen(e, {
//                         ...item,
//                         fullPath,
//                         isFolder: true,
//                       })
//                     }
//                   >
//                     <MoreVertIcon size={16} />
//                   </IconButton>
//                 )}
//               </Box>
//             ) : (
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   pl: 4,
//                   mb: 1,
//                   borderRadius: 2,
//                   "&:hover .file-menu-icon": { opacity: 1 },
//                 }}
//               >
//                 <Box sx={{ mr: 1 }}>{getFileIcon(item.name)}</Box>

//                 <Typography
//                   variant="body2"
//                   sx={{
//                     flex: 1,
//                     wordBreak: "break-word",
//                     color: meta.readOnly ? "#999" : "#1976d2",
//                     textDecoration: meta.readOnly ? "none" : "underline",
//                     cursor: meta.readOnly ? "not-allowed" : "pointer",
//                   }}
//                   onClick={handleSafeFileClick}
//                 >
//                   {item.name}
//                 </Typography>
//                 <Box>{getStatusChip(meta)}</Box>

//                 {!insideRestricted && <StatusIcons />}

//                 {!hideMenu && (
//                   <Box
//                     className="file-menu-icon"
//                     sx={{
//                       width: 8,
//                       height: 8,
//                       borderRadius: "50%",
//                       backgroundColor: "#1976d2",
//                       opacity: 0,
//                       transition: "opacity 0.2s",
//                       cursor: "pointer",
//                       mr: 1,
//                       ml: 1,
//                     }}
//                     onClick={(e) =>
//                       handleMenuOpen(e, { ...item, fullPath, isFile: true })
//                     }
//                   />
//                 )}
//               </Box>
//             )}

//             {expandedFolders[fullPath] &&
//               item.children &&
//               item.children.length > 0 && (
//                 <Box
//                   sx={{
//                     ml: 2,
//                     mt: 1,
//                     borderLeft: "2px dashed #ccc",
//                     pl: 2,
//                   }}
//                 >
//                   {renderTree(
//                     item.children,
//                     level + 1,
//                     fullPath,
//                     insideRestricted
//                   )}
//                 </Box>
//               )}
//           </li>
//         );
//       })}
//     </Box>
//   );
// };
