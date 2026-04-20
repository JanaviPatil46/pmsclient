import axios from "axios";
import React, { useState, useContext, useEffect, useRef } from "react";
import { LoginContext } from "../../context/Context";
import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import { toast } from "material-react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "jspdf-autotable";
const Invoices = () => {
  const INVOICE_API = process.env.REACT_APP_INVOICES_URL;
    const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const navigate = useNavigate();
   const INVOICES_API = process.env.REACT_APP_INVOICES_URL;
  const [BillingInvoice, setBillingInvoice] = useState([]);
  const [selected, setSelected] = useState([]);
  const [accountName, setAccountName]=useState("")
     const [accountId, setAccountId] = useState(sessionStorage.getItem("accountId"));
const [anchorEl, setAnchorEl] = useState(null);
const [selectedInvoice, setSelectedInvoice] = useState(null);

const open = Boolean(anchorEl);

const handleMenuOpen = (event, invoice) => {
  event.stopPropagation(); // prevent row selection
  setAnchorEl(event.currentTarget);
  setSelectedInvoice(invoice);
};

const handleMenuClose = () => {
  setAnchorEl(null);
  setSelectedInvoice(null);
};
 const handlePrint = async (_id) => {
    try {
      const response = await fetch(
        `${INVOICES_API}/workflow/invoices/invoice/invoiceforprint/${_id}`
      );
      const invoiceData = await response.json();
      console.log(invoiceData);

      const accountName =
        invoiceData.invoice.account.accountName || "Unknown Account";
      // Construct the HTML for printing
      const printContent = `

            <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;

          }
          .invoice-container {
            max-width: 800px;
            margin: auto;
            padding: 20px;

          }
          h1 {
            font-size: 24px;
            color: #333;
            margin-bottom: 20px;
          }
          p {
            font-size: 16px;
            color: #555;
            margin: 5px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #dddddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          .summary-table {
            width: 50%;
            margin-left: auto;
            margin-top: 20px;
            border: none;
          }
          .summary-table td {
            border: none;
            padding: 10px 0;
          }
          .total-row td {
            font-weight: bold;
          }
        </style>
        <div style="font-family: Arial, sans-serif; padding: 35px;">
          <h1>Invoice Number #${invoiceData.invoice.invoicenumber}</h1>
          <p><strong>Date:</strong> ${new Date(invoiceData.invoice.invoicedate).toLocaleDateString()}</p>
          <p><strong>${accountName}</strong></p>
          <p><strong>Description:</strong> ${invoiceData.invoice.description}</p>
          

         <table border="1" cellspacing="0" cellpadding="8" style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th>Product/Service</th>
                <th>Rate</th>
                <th>Quantity</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceData.invoice.lineItems
                .map(
                  (item) => `
                <tr>
                  <td>${item.productorService}</td>
                  <td>$${item.rate}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.amount}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

                <table class="summary-table">
            <tbody>
              <tr>
                <td><strong>Subtotal</strong></td>
                <td>$${invoiceData.invoice.summary.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>Tax</strong></td>
                <td>$${invoiceData.invoice.summary.taxTotal.toFixed(2)}</td>
              </tr>
              <tr class="total-row">
                <td><strong>Total</strong></td>
                <td>$${invoiceData.invoice.summary.total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

        </div>
      `;

      // Open a new window and print the content
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Invoice</title>
          </head>
          <body onload="window.print(); window.close();">
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      handleMenuClose();
    } catch (error) {
      console.error("Error printing invoice:", error);
      toast.error("Failed to print invoice");
    }
  };
  const accountEmail = sessionStorage.getItem("email") || "";

  const handleDownload = async (_id) => {
  try {
    const response = await fetch(
      `${INVOICES_API}/workflow/invoices/invoice/invoiceforprint/${_id}`
    );
    const { invoice } = await response.json();
console.log("invoice for pdf", invoice);
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    /* ------------- COMPANY INFO TOP RIGHT ---------------- */
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("SNP TAX & FINANCIALS", pageWidth - 15, 20, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("3015 Hopyard Rd, Ste M", pageWidth - 15, 26, { align: "right" });
    doc.text("Pleasanton, CA 94588", pageWidth - 15, 32, { align: "right" });
    doc.text("http://www.snptaxandfinancials.com", pageWidth - 15, 38, { align: "right" });
    doc.text("silpa@snptaxandfinancials.com", pageWidth - 15, 44, { align: "right" });
     doc.text("(925) 800-3561", pageWidth - 15, 50, { align: "right" });

    /* ---------------- LEFT TITLE ---------------- */
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Invoice", 15, 28);

    /* ---------------- ACCOUNT BLOCK ---------------- */
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Account Information", 15, 50);

    doc.setFont("helvetica", "normal");
  // Account name
doc.text(invoice.account?.accountName || "Unknown Account", 15, 56);

// Account email directly under name
doc.text(accountEmail || "—", 15, 62);

// Invoice No + Date below email
doc.text(
  `Invoice #: ${invoice.invoicenumber}    |    Date: ${new Date(
    invoice.invoicedate
  ).toLocaleDateString()}`,
  15,
  68
);


    /* ---------------- DESCRIPTION ---------------- */
    doc.setFont("helvetica", "bold");
    doc.text("Description:", 15, 80);

    doc.setFont("helvetica", "normal");
    doc.text(invoice.description || "—", 15, 86);

    /* ---------------- TOTAL BOX RIGHT ---------------- */
    const boxX = pageWidth - 80;
    const boxY = 120;
    const boxWidth = 65;
    const boxHeight = 40;

    // box border
    doc.setDrawColor(180);
    doc.rect(boxX, boxY, boxWidth, boxHeight);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Subtotal", boxX + 5, boxY + 10);
    doc.text(
      `$${invoice.summary.subtotal.toFixed(2)}`,
      boxX + boxWidth - 5,
      boxY + 10,
      { align: "right" }
    );

    doc.text("Tax", boxX + 5, boxY + 20);
    doc.text(
      `$${invoice.summary.taxTotal.toFixed(2)}`,
      boxX + boxWidth - 5,
      boxY + 20,
      { align: "right" }
    );

    doc.setFont("helvetica", "bold");
    doc.text("Total", boxX + 5, boxY + 32);
    doc.text(
      `$${invoice.summary.total.toFixed(2)}`,
      boxX + boxWidth - 5,
      boxY + 32,
      { align: "right" }
    );

    /* ---------------- PAID STAMP ---------------- */
    if (invoice.invoiceStatus === "Paid" ) {
      doc.setTextColor(200, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.text("PAID", pageWidth / 2, 165, { align: "center", angle: -15 });
      doc.setTextColor(0, 0, 0);
    }

    /* ---------------- FOOTER ---------------- */
    doc.setFontSize(9);
    doc.text(
      "Thank you for your business!",
      pageWidth / 2,
      285,
      { align: "center" }
    );

    doc.save(`Invoice_${invoice.invoicenumber}.pdf`);
  } catch (error) {
    console.error("Error downloading invoice:", error);
    toast.error("Failed to download invoice");
  }
};

// const handleDownload = async (_id) => {
//   try {
//     const response = await fetch(
//       `${INVOICES_API}/workflow/invoices/invoice/invoiceforprint/${_id}`
//     );
//     const { invoice } = await response.json();

//     const doc = new jsPDF("p", "mm", "a4");
//     const pageWidth = doc.internal.pageSize.getWidth();

//     /* ---------------- HEADER ---------------- */
//     doc.setFontSize(20);
//     doc.setFont("helvetica", "bold");
//     doc.text("INVOICE", 15, 20);

//     doc.setFontSize(10);
//     doc.setFont("helvetica", "normal");
//     doc.text(`Invoice #: ${invoice.invoicenumber}`, pageWidth - 15, 18, {
//       align: "right",
//     });
//     doc.text(
//       `Date: ${new Date(invoice.invoicedate).toLocaleDateString()}`,
//       pageWidth - 15,
//       24,
//       { align: "right" }
//     );

//     doc.setLineWidth(0.5);
//     doc.line(15, 30, pageWidth - 15, 30);

//     /* ---------------- BILL TO ---------------- */
//     doc.setFontSize(11);
//     doc.setFont("helvetica", "bold");
//     doc.text("Bill To", 15, 38);

//     doc.setFont("helvetica", "normal");
//     doc.text(invoice.account?.accountName || "Unknown Account", 15, 44);

//     if (invoice.description) {
//       doc.text(`Description: ${invoice.description}`, 15, 50);
//     }

//     /* ---------------- TABLE ---------------- */
//     autoTable(doc, {
//       startY: 58,
//       head: [["Item", "Rate", "Qty", "Amount"]],
//       body: invoice.lineItems.map((item) => [
//         item.productorService,
//         `$${item.rate.toFixed(2)}`,
//         item.quantity,
//         `$${item.amount.toFixed(2)}`,
//       ]),
//       theme: "grid",
//       headStyles: {
//         fillColor: [240, 240, 240],
//         textColor: [40, 40, 40],
//         fontStyle: "bold",
//       },
//       styles: {
//         fontSize: 10,
//         cellPadding: 4,
//       },
//       columnStyles: {
//         1: { halign: "right" },
//         2: { halign: "center" },
//         3: { halign: "right" },
//       },
//     });

//     /* ---------------- TOTALS ---------------- */
//     const y = doc.lastAutoTable.finalY + 10;

//     doc.setFontSize(11);
//     doc.text("Subtotal:", pageWidth - 60, y);
//     doc.text(
//       `$${invoice.summary.subtotal.toFixed(2)}`,
//       pageWidth - 15,
//       y,
//       { align: "right" }
//     );

//     doc.text("Tax:", pageWidth - 60, y + 6);
//     doc.text(
//       `$${invoice.summary.taxTotal.toFixed(2)}`,
//       pageWidth - 15,
//       y + 6,
//       { align: "right" }
//     );

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(12);
//     doc.text("Total:", pageWidth - 60, y + 14);
//     doc.text(
//       `$${invoice.summary.total.toFixed(2)}`,
//       pageWidth - 15,
//       y + 14,
//       { align: "right" }
//     );

//     /* ---------------- FOOTER ---------------- */
//     doc.setFontSize(9);
//     doc.setFont("helvetica", "normal");
//     doc.text(
//       "Thank you for your business!",
//       pageWidth / 2,
//       285,
//       { align: "center" }
//     );

//     doc.save(`Invoice_${invoice.invoicenumber}.pdf`);
//     toast.success("Invoice downloaded successfully");
//     handleMenuClose();
//   } catch (error) {
//     console.error("Error downloading invoice:", error);
//     toast.error("Failed to download invoice");
//   }
// };

//   const handleDownload = async (_id) => {
//     console.log("Downloading invoice with ID:", _id);
//     try {
//       const response = await fetch(
//         `${INVOICES_API}/workflow/invoices/invoice/invoiceforprint/${_id}`
//       );
//       const invoiceData = await response.json();
//       console.log(invoiceData);
//       const doc = new jsPDF();

//       // Set up styles for the PDF
//       doc.setFont("Arial", "normal");
//       doc.setFontSize(14);
//       doc.text(`Invoice Number: ${invoiceData.invoice.invoicenumber}`, 10, 10);
//       doc.text(
//         `Date: ${new Date(invoiceData.invoice.invoicedate).toLocaleDateString()}`,
//         10,
//         20
//       );
//       doc.text(`Description: ${invoiceData.invoice.description}`, 10, 30);
//       const accountName =
//         invoiceData.invoice.account.accountName || "Unknown Account";
//       doc.text(`Account Name: ${accountName}`, 10, 40);

//       // Create line items table
//       // doc.autoTable({
//       //   startY: 50,
//       //   head: [["Product/Service", "Rate", "Quantity", "Amount"]],
//       //   body: invoiceData.invoice.lineItems.map((item) => [
//       //     item.productorService,
//       //     `$${item.rate}`,
//       //     item.quantity,
//       //     `$${item.amount}`,
//       //   ]),
//       //   theme: "grid", // Choose a theme, 'grid', 'striped', etc.
//       //   headStyles: {
//       //     fillColor: [242, 242, 242], // Light gray background for header
//       //     textColor: [51, 51, 51], // Dark text color
//       //   },
//       //   styles: {
//       //     textColor: [85, 85, 85], // Text color
//       //     fontSize: 12,
//       //     halign: "left", // Align text to left
//       //   },
//       // });
// autoTable(doc, {
//   startY: 50,
//   head: [["Product/Service", "Rate", "Quantity", "Amount"]],
//   body: invoiceData.invoice.lineItems.map((item) => [
//     item.productorService,
//     `$${item.rate}`,
//     item.quantity,
//     `$${item.amount}`,
//   ]),
//   theme: "grid",
//   headStyles: {
//     fillColor: [242, 242, 242],
//     textColor: [51, 51, 51],
//   },
//   styles: {
//     textColor: [85, 85, 85],
//     fontSize: 12,
//   },
// });

//       // Summary section
//       // const summaryY = doc.autoTable.previous.finalY + 10;
//       const summaryY = doc.lastAutoTable?.finalY
//   ? doc.lastAutoTable.finalY + 10
//   : 60;

//       doc.setFontSize(12);
//       doc.text(
//         `Subtotal: $${invoiceData.invoice.summary.subtotal.toFixed(2)}`,
//         10,
//         summaryY
//       );
//       doc.text(
//         `Tax: $${invoiceData.invoice.summary.taxTotal.toFixed(2)}`,
//         10,
//         summaryY + 10
//       );
//       doc.setFontSize(14);
//       doc.text(
//         `Total: $${invoiceData.invoice.summary.total.toFixed(2)}`,
//         10,
//         summaryY + 20
//       );

//       // Save the PDF to local storage
//       const pdfBlob = doc.output("blob");
//       const pdfUrl = URL.createObjectURL(pdfBlob);
//       const a = document.createElement("a");
//       a.href = pdfUrl;
//       a.download = `Invoice_${invoiceData.invoice.invoicenumber}.pdf`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);

//       toast.success("Invoice downloaded successfully");
//       handleMenuClose();
//     } catch (error) {
//       console.error("Error downloading invoice:", error);
//       toast.error("Failed to download invoice");
//     }
//   };
  const handleSelect = (_id) => {
    const currentIndex = selected.indexOf(_id);
    const newSelected =
      currentIndex === -1
        ? [...selected, _id]
        : selected.filter((item) => item !== _id);
    setSelected(newSelected);
    // Log all selected row IDs
    console.log("Selected IDs:", newSelected); // Log all selected IDs
  };
  
  const fetchidwiseData = async (accountId) => {
    try {
      const url = `${INVOICE_API}/workflow/invoices/invoice/invoicelistby/accountid/${accountId}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch task templates");
      }
      const data = await response.json();

      // Correct key to access invoices
      console.log("invoices", data);
      setBillingInvoice(data.invoice);
    } catch (error) {
      console.error("Error fetching task templates:", error);
    }
  };
   useEffect(() => {
    // if (loginUserId) {
      fetchidwiseData(accountId);
    // }
  }, [accountId]);
 const handlePayInvoice = () => {
  navigate("/client/payinvoice", {
    state: {
      selectedInvoices: BillingInvoice.filter(invoice => selected.includes(invoice._id)),
      accountName: accountName, // Replace with dynamic client/account name if needed
    },
  });
};
const hasPaidInvoiceSelected = BillingInvoice
  .filter(inv => selected.includes(inv._id))
  .some(inv => inv.invoiceStatus?.toLowerCase() === "paid");

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === "paid") return "bg-green-500/15 text-green-700 dark:text-green-400 border border-green-500/30";
    if (s === "unpaid" || s === "overdue") return "bg-destructive/10 text-destructive border border-destructive/30";
    if (s === "pending") return "bg-warning/15 text-warning border border-warning/30";
    return "bg-muted text-muted-foreground border border-border";
  };

  return (
    <div className="w-full max-w-[1700px] flex-1 h-[90vh] overflow-auto p-2">
      {/* Page header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Billing</h1>
          {BillingInvoice.length > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5">{BillingInvoice.length} invoice{BillingInvoice.length !== 1 ? "s" : ""}</p>
          )}
        </div>
        {selected.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{selected.length} selected</span>
            <button
              onClick={handlePayInvoice}
              disabled={hasPaidInvoiceSelected}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pay Invoice
            </button>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/60">
                <th className="sticky left-0 z-10 bg-muted/60 px-3 py-3 text-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded accent-primary"
                    checked={selected.length === BillingInvoice.length && BillingInvoice.length > 0}
                    onChange={() => {
                      if (selected.length === BillingInvoice.length) {
                        setSelected([]);
                      } else {
                        setSelected(BillingInvoice.map((item) => item._id));
                      }
                    }}
                  />
                </th>
                {["Invoice #", "Status", "Posted", "Total", "Amount Paid", "Balance Due", "Last Paid", "Description", ""].map((label, index) => (
                  <th key={index} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[100px]">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {BillingInvoice.map((invoice) => {
                const isSelected = selected.indexOf(invoice._id) !== -1;
                return (
                  <tr
                    key={invoice._id}
                    onClick={() => handleSelect(invoice._id)}
                    className={`cursor-pointer transition-colors hover:bg-muted/40 ${
                      isSelected ? "bg-primary/[0.06]" : ""
                    }`}
                  >
                    <td className="px-3 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded accent-primary"
                        checked={isSelected}
                        onChange={() => handleSelect(invoice._id)}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{invoice.invoicenumber}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadge(invoice.invoiceStatus)}`}>
                        {invoice.invoiceStatus || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(invoice.invoicedate).toLocaleDateString("en-US")}</td>
                    <td className="px-4 py-3 font-medium text-foreground">${invoice.summary?.total?.toFixed(2) || "0.00"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{invoice.paidAmount !== null ? `$${invoice.paidAmount.toFixed(2)}` : "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {invoice.balanceDueAmount !== null
                        ? `$${invoice.balanceDueAmount.toFixed(2)}`
                        : `$${invoice.summary?.total?.toFixed(2) || "0.00"}`}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{invoice.lastPaid}</td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[180px] truncate" title={invoice.description}>{invoice.description}</td>
                    <td className="px-4 py-3 relative" onClick={(e) => e.stopPropagation()}>
                      <div className="relative inline-block">
                        <button
                          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          onClick={(e) => handleMenuOpen(e, invoice)}
                        >
                          <MoreVertical size={15} />
                        </button>
                        {open && selectedInvoice?._id === invoice._id && (
                          <div className="absolute right-0 z-50 mt-1 w-36 rounded-lg border border-border bg-card shadow-lg text-sm overflow-hidden">
                            <button
                              className="w-full px-4 py-2 text-left text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                              disabled={selectedInvoice?.invoiceStatus?.toLowerCase() !== "paid"}
                              onClick={() => { handleDownload(selectedInvoice._id); handleMenuClose(); }}
                            >
                              Download
                            </button>
                            <button
                              className="w-full px-4 py-2 text-left text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                              disabled={selectedInvoice?.invoiceStatus?.toLowerCase() !== "paid"}
                              onClick={() => { handlePrint(selectedInvoice._id); handleMenuClose(); }}
                            >
                              Print
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
