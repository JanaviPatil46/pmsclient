// import React from 'react'
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import React, { useState } from "react";
import { Divider, Stack, Typography } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import TelegramIcon from "@mui/icons-material/Telegram";
import NewChat from "../pages/chats&tasks/NewChat";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import LocationPinIcon from "@mui/icons-material/LocationPin";
const QuickLinks = ({ accountId, loginUserId }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
   
        <Paper sx={{
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                    transition: "all 0.3s",
                    cursor: "pointer",
                    
                  }}>
          <Stack direction="row" sx={{ gap: 1, alignItems: "center", p: 2 }}>
          <Typography variant="h6" component="p" sx={{ flexGrow: 1 }}>
            Quick links
          </Typography>
        </Stack>
      
       
        <Grid container spacing={2} sx={{ p: 1 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <UploadFileIcon sx={{ color: "#f0c000" }} fontSize="small" />
                <Typography variant="body2" sx={{ cursor: "pointer" }}>
                  Uplaod Documents
                </Typography>
              </Box>
            </Stack>
          </Grid>
          {/* <Grid size={{ xs: 12, md: 6 }}>
                <Stack>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <DriveFolderUploadIcon />
                    <Typography component="h2" variant="subtitle2" gutterBottom>
                      Uplaod Folder
                    </Typography>
                  </Box>
                </Stack>
              </Grid> */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <TelegramIcon fontSize="small" sx={{ color: "text.menu" }} />
                <Typography
                  variant="body2"
                  sx={{ cursor: "pointer" }}
                  onClick={handleOpen}
                >
                  Chats
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
        </Paper>
        
       
<Paper sx={{
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                    transition: "all 0.3s",
                    cursor: "pointer",
                    mt:3
                    
                  }}>
        <Stack direction="row" sx={{ gap: 1, alignItems: "center", p: 2 }}>
          <Typography variant="h6" component="p" sx={{ flexGrow: 1 }}>
            Balance
          </Typography>
        </Stack>
   

        <Box sx={{ flexGrow: 1, p: 2 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexDirection: "column",
                  }}
                >
                  <Typography component="h2" variant="subtitle2" gutterBottom>
                    Credits Available
                  </Typography>

                  <Typography
                    component="h2"
                    variant="subtitle2"
                    gutterBottom
                    sx={{ color: "success.main" }}
                  >
                    $0.00
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexDirection: "column",
                  }}
                >
                  <Typography component="h2" variant="subtitle2" gutterBottom>
                    Outstanding Balance
                  </Typography>
                  <Typography
                    component="h2"
                    variant="subtitle2"
                    gutterBottom
                    sx={{ color: "warning.main" }}
                  >
                    $0.00
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>
          </Paper>
<Paper sx={{
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                    transition: "all 0.3s",
                    cursor: "pointer",
                    mt:3
                    
                  }}>
        <Stack direction="row" sx={{ gap: 1, alignItems: "center", p: 2 }}>
          <Typography variant="h6" component="p" sx={{ flexGrow: 1 }}>
            Contact info
          </Typography>
        </Stack>

      
        <Stack p={2}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <PhoneAndroidIcon fontSize="small" />
            <Box>
              <Typography
                variant="subtitle2"
                component="p"
                sx={{ flexGrow: 1 }}
              >
                Phone
              </Typography>
              <Typography
                variant="subtitle2"
                component="p"
                sx={{ flexGrow: 1 }}
              >
                (925) 800-3561
              </Typography>
            </Box>
          </Box>
        </Stack>
        <Stack p={2}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <LocationPinIcon fontSize="small" sx={{ color: "#f0c000" }}/>
            <Box>
            {" "}
            <Typography variant="subtitle2" component="p" sx={{ flexGrow: 1 }}>
              Address
            </Typography>
            <Typography variant="subtitle2" component="p" sx={{ flexGrow: 1 }}>
              3015 Hopyard Rd, Ste M, Pleasanton, CA 94588
            </Typography>
          </Box>
          </Box>
          
        </Stack>
        </Paper>
      

      <NewChat
        open={open}
        close={handleClose}
        accId={accountId}
        loginuserid={loginUserId}
      />
    </>
  );
};

export default QuickLinks;
