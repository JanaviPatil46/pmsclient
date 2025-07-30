import {
  Box,
  Typography,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  TableContainer,
  Checkbox,
  Paper,
  Table,Button
} from "@mui/material";
import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { LoginContext } from "../../context/Context";
import { useNavigate } from "react-router-dom";
const Invoices = () => {
  const INVOICE_API = process.env.REACT_APP_INVOICES_URL;
    const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const navigate = useNavigate();
  const { logindata } = useContext(LoginContext);
  const [loginuserid, setLoginUserId] = useState("");
  const [BillingInvoice, setBillingInvoice] = useState([]);
  const [selected, setSelected] = useState([]);
  const [accountName, setAccountName]=useState("")
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
  useEffect(() => {
    if (logindata?.user?.id) {
      const id = logindata.user.id;
      setLoginUserId(id);
      fetchAccountId(id);
    }
  }, [logindata]);
  const fetchAccountId = (id) => {
    axios
      .get(
        `${ACCOUNT_API}/accounts/accountdetails/accountdetailslist/listbyuserid/${id}`
      )
      .then((response) => {
        const accountId = response.data.accounts[0]._id;
        setAccountName(response.data.accounts[0].accountName)
        fetchidwiseData(accountId);
      })
      .catch((error) => console.log(error));
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
 const handlePayInvoice = () => {
  navigate("/client/payinvoice", {
    state: {
      selectedInvoices: BillingInvoice.filter(invoice => selected.includes(invoice._id)),
      accountName: accountName, // Replace with dynamic client/account name if needed
    },
  });
};

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
        flexGrow: 1,
        height: "90vh",
        p: 1,
      }}
    >
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Billing
      </Typography>

      <Box>
        <TableContainer component={Paper} sx={{ overflow: "visible" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  padding="checkbox"
                  sx={{
                    position: "sticky",
                    left: 0,
                    zIndex: 1,

                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  <Checkbox size="small"
                  checked={selected.length === BillingInvoice.length}
                    onChange={() => {
                      if (selected.length === BillingInvoice.length) {
                        setSelected([]);
                      } else {
                        const allSelected = BillingInvoice.map(
                          (item) => item._id
                        );
                        setSelected(allSelected);
                      }
                    }}
                     />
                </TableCell>
                {[
                  "Invoice #",
                  "Status",
                  "Posted",
                  "Total",
                  "Amount Paid",
                  "Balance due",
                  "Last Paid",
                  "Description",
                ].map((label, index) => (
                  <TableCell
                    key={index}
                    sx={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      padding: "16px",
                      minWidth: index === 7 ? 100 : 100,
                    }}
                  >
                    {label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {BillingInvoice.map((invoice) => {
                const isSelected = selected.indexOf(invoice._id) !== -1;
                return (
                  <TableRow
                    key={invoice._id}
                    hover
                    onClick={() => handleSelect(invoice._id)}
                    role="checkbox"
                    tabIndex={-1}
                    selected={isSelected}
                    sx={{
                      cursor: "pointer",
                      // transition: "background-color 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#f4f4f4", // Add hover effect
                      },
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox size="small" checked={isSelected} />
                    </TableCell>
                    <TableCell>{invoice.invoicenumber}</TableCell>
                    <TableCell>{invoice.invoiceStatus || "N/A"}</TableCell>
                    <TableCell>
                      {new Date(invoice.invoicedate).toLocaleDateString(
                        "en-US"
                      )}
                    </TableCell>
                    <TableCell>
                      ${invoice.summary?.total?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell>
                      {invoice.paidAmount !== null
                        ? `$${invoice.paidAmount.toFixed(2)}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {invoice.balanceDueAmount !== null
                        ? `$${invoice.balanceDueAmount.toFixed(2)}`
                        : `$${invoice.summary?.total?.toFixed(2) || "0.00"}`}
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>{invoice.description}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box mt={3} mb={2}>
        {selected.length > 0 && (
          <Button
            // variant="contained"
            size="small"
            color="primary"
            onClick={handlePayInvoice}
           sx={{
              backgroundColor: 'text.menu',
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'menu.dark',
                boxShadow: 1,
              },
              transition: 'background-color 0.2s ease'
            }}
          >
            Pay Invoice
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Invoices;
