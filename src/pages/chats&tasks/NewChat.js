// import {  TextField, Typography } from "@mui/material";
// import Editor from "../../components/Texteditor";
// import PropTypes from "prop-types";
// import { useState,} from "react";
// import Drawer, { drawerClasses } from "@mui/material/Drawer";
// import Stack from "@mui/material/Stack";
// import { Box, Button } from "@mui/material";
// import MenuButton from "../../components/MenuButton";
// import CloseIcon from "@mui/icons-material/Close";
// import { toast } from "material-react-toastify";

// function NewChat({
//   open,
//   close,
//   loginuserid,
//   accId,
// }) {
//   const [inputText, setInputText] = useState("");
//   const handlechatsubject = (e) => {
//     const { value } = e.target;
//     setInputText(value);
//   };
//   const [editorContent, setEditorContent] = useState("");
//   const handleEditorChange = (content) => {
//     setEditorContent(content);
//   };
// const saveChat = () => {
//   const myHeaders = new Headers();
//   myHeaders.append("Content-Type", "application/json");
//   const messageData = [
//     {
//       message: editorContent,
//       fromwhome: "client",
//       senderid: loginuserid,
//       isRead: false,
//     },
//   ];
  
//   const raw = JSON.stringify({
//     accountids: [accId],
//     chatsubject: inputText,
//     description: messageData,
//     active: "true",
//   });
  
//   const requestOptions = {
//     method: "POST",
//     headers: myHeaders,
//     body: raw,
//     redirect: "follow",
//   };

//   fetch("http://127.0.0.1/chats/chatsaccountwise", requestOptions)
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       return response.json();
//     })
//     .then((result) => {
//       toast.success("New Chat created successfully");
    
//       setInputText("");
//       setEditorContent("");
//       close(); // This will close the drawer
//     })
//     .catch((error) => {
//       console.error("Fetch error: ", error.message);
//       toast.error("Failed to create new chat. Please try again.");
//     });
// };
  
//   return (
//     <Drawer
//       anchor="right"
//       open={open}
//       onClose={close}
//       sx={{
//         zIndex: (theme) => theme.zIndex.drawer + 1,
//         [`& .${drawerClasses.paper}`]: {
//           width: "40dvw",
//           backgroundImage: "none",
//           backgroundColor: "background.paper",
//         },
//       }}
//     >
//       <Stack
//         sx={{
//           minWidth: "35dvw",
//           height: "100%",
//         }}
//       >
//         <Stack
//           direction="row"
//           sx={{ p: 2, pb: 0, gap: 1, alignItems: "center" }}
//         >
//           <Stack
//             direction="row"
//             sx={{
//               gap: 1,
//               alignItems: "center",
//               flexGrow: 1,
//               p: 1.5,
//               justifyContent: "space-between",
//             }}
//           >
//             <Typography component="p" variant="h6">
//               New Chat
//             </Typography>
//             <MenuButton onClick={close}>
//               <CloseIcon />
//             </MenuButton>
//           </Stack>
//         </Stack>
//         <Box sx={{ p: 3 }}>
//           <Stack>
//             <Typography
//               variant="subtitle2"
//               component="p"
//               gutterBottom
//               sx={{ fontWeight: "500" }}
//             >
//               Subject
//             </Typography>
//             <TextField
//               variant="outlined"
//               size="small"
//               multiline
//               fullWidth
//               placeholder="Subject"
//               value={inputText}
//               onChange={handlechatsubject}
//             />
//           </Stack>
//           <Stack sx={{ mt: 3 }}>
//             {" "}
//             <Editor onChange={handleEditorChange} value={editorContent} />
//           </Stack>

//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <Button variant="contained" onClick={saveChat}>
//               Create chat
//             </Button>
//             <Button onClick={close} variant="outlined">
//               Cancel
//             </Button>
//           </Box>
//         </Box>
//       </Stack>
//     </Drawer>
//   );
// }
// NewChat.propTypes = {
//   open: PropTypes.bool,
//   toggleDrawer: PropTypes.func.isRequired,
// };
// export default NewChat;


import { TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import Editor from "../../components/Texteditor";
import PropTypes from "prop-types";
import { useState } from "react";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import { Box, Button } from "@mui/material";
import MenuButton from "../../components/MenuButton";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "material-react-toastify";

function NewChat({ open, close, loginuserid, accId }) {

     const CHAT_API = process.env.REACT_APP_CHAT_API;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [inputText, setInputText] = useState("");
  const handlechatsubject = (e) => {
    const { value } = e.target;
    setInputText(value);
  };
  const [editorContent, setEditorContent] = useState("");
  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const saveChat = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const messageData = [
      {
        message: editorContent,
        fromwhome: "client",
        senderid: loginuserid,
        isRead: false,
      },
    ];

    const raw = JSON.stringify({
      accountids: [accId],
      chatsubject: inputText,
      description: messageData,
      active: "true",
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${CHAT_API}/chats/chatsaccountwise`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        toast.success("New Chat created successfully");
        setInputText("");
        setEditorContent("");
        close();
      })
      .catch((error) => {
        console.error("Fetch error: ", error.message);
        toast.error("Failed to create new chat. Please try again.");
      });
  };

  // Determine drawer width based on screen size
  const getDrawerWidth = () => {
    if (isMobile) return "100vw";
    if (isTablet) return "70vw";
    return "40vw";
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={close}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          width: getDrawerWidth(),
          backgroundImage: "none",
          backgroundColor: "background.paper",
        },
      }}
    >
      <Stack
        sx={{
          width: "100%",
          height: "100%",
          overflow: "auto",
        }}
      >
        <Stack
          direction="row"
          sx={{ p: 2, pb: 0, gap: 1, alignItems: "center" }}
        >
          <Stack
            direction="row"
            sx={{
              gap: 1,
              alignItems: "center",
              flexGrow: 1,
              p: 1.5,
              justifyContent: "space-between",
            }}
          >
            <Typography component="p" variant="h6">
              New Chat
            </Typography>
            <MenuButton onClick={close}>
              <CloseIcon />
            </MenuButton>
          </Stack>
        </Stack>
        <Box sx={{ p: isMobile ? 2 : 3, flex: 1, overflow: "auto" }}>
          <Stack>
            <Typography
              variant="subtitle2"
              component="p"
              gutterBottom
              sx={{ fontWeight: "500" }}
            >
              Subject
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              multiline
              fullWidth
              placeholder="Subject"
              value={inputText}
              onChange={handlechatsubject}
            />
          </Stack>
          <Stack sx={{ mt: 3 }}>
            <Editor onChange={handleEditorChange} value={editorContent} />
          </Stack>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mt: 3,
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <Button
              // variant="contained"
              onClick={saveChat}
              fullWidth={isMobile}
              size={isMobile ? "large" : "medium"}
              sx={{
    backgroundColor: 'text.menu', // Using your teal warning color
    color: 'primary.contrastText',    // Contrasting text color
    '&:hover': {
      backgroundColor: 'menu.dark', // Darker teal from your palette
      boxShadow: 1,
      // Alternative options:
      // backgroundColor: alpha('text.warning', 0.9), // Slightly transparent
      // backgroundColor: 'warning.main', // Standard teal
    },
    
    transition: 'background-color 0.2s ease' // Smooth color transition
  }}
            >
              Create chat
            </Button>
            <Button
              onClick={close}
              variant="outlined"
              fullWidth={isMobile}
              size={isMobile ? "large" : "medium"}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Stack>
    </Drawer>
  );
}

NewChat.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func.isRequired,
  loginuserid: PropTypes.string.isRequired,
  accId: PropTypes.string.isRequired,
};

export default NewChat;