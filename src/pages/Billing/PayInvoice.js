import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Divider,
  TextField,
  Autocomplete,
  Button,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { toast } from "material-react-toastify";
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

  const [routingNumber,setRoutingNumber]=useState("000000013")
  const [accountNumber,setAccountNumber]=useState("1100000005")
  const [selectedAccountHolderType, setSelectedAccountHolderType] = useState(accountHolderTypeOptions[0]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [selectedAccountType, setSelectedAccountType] = useState(accountTypeOptions[0]);



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

      return fetch(`${INVOICE_API}/workflow/invoices/invoice/${invoice._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paidAmount: newPaidAmount,
          invoiceStatus: "Paid",
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

      // Optionally: navigate or close dialog here
    } else {
      toast.error("Payment succeeded but some invoices failed to update");
    }
  } catch (error) {
    console.error("Payment error:", error.response?.data || error.message);
    alert("Payment failed!");
  }
};

  return (
    <Box   sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
        flexGrow: 1,
       
        p: 1,
      }}>
      <Typography variant="h4" gutterBottom>
        Paying Invoices
      </Typography>

      <Box sx={{ mb: 3 }}>
        <InputLabel sx={{ fontWeight: "bold", mb: 0.5 }}>Client</InputLabel>
        <Typography variant="subtitle1">{accountName}</Typography>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Invoice #</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {selectedInvoices.map((row) => (
            <TableRow key={row._id}>
              <TableCell>{row.invoicenumber}</TableCell>
              <TableCell>{row.invoiceStatus}</TableCell>
              <TableCell>${row.summary.total.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box sx={{ mt: 3 }}>
        <strong>Total Amount:</strong>{" "}
        ${selectedInvoices.reduce((sum, row) => sum + row.summary.total, 0).toFixed(2)}
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        Payment Details
      </Typography>

      <Box mt={2}>
        <InputLabel>Routing Number</InputLabel>
        <TextField
          fullWidth
          placeholder="Routing Number"
          size="small"
          value={routingNumber}
        //   onChange={(e) => setRoutingNumber(e.target.value)}
          sx={{ mb: 2 }}
        />

        <InputLabel>Bank Account Number</InputLabel>
        <TextField
          fullWidth
          placeholder="Account Number"
          size="small"
          value={accountNumber}
        //   onChange={(e) => setAccountNumber(e.target.value)}
          sx={{ mb: 2 }}
        />

        <InputLabel>Account Holder Type</InputLabel>
        <Autocomplete
        //   size="small"
          options={accountHolderTypeOptions}
          value={selectedAccountHolderType}
          onChange={handleAccountHolderTypeChange}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => <TextField {...params} placeholder="Account Holder Type" />}
        />

        {selectedAccountHolderType?.value === "individual" && (
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="First Name"
              size="small"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Last Name"
              size="small"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Box>
        )}

        {selectedAccountHolderType?.value === "business" && (
          <TextField
            fullWidth
            label="Company Name"
            size="small"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            sx={{ mt: 2 }}
          />
        )}

        <InputLabel sx={{ mt: 2 }}>Account Type</InputLabel>
        <Autocomplete
        //   size="small"
          options={accountTypeOptions}
          value={selectedAccountType}
          onChange={handleAccountTypeChange}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => <TextField {...params} placeholder="Account Type" />}
        />
      </Box>

      <Box mt={4} display="flex" gap={2}>
        <Button variant="outlined" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button 
        // variant="contained"
        size="small"
        sx={{
              backgroundColor: 'text.menu',
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'menu.dark',
                boxShadow: 1,
              },
              transition: 'background-color 0.2s ease'
            }}
         color="primary" onClick={handleConfirmPayment}>
          Confirm Payment
        </Button>
      </Box>
    </Box>
  );
};

export default PayInvoice;
