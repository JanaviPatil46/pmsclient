import React, { useState, useEffect } from 'react';
import { CreditCard, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
const BillingList = ({ accountId }) => {
  const INVOICE_API = process.env.REACT_APP_INVOICES_URL;
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
        <div className="px-5 py-3">
          <div className="flex items-center gap-2 mb-2.5">
            <CreditCard size={13} className="text-emerald-500 shrink-0" />
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Billing</span>
            <span className="ml-auto text-[11px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
              {billingInvoices.length}
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {billingInvoices.map((invoice, index) => (
              <div
                key={index}
                onClick={() => handlePayInvoice(invoice)}
                className="group flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background px-3.5 py-2.5 cursor-pointer hover:bg-muted/50 hover:border-border transition-all duration-200"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <CreditCard size={11} className="text-emerald-500 shrink-0" />
                    <p className="text-[12px] font-semibold text-foreground">Pay Invoice ${invoice.summary.total}</p>
                  </div>
                  <p className="text-[12px] text-muted-foreground mt-0.5"># {invoice.invoicenumber}</p>
                </div>
                <ArrowRight size={13} className="shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default BillingList