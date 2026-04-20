import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { toast } from "material-react-toastify";
import { CreditCard, ChevronLeft } from "lucide-react";
const PayInvoice = () => {
  const INVOICE_API = process.env.REACT_APP_INVOICES_URL;
      const accountHolderTypeOptions = [
    { label: "Individual", value: "individual" },
    { label: "Business", value: "business" },
  ];
  const accountTypeOptions = [
    { label: "Checking", value: "checking" },
    { label: "Savings", value: "savings" },
  ];
  const location = useLocation();
  const { selectedInvoices = [], accountName = "" } = location.state || {};
console.log("Selected Invoices:", selectedInvoices);
  const [routingNumber,setRoutingNumber]=useState("000000013")
  const [accountNumber,setAccountNumber]=useState("1100000005")
  const [selectedAccountHolderType, setSelectedAccountHolderType] = useState(accountHolderTypeOptions[0]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [selectedAccountType, setSelectedAccountType] = useState(accountTypeOptions[0]);
const [errors, setErrors] = useState({});


const navigate = useNavigate();
  const handleAccountHolderTypeChange = (_, value) => {
    setSelectedAccountHolderType(value);
  };

  const handleAccountTypeChange = (_, value) => {
    setSelectedAccountType(value);
  };

//   const handleConfirmPayment = () => {
//     // Add payment logic here
//     console.log("Paying", selectedInvoices);
//   };

const handleConfirmPayment = async () => {

    const newErrors = {};

  // ===== VALIDATION =====
  if (selectedAccountHolderType?.value === "individual") {
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
  }

  if (selectedAccountHolderType?.value === "business") {
    if (!companyName.trim()) newErrors.companyName = "Company name is required";
  }

  // Routing & account number validation
  if (!routingNumber.trim()) {
    newErrors.routingNumber = "Routing number is required";
  } else if (!/^\d{9}$/.test(routingNumber.trim())) {
    newErrors.routingNumber = "Routing number must be 9 digits";
  }

  if (!accountNumber.trim()) {
    newErrors.accountNumber = "Account number is required";
  } else if (accountNumber.trim().length < 6) {
    newErrors.accountNumber = "Account number must be at least 6 digits";
  }

  // Check if errors exist
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return toast.error("Please correct the highlighted errors");
  }

  // Clear previous errors
  setErrors({});
  let method;

  const totalAmount = selectedInvoices.reduce((sum, row) => sum + row.summary.total, 0);

  if (selectedAccountHolderType?.value === "business") {
    method = {
      type: "bank",
      routing_number: routingNumber,
      account_number: accountNumber,
      account_type: selectedAccountType?.value?.toUpperCase() || "CHECKING",
      name: companyName,
      account_holder_type: "business",
    };
  } else if (selectedAccountHolderType?.value === "individual") {
    method = {
      type: "bank",
      routing_number: routingNumber,
      account_number: accountNumber,
      account_type: selectedAccountType?.value?.toUpperCase() || "CHECKING",
      given_name: firstName,
      surname: lastName,
    };
  }

  const chargeData = {
    amount: totalAmount * 100,
    account_id: "3A7Sk7IGQ6eu3I5aVRh5hA", // TODO: Provide the actual ACH account ID
    method,
  };

  const secretKey = 'nKvexjXcQ2-xo3DmtPaSHgj2cG3zaej5jrsH16S01UfX1Gh75kx6q9D7GggOjATb'; // TODO: Insert your AffiniPay secret key
  const auth = btoa(`${secretKey}:`);

  try {
    const response = await axios.post(
      "https://api.affinipay.com/v1/charges",
      chargeData,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Payment success:", response.data);

    const updatePromises = selectedInvoices.map((invoice) => {
      const newPaidAmount = (invoice.paidAmount || 0) + invoice.summary.total;
      const date = new Date();
const formattedDate = date.toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});
      return fetch(`${INVOICE_API}/workflow/invoices/invoice/${invoice._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paidAmount: newPaidAmount,
          invoiceStatus: "Paid",
           lastPaid: formattedDate,
                    active: "true",
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(`Invoice ${invoice._id} updated:`, result);
          return result;
        });
    });

    const results = await Promise.all(updatePromises);

    const allSuccess = results.every(
      (result) => result && result.message === "Invoice Updated successfully"
    );

    if (allSuccess) {
      toast.success("Payment successful and all invoices updated!");

      selectedInvoices.forEach((invoice) => {
        console.log(`Invoice ${invoice.invoicenumber} - Paid: $${invoice.summary.total}, Status: Paid`);
      });
navigate("/client/billing")
      // Optionally: navigate or close dialog here
    } else {
      toast.error("Payment succeeded but some invoices failed to update");
    }
  } catch (error) {
    console.error("Payment error:", error.response?.data || error.message);
    alert("Payment failed!");
  }
};

  const fieldClass = (err) =>
    `w-full rounded-lg border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 ${err ? "border-destructive" : "border-border"}`;

  const totalAmount = selectedInvoices.reduce((sum, row) => sum + row.summary.total, 0);

  return (
    <div className="w-full max-w-[1700px] p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <CreditCard size={22} className="text-primary shrink-0" />
        <h1 className="text-2xl font-bold text-foreground">Pay Invoices</h1>
      </div>

      {/* Client */}
      {accountName && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Client</p>
          <p className="text-sm font-medium text-foreground">{accountName}</p>
        </div>
      )}

      {/* Invoice table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Invoice #", "Status", "Amount"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {selectedInvoices.map((row) => (
                <tr key={row._id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{row.invoicenumber}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.invoiceStatus}</td>
                  <td className="px-4 py-3 font-medium text-foreground">${row.summary.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end px-4 py-3 border-t border-border bg-muted/20 text-sm font-semibold text-foreground">
          Total: ${totalAmount.toFixed(2)}
        </div>
      </div>

      <hr className="border-border" />

      {/* Payment Details */}
      <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-4 max-w-lg">
        <h2 className="text-base font-semibold text-foreground">Payment Details</h2>

        {/* Routing Number */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            Routing Number
          </label>
          <input
            type="text"
            placeholder="Routing Number"
            value={routingNumber}
            className={fieldClass(errors.routingNumber)}
            readOnly
          />
          {errors.routingNumber && (
            <p className="mt-1 text-xs text-destructive">{errors.routingNumber}</p>
          )}
        </div>

        {/* Account Number */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            Bank Account Number
          </label>
          <input
            type="text"
            placeholder="Account Number"
            value={accountNumber}
            className={fieldClass(errors.accountNumber)}
            readOnly
          />
          {errors.accountNumber && (
            <p className="mt-1 text-xs text-destructive">{errors.accountNumber}</p>
          )}
        </div>

        {/* Account Holder Type */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            Account Holder Type
          </label>
          <select
            value={selectedAccountHolderType?.value}
            onChange={(e) => {
              const found = accountHolderTypeOptions.find((o) => o.value === e.target.value);
              setSelectedAccountHolderType(found);
            }}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {accountHolderTypeOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Individual fields */}
        {selectedAccountHolderType?.value === "individual" && (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                First Name
              </label>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={fieldClass(errors.firstName)}
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-destructive">{errors.firstName}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={fieldClass(errors.lastName)}
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>
        )}

        {/* Business field */}
        {selectedAccountHolderType?.value === "business" && (
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Company Name
            </label>
            <input
              type="text"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className={fieldClass(errors.companyName)}
            />
            {errors.companyName && (
              <p className="mt-1 text-xs text-destructive">{errors.companyName}</p>
            )}
          </div>
        )}

        {/* Account Type */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            Account Type
          </label>
          <select
            value={selectedAccountType?.value}
            onChange={(e) => {
              const found = accountTypeOptions.find((o) => o.value === e.target.value);
              setSelectedAccountType(found);
            }}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {accountTypeOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          <ChevronLeft size={15} />
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirmPayment}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          <CreditCard size={15} />
          Confirm Payment
        </button>
      </div>
    </div>
  );
};

export default PayInvoice;
