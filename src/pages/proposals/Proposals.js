

import { useState, useContext, useEffect } from "react";
import {
  Box,

  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Paper,
  TableContainer,
  Chip,
  Tooltip,
} from "@mui/material";
import { LoginContext } from "../../context/Context";
import axios from "axios";
import ProposalPreviewDialog from "../proposals//ProposalPreviewDialog";
import { data } from "react-router-dom";
import { toast } from "material-react-toastify";
const Proposals = () => {
  const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_URL
    const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const { logindata } = useContext(LoginContext);
  const [loginuserid, setLoginUserId] = useState("");
  const [proposalsList, setProposalsList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
const [accountId, setAccountId] = useState(sessionStorage.getItem("accountId"));
 useEffect(() => {
  if (accountId) {
    fetchPrprosalsAllData(accountId);
  }
}, [accountId]);

  const fetchPrprosalsAllData = async (accId) => {
    try {
      const url = `https://www.snptaxes.com/account/proposals/byaccount/${accId}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch proposals");
      const result = await response.json();
      console.log("result",result)
      setProposalsList(result.proposallist);
    } catch (error) {
      console.error("Error fetching proposals:", error);
    }
  };

  const handleOpenDialog = (proposal) => {
    setSelectedProposal(proposal);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProposal(null);
fetchPrprosalsAllData(accountId);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "1700px", p: 2 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Proposals & ELs
      </Typography>

     

<Box>
  <TableContainer component={Paper} sx={{ overflow: "visible" }}>
    <Table sx={{ minWidth: 800 }} aria-label="proposals table">
      <TableHead>
        <TableRow>
          {["Proposal Name", "Status", "Date", ].map((label, index) => (
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
        {proposalsList.map((row) => (
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
                  {row.general.proposalName || "Untitled"}
                </Typography>
              </Tooltip>
            </TableCell>

<TableCell>
  <Chip
    label={row.status}
   
         color="#fff"
    sx={{ 
      border: "none",
      ...(row.status === "Pending" && {
        // backgroundColor: "#ffc107",
        backgroundColor:"#FFA726",
           color:"#fff"
       
      }),
       ...(row.status === "Signed" && {
        // backgroundColor: "#008000",
        backgroundColor:"#0288D1",
            color:"#fff"
        
      }),
       ...(row.status === "Partially Signed" && {
        // backgroundColor: "#FF0000",
        backgroundColor:'#FBC02D',
        color:"#fff"
       
      })
    }}
    size="small"
  />
</TableCell>
            <TableCell>
              {new Date(row.createdAt).toLocaleDateString("en-US", {
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

      
     <ProposalPreviewDialog
    open={openDialog}
    handleClose={handleCloseDialog}
    proposal={selectedProposal}
  />
    </Box>
  );
};

export default Proposals;
