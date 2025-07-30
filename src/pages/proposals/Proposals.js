// import React, { useState, useContext, useEffect } from "react";
// import {
//   Box,
//   Stack,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   Typography,
// } from "@mui/material";
// import { LoginContext } from "../../context/Context";
// import axios from "axios";
// import ProposalDialog from "../proposals/ProposalDialog"
// const Proposals = () => {
//   const { logindata } = useContext(LoginContext);
//   const [loginuserid, setLoginUserId] = useState("");
//   useEffect(() => {
//     if (logindata?.user?.id) {
//       const id = logindata.user.id;
//       setLoginUserId(id);

//       fetchAccountId(id); // pass the ID directly
//     }
//   }, [logindata]);
//   const fetchAccountId = (id) => {
//     let config = {
//       method: "get",
//       maxBodyLength: Infinity,
//       url: `http://127.0.0.1/accounts/accountdetails/accountdetailslist/listbyuserid/${id}`,
//       headers: {},
//     };

//     axios
//       .request(config)
//       .then((response) => {
//         console.log(response.data);
//         fetchPrprosalsAllData(response.data.accounts[0]._id);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };
//   const [proposalsList, setProposalsList] = useState([]);
//   const fetchPrprosalsAllData = async (accId) => {
//     try {
//       const url = `http://127.0.0.1/proposalandels/proposalaccountwise/proposalbyaccount/${accId}`;

//       const response = await fetch(url);
//       if (!response.ok) {
//         throw new Error("Failed to fetch Proposals templates");
//       }
//       const result = await response.json();
//       console.log(result.proposalesandelsAccountwise);
//       setProposalsList(result.proposalesandelsAccountwise);
//     } catch (error) {
//       console.error("Error fetching Proposals templates:", error);
//     }
//   };
//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedProposal, setSelectedProposal] = useState(null);
//   const handleOpenDialog = (proposal) => {
//     setSelectedProposal(proposal);
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setSelectedProposal(null);
//   };
//   return (
//     <Box
//       sx={{
//         width: "100%",
//         maxWidth: { sm: "100%", md: "1700px" },
//         flexGrow: 1,

//         height: "90vh",
//         p: 1,
//       }}
//     >
//       <Stack>
//         <Typography
//           variant="h4"
//           component="p"
//           gutterBottom
//           sx={{ fontWeight: 600 }}
//         >
//           Proposals & ELs
//         </Typography>
//       </Stack>
//       <Box>
//         <Table sx={{ minWidth: 650 }} aria-label="simple table">
//           <TableHead>
//             <TableRow>
//               <TableCell>
//                 <strong>Proposal Name</strong>
//               </TableCell>
//               <TableCell>
//                 <strong>Status</strong>
//               </TableCell>

//               <TableCell>
//                 <strong>Date</strong>
//               </TableCell>
//               <TableCell>
//                 <strong>Signed</strong>
//               </TableCell>
//               <TableCell>
//                 <strong></strong>
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {proposalsList.map((row) => (
//               <TableRow key={row._id}>
//                 <TableCell>
//                   <Typography
//                     sx={{
//                       color: "#2c59fa",
//                       cursor: "pointer",
//                       fontWeight: "bold",
//                     }}
//                     // onClick={() => handleEdit(row._id, row.accountid._id)}
//                     onClick={() => handleOpenDialog(row)}
//                   >
//                     {row.proposalname}
//                   </Typography>
//                 </TableCell>
//                 <TableCell> </TableCell>

//                 <TableCell>
//                   {new Date(row.createdAt).toLocaleDateString("en-US", {
//                     month: "short",
//                     day: "numeric",
//                   })}
//                 </TableCell>

//                 <TableCell></TableCell>
//                 <TableCell sx={{ textAlign: "end" }}></TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </Box>

//             <ProposalDialog
//   open={openDialog}
//   handleClose={handleCloseDialog}
//   proposal={selectedProposal}
// />
//     </Box>
//   );
// };

// export default Proposals;

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

const Proposals = () => {
  const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_URL
    const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const { logindata } = useContext(LoginContext);
  const [loginuserid, setLoginUserId] = useState("");
  const [proposalsList, setProposalsList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);

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

      {/* <TableContainer elevation={3}>
        <Table sx={{ minWidth: 800 }} aria-label="proposals table">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Proposal Name</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Date</strong>
              </TableCell>
              <TableCell>
                <strong>Signed</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {proposalsList.map((row, index) => (
              <TableRow key={row._id}>
                <TableCell>
                  <Tooltip >
                    <Typography
                      component="h2"
                      variant="subtitle2"
                      sx={{
                        cursor: "pointer",
                      }}
                      onClick={() => handleOpenDialog(row)}
                    >
                      {row.proposalname || "Untitled"}
                    </Typography>
                  </Tooltip>
                </TableCell>

                <TableCell>
                  <Chip
                    label={row.status || "Pending"}
                    color={
                      row.status === "Signed"
                        ? "success"
                        : row.status === "Partially Signed"
                        ? "error"
                        : row.status === "Pending"
                        ? "warning"
                        : "default"
                    }
                    size="small"
                    sx={{ border: "none" }}
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
                  {row.signed ? (
                    <Chip label="Signed" color="primary" size="small" />
                  ) : (
                    <Chip label="Unsigned" variant="outlined" size="small" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}

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

            {/* <TableCell>
              <Chip
                label={row.status}
                color={
                  row.status === "Signed"
                    ? "success"
                    : row.status === "Partially Signed"
                    ? "error"
                    : row.status === "Pending"
                    ? "warning"
                    : "default"
                }
                size="small"
                sx={{ border: "none" }}
              />
            </TableCell> */}
<TableCell>
  <Chip
    label={row.status}
    // color={
    //   row.status === "Signed"
    //     ? "success"
    //     : row.status === "Partially Signed"
    //     ? "error"
    //     : row.status === "Pending"
    //     ? "warning"
    //     : "default"
    // }
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
              {/* {row.signed ? (
                <Chip label="Signed" color="primary" size="small" />
              ) : (
                <Chip label="Unsigned" variant="outlined" size="small" />
              )} */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
</Box>

      {/* <ProposalDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        proposal={selectedProposal}
      /> */}
      <ProposalDialog
  open={openDialog}
  handleClose={handleCloseDialog}
  proposal={selectedProposal}
  onProposalSigned={async (signatureData) => {
    try {
      await signProposal(signatureData);
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
