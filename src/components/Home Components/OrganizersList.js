import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Stack, Typography } from "@mui/material";
import OrganizerDialog from "../../pages/Organizers/OrganizerDialog";

const OrganizersList = ({ accountId }) => {
  const ORGANIZER_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  const [organizers, setOrganizers] = useState([]);
 
  const fetchOrganizers = async () => {
    try {
      const url = `${ORGANIZER_API}/workflow/orgaccwise/organizer/pending/${accountId}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch organizerTemplatesData");
      }
      const data = await response.json();
      // console.log("organizer",data);
      setOrganizers(data.pendingOrganizers);
     
    } catch (error) {
      console.error("Error fetching organizerTemplatesData:", error);
    }
  };
  useEffect(() => {
    if (accountId) {
      fetchOrganizers();
    }
  }, [accountId]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
   const handleOpenDialog = (organizer) => {
    setSelectedOrganizer(organizer);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrganizer(null);
  };
  return (
    <>
      {organizers.length > 0 && (
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
              Organizers ({organizers.length})
            </Typography>
          </Stack>
          <Box mt={2}>
            {organizers.map((organizer, index) => (
              <Stack key={index} mb={1.5}>
                {" "}
                <Paper
                 onClick={() => handleOpenDialog(organizer)}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                    transition: "all 0.3s",
                    cursor: "pointer",
                    "&:hover .completesign-link": {
                      opacity: 1,
                      visibility: "visible",
                      textDecoration: "none",
                      cursor: "pointer",
                    },
                  }}
                >
                  <Typography component="h2" variant="subtitle2" gutterBottom >
                    Complete Organizer
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", cursor: "pointer" }}
                      >
                      {organizer.organizerName}
                      </Typography>
                    </Box>
                    <Typography
                      className="completesign-link"
                      color="primary"
                      variant="subtitle2"
                      component="p"
                      fontWeight="600"
                      sx={{
                        fontSize: 14,
                        opacity: 0,
                        visibility: "hidden",
                        transition: "all 0.3s",
                        textDecoration: "none",
                        cursor: "pointer",
                      }}
                    >
                      Complete
                    </Typography>
                  </Box>
                </Paper>
              </Stack>
            ))}
          </Box>
        </Box>
      )}


       <OrganizerDialog
  open={openDialog}
  handleClose={handleCloseDialog}
  organizer={selectedOrganizer}
/>
    </>
  );
};

export default OrganizersList;
