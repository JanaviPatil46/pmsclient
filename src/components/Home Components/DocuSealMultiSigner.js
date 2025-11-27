// import React, { useState } from "react";
// import { DocusealForm } from "@docuseal/react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   IconButton,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

// const DocuSealMultiSigner = ({ submissions, targetEmail }) => {
//   console.log("submissions",submissions);
//   console.log("targetEmail",targetEmail);
//   const [selectedSlug, setSelectedSlug] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const SIGNATURE_API = process.env.REACT_APP_ESIGNATURE_API;
//   const handleOpenDialog = (slug) => {
//     setSelectedSlug(slug);
//     setDialogOpen(true);
//   };
//  const updateStatus = async (item, statusType, newValue) => {
//       try {
//         if (!item?.path) return alert("Invalid item selected");
  
//         const body = {
//           targetPath: item.path,
//           status: {
//             [statusType]: newValue, // dynamic key
//           },
//         };
  
//         const res = await fetch(
//           "https://www.snptaxes.com/api/accountsdoc/updateStatus",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(body),
//           }
//         );
  
//         const data = await res.json();
  
//         if (res.ok) {
//           alert(data.message || "Status updated successfully");
//           // fetchFolderTree(accountId); // refresh folder tree to reflect change
//         } else {
//           alert(data.error || "Failed to update status");
//         }
//       } catch (err) {
//         console.error("Error updating status:", err);
//         alert("Error updating status");
//       }
//     };
//   const handleCloseDialog = () => {
//     setDialogOpen(false);
//     setSelectedSlug(null);
//   };

//   // Collect all submitter slugs with the target email
//   const matchingSubmitters = submissions
//     .flatMap((submission) =>
//       submission.submitters.map((s) => ({
//         slug: s.slug,
//         email: s.email,
//         submissionId: submission._id,
//         templateName: submission.template?.name,
//         createdAt: submission.created_at,
//       }))
//     )
//     .filter((s) => s.email === targetEmail);

//   return (
//     <>
//       {matchingSubmitters.length > 0 && (
//         <Box>
//           <Typography
//             component="h2"
//             variant="subtitle2"
//             gutterBottom
//             sx={{ fontWeight: "600" }}
//           >
//             Documents ({matchingSubmitters.length})
//           </Typography>

//           <Box
//             style={{
//               display: "flex",
//               flexWrap: "wrap",
//               gap: "20px",
//               marginTop: "5px",
//             }}
//           >
//             {matchingSubmitters.map((s, index) => (
//               <Card key={index} style={{ minWidth: 200 }}>
//                 <CardContent>
//                   <Typography variant="body2">
//                     Template: {s.templateName}
//                   </Typography>

//                   <br />
//                   <Button
//                     size="small"
//                     color="primary"
//                     onClick={() => handleOpenDialog(s.slug)}
//                     sx={{
//                       backgroundColor: "text.menu",
//                       color: "primary.contrastText",
//                       "&:hover": {
//                         backgroundColor: "menu.dark",
//                         boxShadow: 1,
//                       },

//                       transition: "background-color 0.2s ease",
//                     }}
//                   >
//                     Review and Sign
//                   </Button>
//                 </CardContent>
//               </Card>
//             ))}
//           </Box>

//           <Dialog
//             open={dialogOpen}
//             onClose={handleCloseDialog}
//             fullWidth
//             maxWidth="lg"
//           >
//             <DialogTitle>
//               Signing Form
//               <IconButton
//                 aria-label="close"
//                 onClick={handleCloseDialog}
//                 sx={{
//                   position: "absolute",
//                   right: 8,
//                   top: 8,
//                   color: (theme) => theme.palette.grey[500],
//                 }}
//               >
//                 <CloseIcon />
//               </IconButton>
//             </DialogTitle>
//             <DialogContent dividers>
              
