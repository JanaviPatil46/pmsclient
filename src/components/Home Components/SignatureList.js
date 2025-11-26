import React, { useState } from "react";
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

const SignatureList = ({ documentsList, targetEmail }) => {
  const [selectedExternalId, setSelectedExternalId] = useState(documentsList.externalId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const SIGNATURE_API = process.env.REACT_APP_ESIGNATURE_API;
console.log("documentsList",documentsList);
// console.log("targetEmail",targetEmail);
console.log("selectedExternalId",selectedExternalId);
  const handleOpenDialog = (externalId) => {
    setSelectedExternalId(externalId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedExternalId(null);
  };

  const updateStatus = async (parentFolderPath) => {
    try {
      const body = {
        targetPath: parentFolderPath,
        status: { signStatus: "signatureCompleted" },
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
      if (!res.ok) alert(data.error || "Failed folder update");
    } catch (err) {
      console.error("Error updating folder signStatus:", err);
    }
  };

  return (
    <>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Documents to Sign ({documentsList.length})
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {documentsList.map((doc, i) => (
          <Card key={i} sx={{ minWidth: 230 }}>
            <CardContent>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {doc.filename}
              </Typography>

              <Button
                size="small"
                variant="contained"
                onClick={() => handleOpenDialog(doc.externalId)}
              >
                Review & Sign
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* SIGNING DIALOG */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="lg">
        <DialogTitle>
          Sign Document
          <IconButton
            onClick={handleCloseDialog}
            sx={{ position: "absolute", right: 10, top: 10 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {selectedExternalId && (
            <DocusealForm
              src={`https://docuseal.com/s/${selectedExternalId}`}
              email={targetEmail}
              onComplete={async (completeData) => {
                try {
                  // 1️⃣ Update e-sign DB record in your backend
                  const updateEsignRes = await fetch(
                    `${SIGNATURE_API}/signautrelist/update/${selectedExternalId}`,
                    {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        status: "completed",
                        submissionId: completeData.submission_id,
                      }),
                    }
                  );

                  const updateEsignData = await updateEsignRes.json();
                  console.log("Record updated:", updateEsignData);

                  // 2️⃣ Compute parent folder path
                  const fullPath = decodeURIComponent(
                    updateEsignData.fileUrl.split("/uploads/accounts/")[1]
                  );
                  const parentFolderPath = fullPath.split("/").slice(0, -1).join("/");
                  await updateStatus(parentFolderPath);

                  // 3️⃣ Notify admin
                  await fetch(`${SIGNATURE_API}/notify-admin`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      clientName: targetEmail,
                      documentName: selectedExternalId,
                    }),
                  });

                  alert("Document signed successfully!");
                } catch (err) {
                  console.error("Post-sign error:", err);
                  alert("Something went wrong while processing the signature");
                }

                handleCloseDialog();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SignatureList;
