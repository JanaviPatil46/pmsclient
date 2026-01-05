import React, { useEffect, useState } from "react";
import { DocusealForm } from "@docuseal/react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// const DocuSealMultiSigner = ({ accountId }) => {
//   const [submissions, setSubmissions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedSlug, setSelectedSlug] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);

//   const SIGNATURE_API = process.env.REACT_APP_ESIGNATURE_API;

//   const targetEmail = sessionStorage.getItem("email");

//   // ⭐ FETCH SIGNATURE LIST DIRECTLY HERE
//   useEffect(() => {
//     const fetchSignatureList = async () => {
//       try {
//         const response = await fetch(
//           `https://snptaxes.com/signautrelist/${accountId}`
//         );

//         const result = await response.json();
//         console.log("Fetched signature submissions:", result);

//         setSubmissions(result);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching signature list:", error);
//         setLoading(false);
//       }
//     };

//     if (accountId) {
//       fetchSignatureList();
//     }
//   }, [accountId]);

//   const handleOpenDialog = (slug) => {
//     setSelectedSlug(slug);
//     setDialogOpen(true);
//   };

//   const handleCloseDialog = () => {
//     setDialogOpen(false);
//     setSelectedSlug(null);
//   };

//   const updateStatus = async (item, statusType, newValue) => {
//     try {
//       if (!item?.path) return alert("Invalid item selected");

//       const body = {
//         targetPath: item.path,
//         status: { [statusType]: newValue },
//       };

//       const res = await fetch(
//         "https://www.snptaxes.com/api/accountsdoc/updateStatus",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(body),
//         }
//       );

//       const data = await res.json();

//       if (res.ok) {
//         alert(data.message || "Status updated successfully");
//       } else {
//         alert(data.error || "Failed to update status");
//       }
//     } catch (err) {
//       console.error("Error updating status:", err);
//       alert("Error updating status");
//     }
//   };

//   // ⭐ Extract only submitters that match the logged-in email
//   const matchingSubmitters = submissions
//     .flatMap((submission) =>
//       submission.submitters.map((s) => ({
//         slug: s.slug,
//         email: s.email,
//         submissionId: s.submission_id,
//         templateName: s.name,
//         createdAt: submission.createdAt,
//         fileUrl: submission.fileUrl,
//       }))
//     )
//     .filter((s) => s.email === targetEmail);
// console.log("matchingSubmitters", matchingSubmitters);
//   if (loading) return <p>Loading...</p>;

//   if (matchingSubmitters.length === 0)
//     return <p></p>;

//   return (
//     <>
//       <Box>
//         <Typography
//           component="h2"
//           variant="subtitle2"
//           gutterBottom
//           sx={{ fontWeight: "600" }}
//         >
//           Documents ({matchingSubmitters.length})
//         </Typography>

//         <Box
//           style={{
//             display: "flex",
//             flexWrap: "wrap",
//             gap: "20px",
//             marginTop: "5px",
//           }}
//         >
//           {matchingSubmitters.map((s, index) => (
//             <Card key={index} style={{ minWidth: 200 }}>
//               <CardContent>
//                 <Typography variant="body2">
//                   Template: {s.templateName}
//                 </Typography>

//                 <br />
//                 <Button
//                   size="small"
//                   color="primary"
//                   onClick={() => handleOpenDialog(s.slug)}
//                   sx={{
//                     backgroundColor: "text.menu",
//                     color: "primary.contrastText",
//                     "&:hover": {
//                       backgroundColor: "menu.dark",
//                     },
//                     transition: "background-color 0.2s ease",
//                   }}
//                 >
//                   Review and Sign
//                 </Button>
//               </CardContent>
//             </Card>
//           ))}
//         </Box>

//         <Dialog
//           open={dialogOpen}
//           onClose={handleCloseDialog}
//           fullWidth
//           maxWidth="lg"
//         >
//           <DialogTitle>
//             Signing Form
//             <IconButton
//               aria-label="close"
//               onClick={handleCloseDialog}
//               sx={{
//                 position: "absolute",
//                 right: 8,
//                 top: 8,
//                 color: (theme) => theme.palette.grey[500],
//               }}
//             >
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>

