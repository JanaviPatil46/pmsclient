

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
import ProposalDialog from "../proposals/ProposalDialog";
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
const [accountId, setAccountId] = useState("");
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
        console.log("accounts",response)
        const accountId = response.data.accounts[0]._id;
        console.log("accountid",accountId)
        setAccountId(accountId); // store accountId
      fetchPrprosalsAllData(accountId);
      })
      .catch((error) => console.log(error));
  };

  const fetchPrprosalsAllData = async (accId) => {
    try {
      const url = `${PROPOSAL_API}/proposalandels/proposalaccountwise/proposalbyaccount/${accId}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch proposals");
      const result = await response.json();
      setProposalsList(result.proposalesandelsAccountwise);
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
if (accountId) {
    fetchPrprosalsAllData(accountId); // now refresh with correct ID
  }
  };
const signProposal = async (signatureData) => {
  console.log("signatureData",signatureData)
  try {
    const response = await axios.patch(
      `${PROPOSAL_API}/proposalandels/proposalaccountwise/${signatureData.proposalId}/sign`,
      {
        
        signature: signatureData.signature,
        signedAt: signatureData.signedAt,
          signedBy:signatureData.signedBy
      },
      
    );
 console.log(response)
    return response.data;
   
  } catch (error) {
    console.error('Error signing proposal:', error);
    throw error;
  }
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
          {["Proposal Name", "Status", "Date", "Signed"].map((label, index) => (
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
                  {row.proposalname || "Untitled"}
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

            <TableCell>
              
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
</Box>

      
      <ProposalDialog
  open={openDialog}
  handleClose={handleCloseDialog}
  proposal={selectedProposal}
  onProposalSigned={async (signatureData) => {
    try {
      await signProposal(signatureData);
        toast.success("Signature saved successfully!");
    handleCloseDialog(); // this will refresh the proposals
      // Optionally refresh your proposals list or update state
    } catch (error) {
      console.error('Error signing proposal:', error);
    }
  }}
/>
    </Box>
  );
};

export default Proposals;