//               {selectedSlug && (
//   <DocusealForm
//     src={`https://docuseal.com/s/${selectedSlug}`}
//     email={targetEmail}
//     onComplete={async (data) => {
//       // console.log("Form signed", data);
//       // alert("Document signed successfully!");
// console.log("Post-sign data:", data);
//       try {
//         // 1️⃣ Update the e-sign status in Docuseal record
//         const updateEsignRes = await fetch(
//           `${SIGNATURE_API}/signautrelist/update/${data.template.external_id}`,
//           {
//             method: "PATCH",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               status: "completed",
//                submissionId: data.submission_id, // optional
//             }),
//           }
//         );
//         const updateEsignData = await updateEsignRes.json();
//         console.log("Esign record updated", updateEsignData);

//        // 2️⃣ Extract parent folder path (remove filename)
//         const fullPath = decodeURIComponent(
//           updateEsignData.fileUrl.split("/uploads/accounts/")[1]
//         );
//         const parentFolderPath = fullPath.split("/").slice(0, -1).join("/");
//         console.log("Parent folder path for updateStatus:", parentFolderPath);

//         const folderItem = { path: parentFolderPath };
//         await updateStatus(folderItem, "signStatus", "signatureCompleted"); // update parent folders only



//         // 3️⃣ Notify admin
//         await fetch(`${SIGNATURE_API}/notify-admin`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             clientName: targetEmail,
//             documentName: selectedSlug,
//           }),
//         });
//         console.log("Admin notified");

//       } catch (err) {
//         console.error("Error handling post-sign actions", err);
//         alert("Something went wrong while updating status or notifying admin");
//       }

//       handleCloseDialog();
//     }}
//   />
// )}

//             </DialogContent>
//           </Dialog>
//         </Box>
//       )}
//     </>
//   );
// };

// export default DocuSealMultiSigner;


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

const DocuSealMultiSigner = ({ accountId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const SIGNATURE_API = process.env.REACT_APP_ESIGNATURE_API;

  const targetEmail = sessionStorage.getItem("email");
  // const accountId = sessionStorage.getItem("accountId");

  // ⭐ FETCH SIGNATURE LIST DIRECTLY HERE
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
        alert(data.message || "Status updated successfully");
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Error updating status");
    }
  };

  // ⭐ Extract only submitters that match the logged-in email
  const matchingSubmitters = submissions
    .flatMap((submission) =>
      submission.submitters.map((s) => ({
        slug: s.slug,
        email: s.email,
        submissionId: s.submission_id,
        templateName: s.name,
        createdAt: submission.createdAt,
        fileUrl: submission.fileUrl,
      }))
    )
    .filter((s) => s.email === targetEmail);
console.log("matchingSubmitters", matchingSubmitters);
  if (loading) return <p>Loading...</p>;

  if (matchingSubmitters.length === 0)
    return <p></p>;

  return (
    <>
      <Box>
        <Typography
          component="h2"
          variant="subtitle2"
          gutterBottom
          sx={{ fontWeight: "600" }}
        >
          Documents ({matchingSubmitters.length})
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
                    // 1️⃣ Update e-sign status
                    const updateEsignRes = await fetch(
                      `${SIGNATURE_API}/signautrelist/update/${data.template.external_id}`,
                      {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          status: "completed",
                          submissionId: data.submission_id,
                        }),
                      }
                    );

                    const updateEsignData = await updateEsignRes.json();

                    // 2️⃣ Extract parent folder path
                    const fullPath = decodeURIComponent(
                      updateEsignData.fileUrl.split("/uploads/accounts/")[1]
                    );
                    const parentFolderPath = fullPath
                      .split("/")
                      .slice(0, -1)
                      .join("/");

                    await updateStatus(
                      { path: parentFolderPath },
                      "signStatus",
                      "signatureCompleted"
                    );

                    // 3️⃣ Notify admin
                    await fetch(`${SIGNATURE_API}/notify-admin`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        clientName: targetEmail,
                        documentName: selectedSlug,
                      }),
                    });

                  } catch (err) {
                    console.error(
                      "Error handling post-sign actions",
                      err
                    );
                    alert("Error while updating sign status.");
                  }

                  handleCloseDialog();
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