//           <DialogContent dividers>
//             {selectedSlug && (
//               <DocusealForm
//                 src={`https://docuseal.com/s/${selectedSlug}`}
//                 email={targetEmail}
//                 onComplete={async (data) => {
//                   console.log("Post-sign data:", data);

//                   try {
//                     // 1️⃣ Update e-sign status
//                     const updateEsignRes = await fetch(
//                       `${SIGNATURE_API}/signautrelist/update/${data.template.external_id}`,
//                       {
//                         method: "PATCH",
//                         headers: { "Content-Type": "application/json" },
//                         body: JSON.stringify({
//                           status: "completed",
//                           submissionId: data.submission_id,
//                         }),
//                       }
//                     );

//                     const updateEsignData = await updateEsignRes.json();

//                     // 2️⃣ Extract parent folder path
//                     const fullPath = decodeURIComponent(
//                       updateEsignData.fileUrl.split("/uploads/accounts/")[1]
//                     );
//                     const parentFolderPath = fullPath
//                       .split("/")
//                       .slice(0, -1)
//                       .join("/");

//                     await updateStatus(
//                       { path: parentFolderPath },
//                       "signStatus",
//                       "signatureCompleted"
//                     );

//                     // 3️⃣ Notify admin
//                     await fetch(`${SIGNATURE_API}/notify-admin`, {
//                       method: "POST",
//                       headers: { "Content-Type": "application/json" },
//                       body: JSON.stringify({
//                         clientName: targetEmail,
//                         documentName: selectedSlug,
//                       }),
//                     });

//                   } catch (err) {
//                     console.error(
//                       "Error handling post-sign actions",
//                       err
//                     );
//                     alert("Error while updating sign status.");
//                   }

//                   handleCloseDialog();
//                 }}
//               />
//             )}
//           </DialogContent>
//         </Dialog>
//       </Box>
//     </>
//   );
// };
// const DocuSealMultiSigner = ({ accountId }) => {
//   const [submissions, setSubmissions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedSlug, setSelectedSlug] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);

//   const SIGNATURE_API = process.env.REACT_APP_ESIGNATURE_API;
//   const targetEmail = sessionStorage.getItem("email");

//   useEffect(() => {
//     const fetchSignatureList = async () => {
//       try {
//         const response = await fetch(
//           `https://snptaxes.com/signautrelist/${accountId}`
//         );
//         const result = await response.json();
//         console.log("Fetched signature submissions:", result);
//         setSubmissions(result);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching signature list:", error);
//         setLoading(false);
//       }
//     };

//     if (accountId) {
//       fetchSignatureList();
//     }
//   }, [accountId]);

//   const handleOpenDialog = (slug) => {
//     setSelectedSlug(slug);
//     setDialogOpen(true);
//   };

//   const handleCloseDialog = () => {
//     setDialogOpen(false);
//     setSelectedSlug(null);
//   };

//   const updateStatus = async (item, statusType, newValue) => {
//     try {
//       if (!item?.path) return alert("Invalid item selected");

//       const body = {
//         targetPath: item.path,
//         status: { [statusType]: newValue },
//       };

//       const res = await fetch(
//         "https://www.snptaxes.com/api/accountsdoc/updateStatus",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(body),
//         }
//       );

//       const data = await res.json();

//       if (res.ok) {
//         alert(data.message || "Status updated successfully");
//       } else {
//         alert(data.error || "Failed to update status");
//       }
//     } catch (err) {
//       console.error("Error updating status:", err);
//       alert("Error updating status");
//     }
//   };

//   // Check if all submitters have completed signing for a submission
//   const checkAllSubmittersCompleted = (submission) => {
//     return submission.submitters.every(submitter =>
//       submitter.status === 'completed' || submitter.completed_at !== null
//     );
//   };

//   // Extract submitters that match the logged-in email AND are not completed
//   const matchingSubmitters = submissions
//     .flatMap((submission) =>
//       submission.submitters.map((s) => ({
//         slug: s.slug,
//         email: s.email,
//         submissionId: s.submission_id,
//         templateName: s.name,
//         createdAt: submission.createdAt,
//         fileUrl: submission.fileUrl,
//         externalId: submission.externalId,
//         submissionData: submission, // Include full submission data
//         status: s.status,
//         completed_at: s.completed_at,
//         allCompleted: checkAllSubmittersCompleted(submission)
//       }))
//     )
//     .filter((s) => s.email === targetEmail && !s.completed_at);

