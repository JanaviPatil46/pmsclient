import React, { useState, useEffect, useCallback, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "../components/ui/motion";
import useShortcuts from "../src/hooks/useShortcuts";
import {
  Eye, Lock,
  Folder as FolderClosedIcon,
  FolderOpen as FolderOpenIcon,
  X as CloseIcon,
  MoreVertical as MoreVertIcon,
  FileText as DescriptionIcon,
  AlertTriangle as WarningAmberIcon,
  FolderPlus as FolderIcon,
  Upload as UploadFileIcon,
  FolderUp as DriveFolderUploadIcon,
  Download as DownloadIcon,
  Trash2 as DeleteIcon,
  FolderInput as DriveFileMoveIcon,
  FileText as FilePdfIcon,
  Image as FileImageIcon,
  FileType2 as FileWordIcon,
  Sheet as FileExcelIcon,
  AlignLeft as FileAltIcon,
  File as FileUnknownIcon,
  Loader2,
  Files,
} from "lucide-react";
import FileUploadDrawer from "./drawers/FileUploadDrawer";
import CreteFolderDrawer from "./drawers/CreteFolderDrawer";
import FolderUploadDrawer from "./drawers/FolderUploadDrawer";
import RenameDrawer from "./drawers/RenameDrawer";
import MoveDrawer from "./drawers/MoveDrawer";
import { useNavigate } from "react-router-dom";
import ParentFolderMenu from "./ParentFolderMenu";
import FolderMenu from "./FolderMenu";
import FileMenu from "./FileMenu";
import axios from "axios";
import { DocusealForm } from "@docuseal/react";
import { toast } from "material-react-toastify";

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
    const [isLoading, setIsLoading] = useState(true);
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
        setAdminUserId(res.data.adminUserId.emailSyncEmail);
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
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://www.snptaxes.com/api/accountsdoc/files/list/clientView?folderPath=${accountId}`
        );
        console.log("responce", res);
        const data = await res.json();
        console.log("janavi patil", data.contents);
        if (res.ok) {
          setFolderTree(data.contents);
          checkForPendingApprovals(data.contents);
        } else {
          setError("Failed to fetch folder tree");
        }
      } catch (err) {
        setError("Error fetching folder tree");
      } finally {
        setIsLoading(false);
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
      // if (isReadOnly) return;
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
 const handleDownloadFile = async (item) => {
  console.log("Downloading file:", item);
      try {
        const res = await fetch(
          "https://www.snptaxes.com/api/accountsdoc/download",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paths: item.path, // backend already supports string or array
            }),
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
        a.download = item.name || "download";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Download error:", err);
      }
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

    const kbNewFolder = useCallback(() => { setNewFolderDrawerOpen(true); handleMenuClose(); }, []);
    const kbUploadFile = useCallback(() => setFileUploadDrawerOpen(true), []);
    const kbUploadFolder = useCallback(() => setFolderUploaDrawerOpen(true), []);
    const kbDelete = useCallback(() => { if (selectedItems.size > 0) handleBulkTrash(); }, [selectedItems]);
    const kbSelectAll = useCallback(() => handleSelectAll({ target: { checked: true } }), []);
    const kbClearSelection = useCallback(() => setSelectedItems(new Set()), []);

    useShortcuts([
      { id: "docs_new_folder",    keys: ["n"],           action: kbNewFolder,      scope: "documents", description: "New folder",              group: "Documents" },
      { id: "docs_upload_file",   keys: ["u"],           action: kbUploadFile,     scope: "documents", description: "Upload file",             group: "Documents" },
      { id: "docs_upload_folder", keys: ["shift", "u"],  action: kbUploadFolder,   scope: "documents", description: "Upload folder",           group: "Documents" },
      { id: "docs_trash",         keys: ["delete"],      action: kbDelete,         scope: "documents", description: "Move selected to trash",   group: "Documents" },
      { id: "docs_select_all",    keys: ["meta", "a"],   action: kbSelectAll,      scope: "documents", description: "Select all items",         group: "Documents" },
      { id: "docs_clear",         keys: ["escape"],      action: kbClearSelection, scope: "documents", description: "Clear selection",          group: "Documents", preventDefault: false },
    ]);

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
      const ext = fileName?.split(".").pop().toLowerCase();
      switch (ext) {
        case "pdf":
          return <FilePdfIcon size={16} className="shrink-0 text-red-500" strokeWidth={1.8} />;
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
          return <FileImageIcon size={16} className="shrink-0 text-blue-500" strokeWidth={1.8} />;
        case "doc":
        case "docx":
          return <FileWordIcon size={16} className="shrink-0 text-blue-700" strokeWidth={1.8} />;
        case "xls":
        case "xlsx":
          return <FileExcelIcon size={16} className="shrink-0 text-green-600" strokeWidth={1.8} />;
        case "txt":
        case "md":
          return <FileAltIcon size={16} className="shrink-0 text-muted-foreground" strokeWidth={1.8} />;
        default:
          return <FileUnknownIcon size={16} className="shrink-0 text-muted-foreground" strokeWidth={1.8} />;
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
        <span className="text-xs font-bold text-foreground">
          {formatUploadedAt(meta.uploadedAt)}
        </span>
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
        const colorClass =
          meta.signStatus === "pendingSignature" ? "border-amber-500 text-amber-600"
          : meta.signStatus === "signatureCompleted" ? "border-green-600 text-green-700"
          : "border-border text-muted-foreground";
        chips.push(
          <span key="signChip" className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${colorClass}`}>
            {statusTextMap[meta.signStatus]}
          </span>
        );
      }

      // ======= APPROVAL STATUS =======
      if (APPROVAL_STATUSES.includes(meta.authStatus)) {
        const colorClass =
          meta.authStatus === "pendingApproval" ? "border-amber-500 text-amber-600"
          : meta.authStatus === "approvalCompleted" ? "border-green-600 text-green-700"
          : meta.authStatus === "canceledApproval" ? "border-destructive text-destructive"
          : "border-border text-muted-foreground";

        if (meta.authStatus === "canceledApproval" && meta.cancelReason) {
          chips.push(
            <span key="approvalCanceledChip" title={meta.cancelReason} className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium cursor-pointer ${colorClass}`}>
              Approval Canceled
            </span>
          );
        } else {
          chips.push(
            <span key="approvalChip" className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${colorClass}`}>
              {approvalStatusTextMap[meta.authStatus]}
            </span>
          );
        }
      }

      // ======= INVOICE LOCK STATUS =======
      if (INVOICE_LOCK_STATUSES.includes(meta.lockInvoiceStatus)) {
        const colorClass =
          meta.lockInvoiceStatus === "pendingpayment" ? "border-amber-500 text-amber-600"
          : meta.lockInvoiceStatus === "paymentcompleted" ? "border-green-600 text-green-700"
          : "border-border text-muted-foreground";
        chips.push(
          <span key="invoiceLockChip" className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${colorClass}`}>
            {invoiceStatusTextMap[meta.lockInvoiceStatus]}
          </span>
        );
      }

      // ======= SHOW NOTHING IF NO STATUS =======
      if (chips.length === 0) return null;

      return <div className="flex gap-1 flex-wrap">{chips}</div>;
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
            <tr
              className={`group border-t border-border transition-all duration-150 ${
                isSelected ? "bg-primary/8" : ""
              } hover:bg-muted/40 ${
                item.meta?.readOnly ? "cursor-not-allowed" : "cursor-pointer"
              } ${isFolder ? "folder-row" : ""}`}
            >
              {/* Checkbox Column */}
              <td className="w-12 px-4 py-3">
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded accent-primary"
                    checked={isSelected}
                    disabled={insideRestricted || meta.readOnly}
                    ref={el => { if (el) el.indeterminate = isPartiallySelected; }}
                    onChange={() => {
                      if (insideRestricted || meta.readOnly) return;
                      isFolder ? handleFolderSelect(item) : handleSelectItem(fullPath);
                    }}
                  />
                </div>
              </td>

              {/* Name Column with indentation */}
              <td className="py-3" style={{ paddingLeft: `${level * 16 + 8}px` }}>
                <div className="flex items-center">
                  {isFolder ? (
                    <>
                      <button
                        type="button"
                        className="p-0.5 mr-1 rounded hover:bg-muted text-foreground disabled:opacity-40"
                        onClick={() => toggleFolder(fullPath, meta.readOnly)}
                        disabled={meta.readOnly}
                      >
                        {expandedFolders[fullPath]
                          ? <FolderOpenIcon size={16} className="text-primary" />
                          : <FolderClosedIcon size={16} className="text-amber-500" />}
                      </button>
                      <span
                        className={`text-sm font-medium cursor-pointer ml-0.5 ${
                          meta.readOnly ? "text-muted-foreground" : "text-foreground"
                        }`}
                        onClick={() => toggleFolder(fullPath, meta.readOnly)}
                      >
                        {item.name}
                        {inheritedNewTag && (
                          <span
                            className="inline-flex items-center rounded-full px-1.5 py-0 text-[0.65rem] font-medium ml-1"
                            style={{ backgroundColor: inheritedNewTag.tagColour }}
                          >
                            {inheritedNewTag.tagName}
                          </span>
                        )}
                        {meta.readOnly && (
                          <span className="text-xs text-destructive ml-1">(Locked)</span>
                        )}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="mr-2">{getFileIcon(item.name)}</span>
                      <div className="flex flex-col">
                        <span
                          className={`text-sm ${
                            meta.readOnly
                              ? "text-muted-foreground cursor-not-allowed"
                              : "text-primary underline cursor-pointer"
                          }`}
                          onClick={handleSafeFileClick}
                        >
                          {item.name}
                          {meta.newTags?.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center rounded-full px-1.5 py-0 text-[0.65rem] font-medium ml-2"
                              style={{ backgroundColor: tag.tagColour }}
                            >
                              {tag.tagName}
                            </span>
                          ))}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </td>

              <td className="py-3 px-3">
                <div>{getStatusChip(meta, isFolder)}</div>
              </td>

              <td className="py-3 px-3">
                <UploadedInfo meta={meta} />
              </td>
              <td className="py-3 px-3">
                <span className="text-[12px] font-medium text-muted-foreground">{meta.uploadedBy}</span>
              </td>

              <td className="py-3 px-3 text-right">
                {!hideMenu && (
                  <button
                    type="button"
                    className="inline-flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-muted hover:text-foreground transition-all duration-150"
                    onClick={(e) => handleMenuOpen(e, { ...item, fullPath })}
                  >
                    <MoreVertIcon size={14} />
                  </button>
                )}
              </td>
            </tr>

            {/* Render children if folder is expanded */}
            {isFolder && item.children && item.children.length > 0 && (
              <AnimatePresence initial={false}>
                {expandedFolders[fullPath] && (
                  <motion.tr
                    key={`expand-${fullPath}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    style={{ display: "contents" }}
                  >
                    <td colSpan={6} style={{ padding: 0 }}>
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <table className="w-full text-sm">
                          <tbody>
                            {renderTableRows(item.children, level + 1, fullPath, insideRestricted)}
                          </tbody>
                        </table>
                      </motion.div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            )}
          </React.Fragment>
        );
      });
    };

    return (
      <motion.div
        className="w-full max-w-[1700px] flex-1 h-[90vh] overflow-auto font-sans"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="p-4 sm:p-6 flex flex-col gap-5">

        {/* ── Page header ── */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                <Files size={16} className="text-primary" strokeWidth={1.8} />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Documents</h1>
            </div>
            <p className="text-[13px] text-muted-foreground pl-10">
              Manage your files and folders.
            </p>
          </div>

          {/* ── Toolbar ── */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              title="New Folder (N)"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-[13px] font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors duration-150"
              onClick={() => { setNewFolderDrawerOpen(true); handleMenuClose(); }}
            >
              <FolderIcon size={14} strokeWidth={2} /> New Folder
              <kbd className="ml-1 rounded border border-primary-foreground/30 bg-primary-foreground/10 px-1 py-0 text-[10px] font-bold leading-none">N</kbd>
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              title="Upload File (U)"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-[13px] font-semibold text-foreground hover:bg-muted transition-colors duration-150 shadow-sm"
              onClick={() => setFileUploadDrawerOpen(true)}
            >
              <UploadFileIcon size={14} strokeWidth={2} /> Upload File
              <kbd className="ml-1 rounded border border-border bg-muted px-1 py-0 text-[10px] font-bold leading-none text-muted-foreground">U</kbd>
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              title="Upload Folder (⇧U)"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-[13px] font-semibold text-foreground hover:bg-muted transition-colors duration-150 shadow-sm"
              onClick={() => setFolderUploaDrawerOpen(true)}
            >
              <DriveFolderUploadIcon size={14} strokeWidth={2} /> Upload Folder
              <kbd className="ml-1 rounded border border-border bg-muted px-1 py-0 text-[10px] font-bold leading-none text-muted-foreground">⇧U</kbd>
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/40 bg-destructive/5 px-3.5 py-2 text-[13px] font-semibold text-destructive hover:bg-destructive/10 transition-colors duration-150 shadow-sm"
              onClick={handleTrashClick}
            >
              <DeleteIcon size={14} strokeWidth={2} /> View Trash
            </motion.button>
          </div>
        </motion.div>

        {/* ── Bulk selection bar ── */}
        <AnimatePresence>
        {selectedItems.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-between flex-wrap gap-2 px-4 py-3 rounded-xl border border-primary/25 bg-primary/5 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {selectedItems.size}
              </span>
              <p className="text-[13px] font-semibold text-primary">
                item{selectedItems.size !== 1 ? "s" : ""} selected
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[12px] font-semibold text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all duration-150 disabled:opacity-50"
                onClick={() => setBulkMoveDrawerOpen(true)}
                disabled={bulkOperationLoading}
              >
                <DriveFileMoveIcon size={12} /> Move
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[12px] font-semibold text-foreground hover:bg-muted active:scale-[0.98] transition-all duration-150 disabled:opacity-50"
                onClick={handleBulkDownload}
                disabled={bulkOperationLoading}
              >
                <DownloadIcon size={12} /> Download
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-1.5 text-[12px] font-semibold text-destructive hover:bg-destructive/10 active:scale-[0.98] transition-all duration-150 disabled:opacity-50"
                onClick={handleBulkTrash}
                disabled={bulkOperationLoading}
              >
                <DeleteIcon size={12} /> Delete
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[12px] font-semibold text-muted-foreground hover:bg-muted active:scale-[0.98] transition-all duration-150 disabled:opacity-50"
                onClick={() => setSelectedItems(new Set())}
                disabled={bulkOperationLoading}
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
        </AnimatePresence>

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
        <AnimatePresence>
        {openViewer && (
          <motion.div
            key="viewer-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <motion.div
              className="relative w-full max-w-3xl bg-card rounded-xl shadow-xl flex flex-col max-h-[90vh]"
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <DescriptionIcon size={16} className="text-amber-400 shrink-0" />
                  <span className="text-sm font-semibold text-foreground truncate">
                    {selectedDoc?.filename || "Document"}
                  </span>
                  {selectedDoc?.description && (
                    <button
                      type="button"
                      title={selectedDoc.description}
                      className="p-0.5 rounded text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <WarningAmberIcon size={14} />
                    </button>
                  )}
                </div>
                <button type="button" onClick={handleCloseViewer} className="p-1 rounded hover:bg-muted text-foreground">
                  <CloseIcon size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-auto border-t border-border" style={{ height: "80vh" }}>
                {selectedDoc ? (
                  <iframe src={selectedDoc.fileUrl} title={selectedDoc.filename} width="100%" height="100%" style={{ border: "none" }} />
                ) : (
                  <p className="text-sm text-muted-foreground p-4">No document selected</p>
                )}
              </div>

              {selectedDoc && (
                <div className="flex justify-center gap-3 p-4 border-t border-border">
                  <button
                    type="button"
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                    onClick={() => handleApprovalAction(selectedDoc._id, "approve")}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    onClick={handleCancelClick}
                  >
                    Disapprove
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Cancel Reason Dialog */}
        <AnimatePresence>
        {cancelDialogOpen && (
          <motion.div
            key="cancel-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <motion.div
              className="w-full max-w-sm bg-card rounded-xl shadow-xl"
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="px-4 py-3 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Cancel Document Approval</h3>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">Please provide a reason for cancelling this document approval:</p>
                <label className="text-sm text-foreground">Description</label>
                <textarea
                  autoFocus
                  className="w-full rounded-lg border border-border bg-background text-foreground text-sm px-3 py-2 min-h-[80px] focus:outline-none focus:ring-1 focus:ring-primary"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 px-4 py-3 border-t border-border">
                <button
                  type="button"
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  onClick={() => setCancelDialogOpen(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90 transition-colors disabled:opacity-50"
                  disabled={!cancelReason.trim()}
                  onClick={confirmCancel}
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>

        <AnimatePresence>
        {dialogOpen && (
          <motion.div
            key="dialog-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <motion.div
              className="relative w-full max-w-4xl bg-card rounded-xl shadow-xl flex flex-col max-h-[90vh]"
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Signing Form</h3>
                <button type="button" onClick={handleCloseDialog} className="p-1 rounded hover:bg-muted text-foreground">
                  <CloseIcon size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-2 border-t border-border">
                {selectedSlug && (
                  <DocusealForm
                    src={`https://docuseal.com/s/${selectedSlug}`}
                    email={targetEmail}
                    onComplete={async (data) => {
                      console.log("Post-sign data:", data);
                      try {
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
                          if (updateData.allCompleted) {
                            console.log("🎉 All submitters have completed signing!");
                            const fullPath = decodeURIComponent(
                              updateData.esignRecord.fileUrl.split("/uploads/accounts/")[1]
                            );
                            console.log("Full file path:", fullPath);
                            const parentFolderPath = fullPath.split("/").slice(0, -1).join("/");
                            console.log("Parent folder path:", parentFolderPath);
                            await updateStatus({ path: fullPath }, "signStatus", "signatureCompleted");
                            await fetch(`${SIGNATURE_API}/notify-admin`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                clientName: targetEmail,
                                documentName: selectedSlug,
                                message: "All parties have completed signing",
                                accountId: accountId
                              }),
                            });
                            alert("All signatures completed! Document has been fully executed.");
                          } else {
                            console.log(`✅ You have signed. Document updated. Waiting for ${updateData.pendingCount} more signer(s).`);
                            alert(`Thank you for signing! Document has been updated. Waiting for ${updateData.pendingCount} more signer(s) to complete.`);
                          }
                        } else {
                          alert("Error updating signature status.");
                        }
                      } catch (err) {
                        console.error("Error handling post-sign actions", err);
                        alert("Error while updating sign status.");
                      }
                      handleCloseDialog();
                    }}
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>

        <AnimatePresence>
        {invoiceDialogOpen && (
          <motion.div
            key="invoice-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <motion.div
              className="w-full max-w-sm bg-card rounded-xl shadow-xl"
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="px-4 py-3 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Invoice Details</h3>
              </div>
              <div className="p-4">
                {selectedInvoiceFile?.meta?.invoices?.length ? (
                  <table className="w-full text-sm">
                    <thead className="bg-muted text-foreground">
                      <tr>
                        <th className="px-3 py-2 text-left font-bold">Invoice Number</th>
                        <th className="px-3 py-2 text-left font-bold">Description</th>
                        <th className="px-3 py-2 text-right font-bold">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoiceFile.meta.invoices.map((invoice) => (
                        <tr key={invoice._id} className="border-t border-border">
                          <td className="px-3 py-1.5">{invoice.invoicenumber}</td>
                          <td className="px-3 py-1.5">{invoice.description || "No description"}</td>
                          <td className="px-3 py-1.5 text-right">${invoice.summary?.total?.toFixed(2) || "0.00"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-foreground">No invoices available for this file.</p>
                )}
              </div>
              <div className="flex justify-end gap-2 px-4 py-3 border-t border-border">
                <button
                  type="button"
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  onClick={() => setInvoiceDialogOpen(false)}
                >
                  Close
                </button>
                {selectedInvoiceFile?.meta?.invoices?.length > 0 && (
                  <button
                    type="button"
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    onClick={handlePayInvoice}
                  >
                    Pay
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* ── Folder Explorer card ── */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          {/* Card header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <FolderClosedIcon size={14} className="text-amber-500 shrink-0" />
              <p className="text-[13px] font-semibold text-foreground tracking-tight">Folder Explorer</p>
              {folderTree.length > 0 && (
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground border border-border">
                  {folderTree.length}
                </span>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="w-12 px-4 py-3"><div className="flex items-center justify-center"><Skeleton className="h-4 w-4 rounded" /></div></th>
                    <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Name</th>
                    <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Status</th>
                    <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Uploaded</th>
                    <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">User</th>
                    <th className="px-3 py-3 text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/60">
                      <td className="w-12 px-4 py-3"><div className="flex items-center justify-center"><Skeleton className="h-4 w-4 rounded" /></div></td>
                      <td className="py-3" style={{ paddingLeft: `${(i % 3) * 16 + 8}px` }}>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4 rounded shrink-0" />
                          <Skeleton className={`h-3 rounded ${i % 2 === 0 ? "w-40" : "w-28"}`} />
                        </div>
                      </td>
                      <td className="py-3 px-3"><Skeleton className="h-5 w-24 rounded-full" /></td>
                      <td className="py-3 px-3"><Skeleton className="h-3 w-20 rounded" /></td>
                      <td className="py-3 px-3"><Skeleton className="h-3 w-16 rounded" /></td>
                      <td className="py-3 px-3"><Skeleton className="h-5 w-5 rounded ml-auto" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : folderTree && folderTree.length > 0 ? (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="w-12 px-4 py-3">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded accent-primary cursor-pointer"
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </div>
                    </th>
                    <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Name</th>
                    <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Status</th>
                    <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Uploaded</th>
                    <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">User</th>
                    <th className="px-3 py-3 text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">{renderTableRows(folderTree)}</tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <FolderClosedIcon size={22} className="text-muted-foreground" strokeWidth={1.5} />
              </div>
              <p className="text-sm font-medium text-foreground">No files or folders yet</p>
              <p className="text-[13px] text-muted-foreground">Use the buttons above to create a folder or upload files.</p>
            </div>
          )}
        </div>

        {selectedFolderForMenu ? (
          selectedFolderForMenu.isParent ? (
            <ParentFolderMenu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
              onCreateFolder={() => setNewFolderDrawerOpen(true)}
            />
          ) : selectedFolderForMenu.isFile ? (
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
              onDownload={handleDownloadFile}
            />
          ) : (
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

        </div>
      </motion.div>
    );
  };
  return <FolderTreeView accountId={accountId} />;
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
