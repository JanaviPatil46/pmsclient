import React, { useState, useContext, useEffect } from "react";
import { LoginContext } from "../../context/Context";
import axios from "axios";
import OrganizerDialog from "./OrganizerDialog";
const Organizers = () => {
  const ORGANIZER_API = process.env.REACT_APP_ORGANIZER_TEMP_URL
     const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const { logindata } = useContext(LoginContext);
  const [loginuserid, setLoginUserId] = useState("");
  const [organizersList, setOrganizersList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
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
      const url = `${ORGANIZER_API}/workflow/orgaccwise/organizeraccountwise/organizerbyaccount/${accountId}/${isActiveTrue}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch organizerTemplatesData");
      }
      const data = await response.json();
      console.log(data);
      setOrganizersList(data.organizerAccountWise);
      console.log(data.organizerAccountWise[0]._id);
    } catch (error) {
      console.error("Error fetching organizerTemplatesData:", error);
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
    <div className="w-full max-w-[1700px] overflow-auto p-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Organizers</h1>
          {organizersList.length > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5">{organizersList.length} organizer{organizersList.length !== 1 ? "s" : ""}</p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/60">
              {["Organizer Name", "Seal", "Status", "Date"].map((label, index) => (
                <th key={index} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[120px]">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {organizersList.map((row) => (
              <tr
                key={row._id}
                className="cursor-pointer transition-colors hover:bg-muted/40"
              >
                <td className="px-4 py-3">
                  <span
                    title="View Details"
                    className="text-sm font-medium text-primary cursor-pointer hover:underline"
                    onClick={() => handleOpenDialog(row)}
                  >
                    {row.organizerName || "Untitled"}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {row.issealed === true && (
                    <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                      Sealed
                    </span>
                  )}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      row.status === "Pending"
                        ? "bg-warning/15 text-warning border border-warning/30"
                        : row.status === "Completed"
                        ? "bg-green-500/15 text-green-700 dark:text-green-400 border border-green-500/30"
                        : row.status === "In Progress"
                        ? "bg-primary/10 text-primary border border-primary/30"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>

                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(row.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <OrganizerDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        organizer={selectedOrganizer}
      />
    </div>
  );
};

export default Organizers;