//   console.log("matchingSubmitters", matchingSubmitters);

//   if (loading) return <p>Loading...</p>;

//   if (matchingSubmitters.length === 0) {
//     // Show completed documents or pending for other signers
//     const allUserSubmissions = submissions
//       .flatMap((submission) =>
//         submission.submitters.map((s) => ({
//           slug: s.slug,
//           email: s.email,
//           submissionId: s.submission_id,
//           templateName: s.name,
//           createdAt: submission.createdAt,
//           fileUrl: submission.fileUrl,
//           status: s.status,
//           completed_at: s.completed_at,
//           allCompleted: checkAllSubmittersCompleted(submission),
//           role: s.role
//         }))
//       )
//       .filter((s) => s.email === targetEmail);

//     return (
//       <Box>
//         <Typography component="h2" variant="subtitle2" gutterBottom sx={{ fontWeight: "600" }}>
//           Documents
//         </Typography>
//         <Box style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "5px" }}>
//           {allUserSubmissions.map((s, index) => (
//             <Card key={index} style={{ minWidth: 200 }}>
//               <CardContent>
//                 <Typography variant="body2">
//                   Template: {s.templateName}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                   Status: {s.completed_at ? 'Signed' : 'Pending'}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                   Overall: {s.allCompleted ? 'All Signed' : 'Waiting for others'}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                   Role: {s.role}
//                 </Typography>
//               </CardContent>
//             </Card>
//           ))}
//         </Box>
//       </Box>
//     );
//   }

//   return (
//     <>
//       <Box>
//         <Typography component="h2" variant="subtitle2" gutterBottom sx={{ fontWeight: "600" }}>
//           Documents Pending Your Signature ({matchingSubmitters.length})
//         </Typography>

//         <Box style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "5px" }}>
//           {matchingSubmitters.map((s, index) => (
//             <Card key={index} style={{ minWidth: 200 }}>
//               <CardContent>
//                 <Typography variant="body2">
//                   Template: {s.templateName}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                   Status: {s.completed_at ? 'Completed' : 'Pending your signature'}
//                 </Typography>
//                 <br />
//                 <Button
//                   size="small"
//                   color="primary"
//                   onClick={() => handleOpenDialog(s.slug)}
//                   sx={{
//                     backgroundColor: "text.menu",
//                     color: "primary.contrastText",
//                     "&:hover": {
//                       backgroundColor: "menu.dark",
//                     },
//                     transition: "background-color 0.2s ease",
//                   }}
//                 >
//                   Review and Sign
//                 </Button>
//               </CardContent>
//             </Card>
//           ))}
//         </Box>

//         <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="lg">
//           <DialogTitle>
//             Signing Form
//             <IconButton
//               aria-label="close"
//               onClick={handleCloseDialog}
//               sx={{
//                 position: "absolute",
//                 right: 8,
//                 top: 8,
//                 color: (theme) => theme.palette.grey[500],
//               }}
//             >
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>

//           <DialogContent dividers>
//             {selectedSlug && (
//               <DocusealForm
//                 src={`https://docuseal.com/s/${selectedSlug}`}
//                 email={targetEmail}
//                 onComplete={async (data) => {
//                   console.log("Post-sign data:", data);

//                   try {
//                     // Check if all submitters have completed
//                     const checkCompletionRes = await fetch(
//                       `${SIGNATURE_API}/signautrelist/check-completion/${data.template.external_id}`
//                     );

//                     const completionData = await checkCompletionRes.json();

//                     let finalStatus = "in_progress";
//                     if (completionData.allCompleted) {
//                       finalStatus = "completed";
//                     }

//                     // Update e-sign status
//                     const updateEsignRes = await fetch(
//                       `${SIGNATURE_API}/signautrelist/update/${data.template.external_id}`,
//                       {
//                         method: "PATCH",
//                         headers: { "Content-Type": "application/json" },
//                         body: JSON.stringify({
//                           status: finalStatus,
//                           submissionId: data.submission_id,
//                         }),
//                       }
//                     );

