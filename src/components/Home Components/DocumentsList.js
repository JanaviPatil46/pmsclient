import React from 'react'
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import {  Stack, Typography } from "@mui/material";

const DocumentsList = () => {
  return (
   <>  <Stack
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
     Documents
   </Typography>
   <Typography
     component="h2"
     variant="subtitle2"
     gutterBottom
     sx={{ fontWeight: "600" }}
   >
     See All
   </Typography>
 </Stack>
 <Box mt={2}>
   <Stack mb={1.5}>
     <Paper sx={{ p: 3 }}>one</Paper>
   </Stack>
   <Stack mb={1.5}>
     <Paper sx={{ p: 3 }}>one</Paper>
   </Stack>
 </Box>
   </>
  )
}

export default DocumentsList