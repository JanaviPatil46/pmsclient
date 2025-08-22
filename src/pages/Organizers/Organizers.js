import React, { useState, useContext, useEffect } from "react";
import { LoginContext } from "../../context/Context";
import axios from "axios";
import {
  Tooltip,
  Box,
  Typography,
  Chip,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,Paper
} from "@mui/material";
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
        fetchOrganizers(accountId);
      })
      .catch((error) => console.log(error));
  };
  // const [organizersData, setOrganizersData] = useState([]);
  const [isActiveTrue, setIsActiveTrue] = useState(true);
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
  // useEffect(() => {
  //     fetchOrganizerTemplates(accountId);
  // }, [accountId]);

  const handleOpenDialog = (organizer) => {
    setSelectedOrganizer(organizer);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrganizer(null);
    // fetchOrganizers();
  };
  return (
    <Box sx={{ width: "100%", maxWidth: "1700px", p: 2 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Organizers
      </Typography>

      
      <Box>
  <TableContainer component={Paper} sx={{ overflow: "visible" }}>
    <Table>
      <TableHead>
        <TableRow>
          {[
            "Organizer Name",
            "Seal",
            "Status",
            "Date"
          ].map((label, index) => (
            <TableCell
              key={index}
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                padding: "16px",
                minWidth: 120,
              }}
            >
              {label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>

      <TableBody>
        {organizersList.map((row) => (
          <TableRow
            key={row._id}
            hover
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#f4f4f4",
              },
            }}
          >
            <TableCell>
              <Tooltip title="View Details">
                <Typography
                  component="h2"
                  variant="subtitle2"
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleOpenDialog(row)}
                >
                  {row.organizerName || "Untitled"}
                </Typography>
              </Tooltip>
            </TableCell>

            <TableCell>
              {row.issealed === true && (
                <Chip
                  label="Sealed"
                  color="#fff"
                 
                  size="small"
                  sx={{ 
      border: "none",
       backgroundColor:"#5C6BC0",
        // backgroundColor: "#0000FF",
         color:"#fff"
        // color: theme => theme.palette.getContrastText(theme.palette.warning.light)
      
     
    }}
                />
              )}
            </TableCell>

            <TableCell>
              <Chip
                label={row.status}
              
                color="#fff"
                size="small"
             sx={{ 
      border: "none",
      ...(row.status === "Pending" && {
        // backgroundColor: "#ffc107",
        backgroundColor:"#FFA726",
         color:"#fff"
        // color: theme => theme.palette.getContrastText(theme.palette.warning.light)
      }),
      ...(row.status === "Completed" && {
        // backgroundColor: "#008000",
        backgroundColor:"#2E7D32",
      color:"#fff"
        // color: theme => theme.palette.getContrastText(theme.palette.warning.light)
      }), ...(row.status === "In Progress" && {
        backgroundColor: "#1976D2", // or any color you prefer for "In Progress"
        color: "#fff"
      })
    }}
              />
            </TableCell>

            <TableCell>
              {new Date(row.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
</Box>

      <OrganizerDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        organizer={selectedOrganizer}
      />
    </Box>
  );
};

export default Organizers;