//                     const updateEsignData = await updateEsignRes.json();

//                     // Only update file status and notify admin when ALL have signed
//                     if (completionData.allCompleted) {
//                       // Extract parent folder path
//                       const fullPath = decodeURIComponent(
//                         updateEsignData.fileUrl.split("/uploads/accounts/")[1]
//                       );
//                       const parentFolderPath = fullPath
//                         .split("/")
//                         .slice(0, -1)
//                         .join("/");

//                       await updateStatus(
//                         { path: parentFolderPath },
//                         "signStatus",
//                         "signatureCompleted"
//                       );

//                       // Notify admin
//                       await fetch(`${SIGNATURE_API}/notify-admin`, {
//                         method: "POST",
//                         headers: { "Content-Type": "application/json" },
//                         body: JSON.stringify({
//                           clientName: targetEmail,
//                           documentName: selectedSlug,
//                         }),
//                       });
//                     }

//                   } catch (err) {
//                     console.error("Error handling post-sign actions", err);
//                     alert("Error while updating sign status.");
//                   }

//                   handleCloseDialog();
//                   // Refresh the data
//                   // window.location.reload();
//                 }}
//               />
//             )}
//           </DialogContent>
//         </Dialog>
//       </Box>
//     </>
//   );
// };
// const DocuSealMultiSigner = ({ accountId }) => {
//   const [submissions, setSubmissions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedSlug, setSelectedSlug] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);

//   const SIGNATURE_API = process.env.REACT_APP_ESIGNATURE_API;
//   const targetEmail = sessionStorage.getItem("email");

//   useEffect(() => {
//     const fetchSignatureList = async () => {
//       try {
//         const response = await fetch(
//           `https://snptaxes.com/signautrelist/${accountId}`
//         );
//         const result = await response.json();
//         console.log("Fetched signature submissions:", result);
//         setSubmissions(result);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching signature list:", error);
//         setLoading(false);
//       }
//     };

//     if (accountId) {
//       fetchSignatureList();
//     }
//   }, [accountId]);

//   const handleOpenDialog = (slug) => {
//     setSelectedSlug(slug);
//     setDialogOpen(true);
//   };

//   const handleCloseDialog = () => {
//     setDialogOpen(false);
//     setSelectedSlug(null);
//   };

//   const updateStatus = async (item, statusType, newValue) => {
//     try {
//       if (!item?.path) return alert("Invalid item selected");

//       const body = {
//         targetPath: item.path,
//         status: { [statusType]: newValue },
//       };

//       const res = await fetch(
//         "https://www.snptaxes.com/api/accountsdoc/updateStatus",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(body),
//         }
//       );

//       const data = await res.json();

//       if (res.ok) {
//         console.log("Status updated successfully:", data.message);
//       } else {
//         alert(data.error || "Failed to update status");
//       }
//     } catch (err) {
//       console.error("Error updating status:", err);
//       alert("Error updating status");
//     }
//   };

//   // Extract submitters that match the logged-in email AND are not completed
//   const matchingSubmitters = submissions
//     .flatMap((submission) =>
//       submission.submitters.map((s) => ({
//         slug: s.slug,
//         email: s.email,
//         submissionId: s.submission_id,
//         templateName: s.name,
//         createdAt: submission.createdAt,
//         fileUrl: submission.fileUrl,
//         externalId: submission.externalId,
//         submissionData: submission,
//         status: s.status,
//         completed_at: s.completed_at,
//         role: s.role,
//         // Check if all submitters have completed
//         allCompleted: submission.submitters.every(submitter =>
//           submitter.status === 'completed' || submitter.completed_at !== null
//         )
//       }))
//     )
//     .filter((s) => s.email === targetEmail && !s.completed_at);

//   console.log("matchingSubmitters", matchingSubmitters);

//   if (loading) return <p>Loading...</p>;

