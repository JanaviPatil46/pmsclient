import React, { useState, useContext, useEffect } from "react";
import { LoginContext } from "../../context/Context";
import axios from "axios";
import OrganizerDialog from "./OrganizerDialog";
import { ClipboardList } from "lucide-react";
import { motion } from "framer-motion";
import { PageTransition, TableSkeletonRows } from "../../components/ui/motion";
const Organizers = () => {
  const ORGANIZER_API = process.env.REACT_APP_ORGANIZER_TEMP_URL
     const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const { logindata } = useContext(LoginContext);
  const [loginuserid, setLoginUserId] = useState("");
  const [organizersList, setOrganizersList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (logindata?.user?.id) {
      const id = logindata.user.id;
      setLoginUserId(id);
      // fetchAccountId(id);
    }
  }, [logindata]);
  // const fetchAccountId = (id) => {
  //   axios
  //     .get(
  //       `${ACCOUNT_API}/accounts/accountdetails/accountdetailslist/listbyuserid/${id}`
  //     )
  //     .then((response) => {
  //       const accountId = response.data.accounts[0]._id;
  //       fetchOrganizers(accountId);
  //     })
  //     .catch((error) => console.log(error));
  // };
  // const [organizersData, setOrganizersData] = useState([]);
  const [isActiveTrue, setIsActiveTrue] = useState(true);
     const [accountId, setAccountId] = useState(sessionStorage.getItem("accountId"));

  const fetchOrganizers = async (accountId) => {
    try {
      setIsLoading(true);
      const url = `${ORGANIZER_API}/workflow/orgaccwise/organizeraccountwise/organizerbyaccount/${accountId}/${isActiveTrue}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch organizerTemplatesData");
      }
      const data = await response.json();
      console.log(data);
      setOrganizersList(data.organizerAccountWise);
    } catch (error) {
      console.error("Error fetching organizerTemplatesData:", error);
    } finally {
      setIsLoading(false);
    }
  };
   useEffect(() => {
    // if (loginUserId) {
      fetchOrganizers(accountId);
    // }
  }, [accountId]);

  const handleOpenDialog = (organizer) => {
    setSelectedOrganizer(organizer);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrganizer(null);
    fetchOrganizers(accountId);
    
  };
  return (
    <PageTransition className="w-full max-w-[1700px] flex-1 h-[90vh] overflow-auto">
      <div className="p-4 sm:p-6 flex flex-col gap-5">

        {/* Page header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <ClipboardList size={16} className="text-primary" strokeWidth={1.8} />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Organizers</h1>
            {organizersList.length > 0 && (
              <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground border border-border">
                {organizersList.length}
              </span>
            )}
          </div>
          <p className="text-[13px] text-muted-foreground pl-10">Review and complete your tax organizers.</p>
        </div>

        {/* Table card */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {["Organizer Name", "Seal", "Status", "Date"].map((label) => (
                    <th key={label} className="px-4 py-3.5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-widest min-w-[120px]">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {isLoading ? (
                  <TableSkeletonRows rows={5} cols={4} />
                ) : organizersList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                          <ClipboardList size={22} className="text-muted-foreground" strokeWidth={1.5} />
                        </div>
                        <p className="text-sm font-medium text-foreground">No organizers found</p>
                        <p className="text-[13px] text-muted-foreground">Your organizers will appear here once assigned.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  organizersList.map((row, rowIndex) => (
                    <motion.tr
                      key={row._id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18, delay: rowIndex * 0.04, ease: [0.16, 1, 0.3, 1] }}
                      className="cursor-pointer transition-colors duration-150 hover:bg-muted/40 group"
                      onClick={() => handleOpenDialog(row)}
                    >
                      <td className="px-4 py-3.5">
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {row.organizerName || "Untitled"}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        {row.issealed === true && (
                          <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                            Sealed
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                            row.status === "Pending"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                              : row.status === "Completed"
                              ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30"
                              : row.status === "In Progress"
                              ? "bg-primary/10 text-primary border-primary/30"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-[13px] text-muted-foreground">
                        {new Date(row.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <OrganizerDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        organizer={selectedOrganizer}
      />
    </PageTransition>
  );
};

export default Organizers;
