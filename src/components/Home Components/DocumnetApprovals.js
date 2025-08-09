// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Stack,
//   Chip,
//   Paper,
// } from "@mui/material";

// const DocumentApprovals = ({ accountId }) => {
//   const [clientEmail, setClientEmail] = useState("");
//   const [approvals, setApprovals] = useState([]);

//   const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
//   const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;

//   const fetchAccountDetails = async () => {
//     try {
//       const res = await fetch(
//         `${ACCOUNT_API}/accounts/accountdetails/${accountId}`
//       );
//       const data = await res.json();
//       const email = data.account?.contacts?.[0]?.email || "";
//       setClientEmail(email);
//     } catch (err) {
//       console.error("Failed to fetch account details", err);
//     }
//   };

//   const fetchApprovals = async () => {
//     try {
//       const { data } = await axios.get(
//         `${DOCS_MANAGMENTS}/approvals/client-approvals/${clientEmail}`
//       );
//       setApprovals(data.approvals || []);
//     } catch (error) {
//       console.error("Error fetching approvals:", error);
//     }
//   };

//   const handleAction = async (id, action) => {
//     try {
//       await axios.patch(
//         `${DOCS_MANAGMENTS}/approvals/client-approvals/${id}/${action}`
//       );
//       fetchApprovals();
//     } catch (error) {
//       console.error(`Error ${action} approval:`, error);
//     }
//   };

//   useEffect(() => {
//     if (accountId) {
//       fetchAccountDetails();
//     }
//   }, [accountId]);

//   useEffect(() => {
//     if (clientEmail) {
//       fetchApprovals();
//     }
//   }, [clientEmail]);

//   return (
//     <Paper
//       sx={{
//         p: 2,
//         borderRadius: 2,
//         boxShadow: 1,
//         transition: "all 0.3s",
//         cursor: "pointer",
//         "&:hover .sign-link": {
//           opacity: 1,
//           visibility: "visible",
//           textDecoration: "none",
//           cursor: "pointer",
//         },
//         position: "relative",
//       }}
//     >
//       {approvals.length === 0 ? (
//         <Typography>No pending approvals found.</Typography>
//       ) : (
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell sx={{fontWeight:'bold'}}>Document Name</TableCell>

//                 <TableCell sx={{fontWeight:'bold'}}>Date</TableCell>
//                 <TableCell sx={{fontWeight:'bold'}}>Status</TableCell>
//                 <TableCell sx={{fontWeight:'bold'}}  align="left">Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {approvals.map((doc) => (
//                 <TableRow key={doc._id}>
//                   <TableCell>{doc.filename}</TableCell>

//                   <TableCell>
//                     {new Date(doc.createdAt).toLocaleDateString()}
//                   </TableCell>
//                   <TableCell>
//                     <Chip label={doc.status} color="warning" />
//                   </TableCell>
//                   <TableCell align="left">
//                     <Stack direction="row" spacing={1}>
//                       <Button
//                         variant="contained"
//                         color="success"
//                         size="small"
//                         onClick={() => handleAction(doc._id, "approve")}
//                       >
//                         Approve
//                       </Button>
//                       <Button
//                         variant="outlined"
//                         color="error"
//                         size="small"
//                         onClick={() => handleAction(doc._id, "cancel")}
//                       >
//                         Cancel
//                       </Button>
//                     </Stack>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//     </Paper>
//   );
// };

// export default DocumentApprovals;

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Paper,
  Button,
  Chip,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";

const DocumentApprovals = ({ accountId }) => {
  const [clientEmail, setClientEmail] = useState("");
  const [approvals, setApprovals] = useState([]);

  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;

  const fetchAccountDetails = async () => {
    try {
      const res = await fetch(`${ACCOUNT_API}/accounts/accountdetails/${accountId}`);
      const data = await res.json();
      setClientEmail(data.account?.contacts?.[0]?.email || "");
    } catch (err) {
      console.error("Failed to fetch account details", err);
    }
  };

  const fetchApprovals = async () => {
    try {
      const { data } = await axios.get(
        `${DOCS_MANAGMENTS}/approvals/client-approvals/${clientEmail}`
      );
      setApprovals(data.approvals || []);
    } catch (error) {
      console.error("Error fetching approvals:", error);
    }
  };

 const handleAction = async (id, action) => {
  try {
    await axios.patch(
      `${DOCS_MANAGMENTS}/approvals/client-approvals/${id}`,
      { action } // send action in body
    );
    fetchApprovals();
  } catch (error) {
    console.error(`Error ${action} approval:`, error);
  }
};


  useEffect(() => {
    if (accountId) fetchAccountDetails();
  }, [accountId]);

  useEffect(() => {
    if (clientEmail) fetchApprovals();
  }, [clientEmail]);

  return (
    <>
      {approvals.length > 0 && (
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
              Pending Approvals ({approvals.length})
            </Typography>
          </Stack>

          <Box mt={2}>
            {approvals.map((doc, index) => (
              <Stack key={index} mb={1.5}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                    transition: "all 0.3s",
                    cursor: "pointer",
                    "&:hover .approval-actions": {
                      opacity: 1,
                      visibility: "visible",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <DescriptionIcon
                        fontSize="small"
                        sx={{ color: "#f0c000" }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {doc.filename}
                      </Typography>
                      {/* <Chip
                        label={doc.status}
                        color="warning"
                        size="small"
                        sx={{ ml: 1 }}
                      /> */}
                    </Box>

                    <Stack
                      direction="row"
                      spacing={1}
                      className="approval-actions"
                      sx={{
                        opacity: 0,
                        visibility: "hidden",
                        transition: "all 0.3s",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleAction(doc._id, "approve")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleAction(doc._id, "cancel")}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Box>
                </Paper>
              </Stack>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};

export default DocumentApprovals;