//   // Show all documents related to the user with their status
//   const allUserSubmissions = submissions
//     .flatMap((submission) =>
//       submission.submitters.map((s) => ({
//         slug: s.slug,
//         email: s.email,
//         submissionId: s.submission_id,
//         templateName: s.name,
//         createdAt: submission.createdAt,
//         fileUrl: submission.fileUrl,
//         externalId: submission.externalId,
//         status: s.status,
//         completed_at: s.completed_at,
//         role: s.role,
//         allCompleted: submission.submitters.every(submitter =>
//           submitter.status === 'completed' || submitter.completed_at !== null
//         ),
//         totalSubmitters: submission.submitters.length,
//         completedCount: submission.submitters.filter(sub =>
//           sub.status === 'completed' || sub.completed_at !== null
//         ).length
//       }))
//     )
//     .filter((s) => s.email === targetEmail);

//   return (
//     <>
//       <Box>
//         <Typography component="h2" variant="subtitle2" gutterBottom sx={{ fontWeight: "600" }}>
//           Documents
//         </Typography>

//         {/* Pending Signatures */}
//         {matchingSubmitters.length > 0 && (
//           <>
//             <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
//               Pending Your Signature ({matchingSubmitters.length})
//             </Typography>
//             <Box style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "5px" }}>
//               {matchingSubmitters.map((s, index) => (
//                 <Card key={index} style={{ minWidth: 200 }}>
//                   <CardContent>
//                     <Typography variant="body2">
//                       Template: {s.templateName}
//                     </Typography>
//                     <Typography variant="body2" color="textSecondary">
//                       Role: {s.role}
//                     </Typography>
//                     <Typography variant="body2" color="textSecondary">
//                       Progress: {s.submissionData.submitters.filter(sub => sub.completed_at).length} of {s.submissionData.submitters.length} signed
//                     </Typography>
//                     <br />
//                     <Button
//                       size="small"
//                       color="primary"
//                       onClick={() => handleOpenDialog(s.slug)}
//                       sx={{
//                         backgroundColor: "text.menu",
//                         color: "primary.contrastText",
//                         "&:hover": {
//                           backgroundColor: "menu.dark",
//                         },
//                         transition: "background-color 0.2s ease",
//                       }}
//                     >
//                       Review and Sign
//                     </Button>
//                   </CardContent>
//                 </Card>
//               ))}
//             </Box>
//           </>
//         )}

//         {/* All User Documents */}
//         <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
//           All Documents ({allUserSubmissions.length})
//         </Typography>
//         <Box style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "5px" }}>
//           {allUserSubmissions.map((s, index) => (
//             <Card key={index} style={{ minWidth: 200 }}>
//               <CardContent>
//                 <Typography variant="body2">
//                   Template: {s.templateName}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                   Your Status: {s.completed_at ? '✓ Signed' : '⏳ Pending'}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                   Overall: {s.allCompleted ? '✓ All Signed' : ` ${s.completedCount}/${s.totalSubmitters} signed`}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                   Role: {s.role}
//                 </Typography>
//               </CardContent>
//             </Card>
//           ))}
//         </Box>

//         <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="lg">
//           <DialogTitle>
//             Signing Form
//             <IconButton
//               aria-label="close"
//               onClick={handleCloseDialog}
//               sx={{
//                 position: "absolute",
//                 right: 8,
//                 top: 8,
//                 color: (theme) => theme.palette.grey[500],
//               }}
//             >
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>

//           <DialogContent dividers>
//             {selectedSlug && (
//               <DocusealForm
//                 src={`https://docuseal.com/s/${selectedSlug}`}
//                 email={targetEmail}
//                 onComplete={async (data) => {
//                   console.log("Post-sign data:", data);

//                   try {
//                     // 1️⃣ Update this specific submitter's status to completed
//                     const updateSubmitterRes = await fetch(
//                       `${SIGNATURE_API}/signautrelist/update-submitter/${data.template.external_id}`,
//                       {
//                         method: "PATCH",
//                         headers: { "Content-Type": "application/json" },
//                         body: JSON.stringify({
//                           submitterEmail: targetEmail,
//                           submissionId: data.submission_id,
//                         }),
//                       }
//                     );

//                     const updateData = await updateSubmitterRes.json();

//                     // 2️⃣ Check if ALL submitters have now completed
//                     if (updateData.allCompleted) {
//                       console.log("🎉 All submitters have completed signing!");

//                       // Extract parent folder path
//                       const fullPath = decodeURIComponent(
//                         updateData.esignRecord.fileUrl.split("/uploads/accounts/")[1]
//                       );
//                       const parentFolderPath = fullPath
//                         .split("/")
//                         .slice(0, -1)
//                         .join("/");

