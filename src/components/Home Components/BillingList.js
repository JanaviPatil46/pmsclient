import React, { useState,useEffect } from 'react'
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import {  Stack, Typography } from "@mui/material";
import PaymentIcon from '@mui/icons-material/Payment';
import { useNavigate } from "react-router-dom";
const BillingList = ({ accountId }) => {
  const INVOICE_API = process.env.REACT_APP_INVOICES_URL
  const theme = useTheme();
    const navigate = useNavigate();
  const [billingInvoices, setBiilingInvoices] = useState([])
   const fetchInvoices = async () => {
      try {
        const url = `${INVOICE_API}/workflow/invoices/invoice/pending/invoicelistby/accountid/${accountId}`;
  
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch invoices");
        }
        const data = await response.json();
        console.log("invoice",data);
        setBiilingInvoices(data.invoice);
       
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };
    useEffect(() => {
      if (accountId) {
        fetchInvoices();
      }
    }, [accountId]);
console.log("billing", billingInvoices)

const handlePayInvoice = (invoice) => {
  navigate("/client/payinvoice", {
    state: {
      selectedInvoices: [invoice],
      accountName: invoice.account.accountName, // Replace with dynamic client/account name if needed
    },
  });
};
  return (
    <>
    {billingInvoices.length > 0 && (
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
              Billing ({billingInvoices.length})
            </Typography>
          </Stack>
          <Box mt={2}>
            {billingInvoices.map((invoice, index) => (
              <Stack key={index} mb={1.5}>
                {" "}
                <Paper
          onClick={() => handlePayInvoice(invoice)}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                   
                    transition: "all 0.3s",
                    cursor: "pointer",
                    "&:hover .paysign-link": {
                      opacity: 1,
                      visibility: "visible",
                      textDecoration: "none",
                      cursor: "pointer",
                    },
                  }}
                >
                  <Box
                    display="flex" alignItems="center" gap={1}
                  >
                  <PaymentIcon fontSize="small" sx={{color: theme.palette.success.main,}}/>
                  <Typography component="h2" variant="subtitle2" >
                    Pay Invoice ${invoice.summary.total}
                  </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", cursor: "pointer" }}
                      >
                     # {invoice.invoicenumber}
                      </Typography>
                    </Box>
                    <Typography
                      className="paysign-link"
                      color="primary"
                      variant="subtitle2"
                      component="p"
                      fontWeight="600"
                      sx={{
                        fontSize: 14,
                        opacity: 0,
                        visibility: "hidden",
                        transition: "all 0.3s",
                        textDecoration: "none",
                        cursor: "pointer",
                      }}
                    >
                     Pay
                    </Typography>
                  </Box>
                </Paper>
              </Stack>
            ))}
          </Box>
        </Box>
    )}

    </>
  )
}

export default BillingList