//                       // 3️⃣ Update the final status only when ALL have signed
//                       await updateStatus(
//                         { path: parentFolderPath },
//                         "signStatus",
//                         "signatureCompleted"
//                       );

//                       // 4️⃣ Notify admin
//                       await fetch(`${SIGNATURE_API}/notify-admin`, {
//                         method: "POST",
//                         headers: { "Content-Type": "application/json" },
//                         body: JSON.stringify({
//                           clientName: targetEmail,
//                           documentName: selectedSlug,
//                           message: "All parties have completed signing"
//                         }),
//                       });

//                       alert("All signatures completed! Document has been fully executed.");
//                     } else {
//                       console.log(`✅ You have signed. Waiting for ${updateData.pendingCount} more signer(s).`);
//                       alert(`Thank you for signing! Waiting for ${updateData.pendingCount} more signer(s) to complete.`);
//                     }

//                   } catch (err) {
//                     console.error("Error handling post-sign actions", err);
//                     alert("Error while updating sign status.");
//                   }

//                   handleCloseDialog();
//                   // Refresh the data
//                   window.location.reload();
//                 }}
//               />
//             )}
//           </DialogContent>
//         </Dialog>
//       </Box>
//     </>
//   );
// };

const DocuSealMultiSigner = ({ accountId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const SIGNATURE_API = process.env.REACT_APP_ESIGNATURE_API;
  const targetEmail = sessionStorage.getItem("email");

  useEffect(() => {
    const fetchSignatureList = async () => {
      try {
        const response = await fetch(
          `https://snptaxes.com/signautrelist/${accountId}`
        );
        const result = await response.json();
        console.log("Fetched signature submissions:", result);
        setSubmissions(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching signature list:", error);
        setLoading(false);
      }
    };

    if (accountId) {
      fetchSignatureList();
    }
  }, [accountId]);

  const handleOpenDialog = (slug) => {
    setSelectedSlug(slug);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSlug(null);
  };

  const updateStatus = async (item, statusType, newValue) => {
    try {
      if (!item?.path) return alert("Invalid item selected");
      console.log("Updating status for", item.path, statusType, newValue);
      const body = {
        targetPath: item.path,
        status: { [statusType]: newValue },
      };

      const res = await fetch(
        "https://www.snptaxes.com/api/accountsdoc/updateStatus",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (res.ok) {
        console.log("Status updated successfully:", data.message);
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Error updating status");
    }
  };

  // Extract submitters that match the logged-in email AND are not completed
  const matchingSubmitters = submissions
    .flatMap((submission) =>
      submission.submitters.map((s) => ({
        slug: s.slug,
        email: s.email,
        submissionId: s.submission_id,
        templateName: s.name,
        createdAt: submission.createdAt,
        fileUrl: submission.fileUrl,
        externalId: submission.externalId,
        submissionData: submission,
        status: s.status,
        completed_at: s.completed_at,
        role: s.role,
        allCompleted: submission.submitters.every(
          (submitter) =>
            submitter.status === "completed" || submitter.completed_at !== null
        ),
      }))
    )
    .filter((s) => s.email === targetEmail && !s.completed_at);

  console.log("matchingSubmitters", matchingSubmitters);

  if (loading) return <p>Loading...</p>;

  // Show all documents related to the user with their status
  const allUserSubmissions = submissions
    .flatMap((submission) =>
      submission.submitters.map((s) => ({
        slug: s.slug,
        email: s.email,
        submissionId: s.submission_id,
        templateName: s.name,
        createdAt: submission.createdAt,
        fileUrl: submission.fileUrl,
        externalId: submission.externalId,
        status: s.status,
        completed_at: s.completed_at,
        role: s.role,
        allCompleted: submission.submitters.every(
          (submitter) =>
            submitter.status === "completed" || submitter.completed_at !== null
        ),
        totalSubmitters: submission.submitters.length,
        completedCount: submission.submitters.filter(
          (sub) => sub.status === "completed" || sub.completed_at !== null
        ).length,
      }))
    )
    .filter((s) => s.email === targetEmail);

  return (
    <>
      <Box>
        {/* Pending Signatures */}
        {matchingSubmitters.length > 0 && (
          <>
            <Typography
              component="h2"
              variant="subtitle2"
              gutterBottom
              sx={{ fontWeight: "600" }}
            >
              Documents
            </Typography>
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Pending Your Signature ({matchingSubmitters.length})
            </Typography>
            <Box
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                marginTop: "5px",
              }}
            >
              {matchingSubmitters.map((s, index) => (
                <Card key={index} style={{ minWidth: 200 }}>
                  <CardContent>
                    <Typography variant="body2">
                      Template: {s.templateName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Role: {s.role}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Progress:{" "}
                      {
                        s.submissionData.submitters.filter(
                          (sub) => sub.completed_at
                        ).length
                      }{" "}
                      of {s.submissionData.submitters.length} signed
                    </Typography>
                    <br />
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleOpenDialog(s.slug)}
                      sx={{
                        backgroundColor: "text.menu",
                        color: "primary.contrastText",
                        "&:hover": {
                          backgroundColor: "menu.dark",
                        },
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      Review and Sign
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </>
        )}

        <Box
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            marginTop: "5px",
          }}
        >
          {allUserSubmissions.map((s, index) => (
            <Card key={index} style={{ minWidth: 200 }}>
              <CardContent>
                <Typography variant="body2">
                  Template: {s.templateName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Your Status: {s.completed_at ? "✓ Signed" : "⏳ Pending"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Overall:{" "}
                  {s.allCompleted
                    ? "✓ All Signed"
                    : ` ${s.completedCount}/${s.totalSubmitters} signed`}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Role: {s.role}
                </Typography>
                {s.completed_at && (
                  <Typography variant="body2" color="success.main">
                    ✓ Document Updated with Your Signature
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>

        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="lg"
        >
          <DialogTitle>
            Signing Form
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            {selectedSlug && (
              <DocusealForm
                src={`https://docuseal.com/s/${selectedSlug}`}
                email={targetEmail}
                onComplete={async (data) => {
                  console.log("Post-sign data:", data);

                  try {
                    // 1️⃣ Update this specific submitter's status and replace document
                    const updateSubmitterRes = await fetch(
                      `${SIGNATURE_API}/signautrelist/update-submitter/${data.template.external_id}`,
                      {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          submitterEmail: targetEmail,
                          submissionId: data.submission_id,
                        }),
                      }
                    );

                    const updateData = await updateSubmitterRes.json();
                    console.log("Update data after signing:", updateData);
                    if (updateData.success) {
                      console.log("✅ Document replaced with latest signature");

                      // 2️⃣ Check if ALL submitters have now completed
                      if (updateData.allCompleted) {
                        console.log(
                          "🎉 All submitters have completed signing!"
                        );

                        // Extract parent folder path
                        const fullPath = decodeURIComponent(
                          updateData.esignRecord.fileUrl.split(
                            "/uploads/accounts/"
                          )[1]
                        );
                        const parentFolderPath = fullPath
                          .split("/")
                          .slice(0, -1)
                          .join("/");

                        // 3️⃣ Update the final status only when ALL have signed
                        await updateStatus(
                          { path: fullPath },
                          "signStatus",
                          "signatureCompleted"
                        );

                        // 4️⃣ Notify admin
                        await fetch(`${SIGNATURE_API}/notify-admin`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            clientName: targetEmail,
                            documentName: selectedSlug,
                            message: "All parties have completed signing",
                            accountId: accountId
                          }),
                        });

                        alert(
                          "All signatures completed! Document has been fully executed."
                        );
                      } else {
                        console.log(
                          `✅ You have signed. Document updated. Waiting for ${updateData.pendingCount} more signer(s).`
                        );
                        alert(
                          `Thank you for signing! Document has been updated. Waiting for ${updateData.pendingCount} more signer(s) to complete.`
                        );
                      }
                    } else {
                      alert("Error updating signature status.");
                    }
                  } catch (err) {
                    console.error("Error handling post-sign actions", err);
                    alert("Error while updating sign status.");
                  }

                  handleCloseDialog();
                  // Refresh the data
                   window.location.reload();
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
};
export default DocuSealMultiSigner;
