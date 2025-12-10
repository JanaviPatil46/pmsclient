// import {
//   Box,
//   Grid,
//   Checkbox,
//   // Container,
//   IconButton,
//   Typography,
//   Paper,
//   Button,
//   Divider,
//   Stack,
//   Menu,
//   MenuItem,CircularProgress
// } from "@mui/material";
// import React, { useEffect, useState, useRef, useContext } from "react";
// import { useParams } from "react-router-dom";
// import { toast } from "material-react-toastify";
// import Editor from "../../components/Texteditor";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import CloseIcon from "@mui/icons-material/Close";
// import { LoginContext } from "../../context/Context";
// import axios from "axios";
// const UpdateChat = () => {
//    const CHAT_API = process.env.REACT_APP_CHAT_API;
 
// const{accId} = useState(sessionStorage.getItem("accountId"))
//      const fetchAccountDetails = async () => {
//     try {
//       const res = await axios.get(
//         `https://www.snptaxes.com/api/accounts/${accId}`
//       );
//       // setAccount(res.data);
//       setAccountName(res.data.accounts.accountName)
//       console.log("result", res.data);
//     } catch (error) {
//       console.error("Error fetching account details:", error);
//     }
//   };


//  useEffect(() => {
//     // if (loginUserId) {
//       fetchAccountDetails();
//     // }
//   }, [accId]);


//   const messageRefs = useRef({});
//   const [highlightedId, setHighlightedId] = useState(null);

//   const { _id } = useParams();
//   console.log("chatid",_id)
//   const [chatDetails, setChatDetails] = useState("");
//   const [time, setTime] = useState();
//   const [chatsubject, setChatSubject] = useState("");
//   const [accountName, setAccountName] = useState("");
//   const [chatDescriptions, setChatDescriptions] = useState([]);
//   const [editorContent, setEditorContent] = useState("");
//   const [tasks, setTasks] = useState([]);

// const [chatTemplate, setChatTemplate]=useState("")
//   const getsChatDetails = async () => {
//     try {
//       const url = `${CHAT_API}/chats/chatsaccountwise/`;
//       const response = await fetch(url + _id);
//       if (!response.ok) {
//         throw new Error("Failed to fetch data");
//       }
//       const data = await response.json();
//       console.log("get chat by id", data);

//       setChatDetails(data.chat);

//       setChatSubject(data.chat.chatsubject);
//       setChatTemplate(data.chat.chattemplateid)
//       setTime(data.chat.updatedAt);
//       setAccountName(data.chat.accountid.accountName);

//       setChatDescriptions(data.chat.description || []);
//     setTasks(data.chat.clienttasks.flat());

//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };
 
// const handleCheckboxChange = (index) => {
//   setTasks((prevTasks) => {
//     const updatedTasks = prevTasks.map((task, i) =>
//       i === index
//         ? { ...task, checked: !task.checked }  // ✅ toggle boolean
//         : task
//     );

//     updateClientTask(updatedTasks);
//     return updatedTasks;
//   });
// };
// const handleTaskToggle = (id) => {
//     setTasks((prevTasks) => {
//       const updated = prevTasks.map((task) =>
//         task.id === id ? { ...task, checked: !task.checked } : task
//       );

//       updateClientTask(updated);
//       return updated;
//     });
//   };
//   const updateClientTask = (updatedTasks) => {
//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");

//     const raw = JSON.stringify({
//       chatId: _id,
//       taskUpdates: updatedTasks.map((task) => ({
//         id: task.id,
//         text: task.text,
//         checked: task.checked, 
        
//       })),
//     });

//     console.log("Payload to Backend:", raw); // Log to verify

//     const requestOptions = {
//       method: "POST",
//       headers: myHeaders,
//       body: raw,
//       redirect: "follow",
//     };

//     fetch(
//       `${CHAT_API}/chats/chatsaccountwise/updateTaskCheckedStatus`,
//       requestOptions
//     )
//       .then((response) => response.json())
//       .then((result) => {
//         console.log("Backend response:", result);
//         toast.success("Task updated");
//         const allChecked = updatedTasks.every(
//           (task) => task.checked === true 
//         );

//         if (allChecked) {
//           const taskMessages =
//             `completed client tasks <br>` +
//             updatedTasks.map((task) => `• <s>${task.text}</s>`).join("<br>");
//           // const taskMessages = updatedTasks.map(task => `• ${task.text}`).join("\n");
//           console.log(
//             "All tasks are checked. Updating description:",
//             taskMessages
//           );
//           updateChatDescription(taskMessages);
//         } else {
//           console.log("Not all tasks are checked. Description not updated.");
//         }
//       })
//       .catch((error) => console.error("Error updating task:", error));
//   };

//   useEffect(() => {
//     getsChatDetails();
//   }, []);

//   const handleEditorChange = (content) => {
//     setEditorContent(content);
//   };

//   const formatDate = (timestamp) => {
//     const date = new Date(timestamp);
//     const day = date.getDate();
//     const month = date.toLocaleString("default", { month: "short" });
//     const hours = date.getHours();
//     const minutes = date.getMinutes();
//     const period = hours >= 12 ? "PM" : "AM";
//     const formattedHours = hours % 12 || 12;
//     const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
//     return `${day} ${month} ${formattedHours}:${formattedMinutes} ${period}`;
//   };

//   const [replyTo, setReplyTo] = useState(null);
//   const messagesEndRef = useRef(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedMessage, setSelectedMessage] = useState(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [chatDescriptions]);

//   const handleMenuClick = (event, message) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedMessage(message);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedMessage(null);
//   };

// const [isSending, setIsSending] = useState(false);
 

// const updateChatDescription = (message = "") => {
//   const contentToSend = message.trim() || editorContent.trim();
//   if (!contentToSend) return;

//    setIsSending(true); // Show loading state

//   const newDescription = {
//     message: contentToSend,
//     fromwhome: "client",
//     senderid: accountName,
//   };

//   if (replyTo) {
//     newDescription.replyTo = replyTo._id;
//   }

  

//   // // Clear input and reply state
//   // setEditorContent("");
//   // setReplyTo(null);

//   // Prepare payload
//   const raw = JSON.stringify({
//     newDescriptions: [newDescription],
//   });

//   // Send to backend (new endpoint triggers email)
//   fetch(`${CHAT_API}/chats/chatsaccountwise/chatmessagefromclient/${_id}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: raw,
//   })
//     .then((response) => {
//       if (!response.ok) throw new Error("Failed to update");
//       return response.json();
//     })
//     .then((data) => {
      
//        // Only update UI after successful backend storage
//         setChatDescriptions(prev => [
//           ...prev,
//           { ...newDescription, time: new Date().toISOString() }
//         ]);
//         setEditorContent("");
//         setReplyTo(null);
//         // toast.success("Message sent & email triggered");
//          // ✅ Dynamic toast based on backend response
//       toast.success(data.message || "Message sent");
//       setIsSending(false)
//         getsChatDetails(); // Reload chat details to ensure sync
//     })
//     .catch(() => toast.error("Send failed"));
// };

  
//   useEffect(() => {
//     const style = document.createElement("style");
//     style.innerHTML = `
//     @keyframes flashHighlight {
//       0% { background-color: #fff2b3; }
//       100% { background-color: transparent; }
//     }
//   `;
//     document.head.appendChild(style);
//     return () => document.head.removeChild(style);
//   }, []);

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
//       <Grid container spacing={2}>
//         <Grid
//           size={{ xs: 12, md: 6 }}
//           sx={{ height: "89vh", p: 2 }}
//         >
//           <Box>
//             <Typography
//               variant="h6"
//               component="p"
//               gutterBottom
//               sx={{ fontWeight: "600" }}
//             >
//               {chatsubject}
//             </Typography>
//           </Box>
//           <Divider />
//           <Box height={"42vh"} sx={{ overflowY: "auto", mt: 1, mb: 1 }}>
//             {Array.isArray(chatDescriptions) &&
//               chatDescriptions.length > 0 &&
//               chatDescriptions.map((desc, index) => {
//                 const isClient = desc.fromwhome?.toLowerCase() === "client";
//                 const isAdmin = desc.fromwhome?.toLowerCase() === "admin";
//                 const messageTime = desc.time
//                   ? formatDate(desc.time)
//                   : "Just now";

//                 let senderDisplayName = "";
//                 if (isClient) {
//                   senderDisplayName = "You";
//                 } else if (isAdmin && desc.senderid) {
//                   senderDisplayName = desc.senderid;
//                 }

//                 return (
//                   <Box
//                     key={desc._id || index}
//                     ref={(el) => {
//                       if (desc._id) {
//                         messageRefs.current[desc._id] = el;
//                       }
//                     }}
//                     sx={{
//                       display: "flex",
//                       justifyContent: isClient ? "flex-end" : "flex-start",
//                       mb: 2,
//                       position: "relative",
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         maxWidth: "75%",

//                         backgroundColor:
//                           desc._id === highlightedId
//                             ? "#fff2b3" // highlight color
//                             : isAdmin
//                             ? "#ffe6e6"
//                             : "#e6f0ff",

//                         p: 2,
//                         borderRadius: 2,
//                         borderTopLeftRadius: isClient ? 16 : 4,
//                         borderTopRightRadius: isClient ? 4 : 16,
//                         boxShadow: 1,
//                         position: "relative",
//                       }}
//                     >
//                       {/* Show Reply Preview */}

//                       {desc.replyTo &&
//                         (() => {
//                           const repliedMsg = chatDescriptions.find(
//                             (msg) => msg._id === desc.replyTo
//                           );
//                           if (!repliedMsg) return null;

//                           return (
//                             <Box
//                               sx={{
//                                 backgroundColor: "#f5f5f5",
//                                 borderLeft: "3px solid #1976d2",
//                                 px: 1,
//                                 py: 0.5,
//                                 mb: 1,
//                               }}
//                             >
//                               <Typography
//                                 variant="caption"
//                                 fontWeight="bold"
//                                 sx={{ cursor: "pointer", color: "#1976d2" }}
//                                 onClick={() => {
//                                   const el = messageRefs.current[desc.replyTo];
//                                   if (el) {
//                                     el.scrollIntoView({
//                                       behavior: "smooth",
//                                       block: "center",
//                                     });
//                                     setHighlightedId(desc.replyTo);
//                                     setTimeout(
//                                       () => setHighlightedId(null),
//                                       2000
//                                     ); // remove highlight after 2s
//                                   }
//                                 }}
//                               >
//                                 {repliedMsg.fromwhome === "client"
//                                   ? "You"
//                                   : repliedMsg.senderid|| "Admin"}
//                               </Typography>

//                               <Typography
//                                 variant="body2"
//                                 sx={{ fontStyle: "italic", color: "#555" }}
//                                 dangerouslySetInnerHTML={{
//                                   __html:
//                                     repliedMsg.message?.length > 100
//                                       ? repliedMsg.message.slice(0, 100) + "..."
//                                       : repliedMsg.message,
//                                 }}
//                               />
//                             </Box>
//                           );
//                         })()}

//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           color: "#333",
//                         }}
//                       >
//                         <Typography
//                           variant="subtitle2"
//                           component="p"
//                           gutterBottom
//                           sx={{ fontWeight: "600" }}
//                         >
//                           {senderDisplayName}
//                         </Typography>

//                         <MoreVertIcon
//                           fontSize="small"
//                           sx={{ cursor: "pointer" }}
//                           onClick={(e) => handleMenuClick(e, desc)} // 👈 Connect to your reply menu
//                         />
//                         <Menu
//                           anchorEl={anchorEl}
//                           open={Boolean(anchorEl)}
//                           onClose={() => setAnchorEl(null)}
//                         >
//                           <MenuItem
//                             onClick={() => {
//                               setReplyTo(selectedMessage);
//                               setAnchorEl(null);
//                             }}
//                           >
//                             Reply
//                           </MenuItem>
//                         </Menu>
//                       </Box>

//                       <Typography
//                         variant="body2"
//                         sx={{ whiteSpace: "pre-wrap", color: "#333" }}
//                         dangerouslySetInnerHTML={{
//                           __html:
//                             typeof desc.message === "string"
//                               ? desc.message
//                               : "No message available",
//                         }}
//                       />
//                       <Typography
//                         variant="caption"
//                         sx={{
//                           display: "block",
//                           textAlign: "right",
//                           color: "gray",
//                           mt: 1,
//                         }}
//                       >
//                         {messageTime}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 );
//               })}
//           </Box>
//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: "1fr auto",
//               gap: 2,
//               alignItems: "start",
//             }}
//           >
            
//             {replyTo && (
//               <Box
//                 sx={{
//                   gridColumn: "1 / -1", // span full width of the grid
//                   mb: 1,
//                   p: 1.5,
//                   backgroundColor: "#f4f6f8",
//                   borderLeft: "4px solid #1976d2",
//                   borderRadius: 1,
//                   position: "relative",
//                 }}
//               >
//                 <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
//                   Replying to:{" "}
//                   {replyTo.fromwhome === "client"
//                     ? "You"
//                     : replyTo.senderid || "Admin"}
//                 </Typography>

//                 <Typography
//                   variant="body2"
//                   sx={{ fontStyle: "italic", whiteSpace: "pre-wrap", pr: 4 }}
//                   dangerouslySetInnerHTML={{
//                     __html:
//                       replyTo.message?.length > 100
//                         ? `${replyTo.message.slice(0, 100)}...`
//                         : replyTo.message,
//                   }}
//                 />

//                 <IconButton
//                   size="small"
//                   onClick={() => setReplyTo(null)}
//                   sx={{
//                     position: "absolute",
//                     top: 6,
//                     right: 6,
//                     color: "#777",
//                     "&:hover": { color: "#000" },
//                   }}
//                 >
//                   <CloseIcon fontSize="small" />
//                 </IconButton>
//               </Box>
//             )}

//             <Editor onChange={handleEditorChange} value={editorContent} />
//             <Button
//               onClick={() => updateChatDescription()}
//                disabled={isSending || !editorContent.trim()}
//                sx={{
//               backgroundColor: 'text.menu',
//               height: "fit-content", alignSelf: "end" ,
//               color: 'primary.contrastText',
//               '&:hover': {
//                 backgroundColor: 'menu.dark',
//                 boxShadow: 1,
//               },
//               transition: 'background-color 0.2s ease'
//             }}
//          color="primary"
              
//             >
//               {/* Send */}
//               {isSending ? <CircularProgress size={24} color="inherit" /> : "Send"}
//             </Button>
//           </Box>
//         </Grid>
//         <Grid
//           size={{ xs: 12, md: 6 }}
//           sx={{  height: "89vh", p: 2 }}
//         >
//           <Box>
//             <Typography
//               variant="h6"
//               component="p"
//               gutterBottom
//               sx={{ fontWeight: "600" }}
//             >
//               Client Tasks
//             </Typography>
//             <Divider sx={{ mb: 2 }} />

//             {/* <Box display="flex" flexDirection="column" gap={2}>
//               {tasks.length > 0 ? (
//                 tasks.map((task, index) => (
//                   <Box key={index} display="flex" alignItems="center" gap={1}>
//                     <Checkbox
//                       checked={task.checked}
//                       onChange={() => handleCheckboxChange(index)}
//                     />
//                     <Box
//                       sx={{
//                         p: 1,
//                         width: "100%",
//                       textDecoration: task.checked ? "line-through" : "none",
//                       }}
//                     >
//                       <Typography variant="body1">{task.text}</Typography>
//                     </Box>
//                   </Box>
//                 ))
//               ) : (
//                 <Typography variant="body2" color="text.secondary">
//                   No task is assigned
//                 </Typography>
//               )}
//             </Box> */}
//             <Box display="flex" flexDirection="column" gap={2}>
//   {tasks.length > 0 ? (
//     tasks.map((task, index) => (
//       <Box
//         key={task.id}
//         display="flex"
//         alignItems="center"
//         gap={1}
//       >
//         <Checkbox
//           checked={task.checked}
//           onChange={() => handleTaskToggle(task.id)}
//         />

//        <Box
//                       sx={{
//                         p: 1,
//                         width: "100%",
//                       textDecoration: task.checked ? "line-through" : "none",
//                       }}
//                     >
//                       <Typography variant="body1">{task.text}</Typography>
//                     </Box>

       
//       </Box>
//     ))
//   ) : (
//     <Typography variant="body2" color="text.secondary">
//       No task is assigned
//     </Typography>
//   )}
// </Box>

//           </Box>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default UpdateChat;

import {
  Box,
  Grid,
  Checkbox,
  IconButton,
  Typography,
  Button,
  Divider,
  Menu,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import { toast } from "material-react-toastify";
import Editor from "../../components/Texteditor";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { LoginContext } from "../../context/Context";
import axios from "axios";

const UpdateChat = () => {
  const CHAT_API = process.env.REACT_APP_CHAT_API;
  const { accId } = useState(sessionStorage.getItem("accountId"));
  
  // Edit state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editContent, setEditContent] = useState("");

  const fetchAccountDetails = async () => {
    try {
      const res = await axios.get(
        `https://www.snptaxes.com/api/accounts/${accId}`
      );
      setAccountName(res.data.accounts.accountName);
      console.log("result", res.data);
    } catch (error) {
      console.error("Error fetching account details:", error);
    }
  };

  useEffect(() => {
    fetchAccountDetails();
  }, [accId]);

  const messageRefs = useRef({});
  const [highlightedId, setHighlightedId] = useState(null);
  const { _id } = useParams();
  console.log("chatid", _id);
  const [chatDetails, setChatDetails] = useState("");
  const [time, setTime] = useState();
  const [chatsubject, setChatSubject] = useState("");
  const [accountName, setAccountName] = useState("");
  const [chatDescriptions, setChatDescriptions] = useState([]);
  const [editorContent, setEditorContent] = useState("");
  const [tasks, setTasks] = useState([]);
  const [chatTemplate, setChatTemplate] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const messagesEndRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const getsChatDetails = async () => {
    try {
      const url = `${CHAT_API}/chats/chatsaccountwise/`;
      const response = await fetch(url + _id);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log("get chat by id", data);

      setChatDetails(data.chat);
      setChatSubject(data.chat.chatsubject);
      setChatTemplate(data.chat.chattemplateid);
      setTime(data.chat.updatedAt);
      setAccountName(data.chat.accountid.accountName);
      setChatDescriptions(data.chat.description || []);
      setTasks(data.chat.clienttasks.flat());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Check if message is within 10 minutes
  const canEditMessage = (messageTime) => {
    if (!messageTime) return false;
    
    const messageTimestamp = new Date(messageTime).getTime();
    const currentTime = new Date().getTime();
    const tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds
    
    return (currentTime - messageTimestamp) <= tenMinutes;
  };

  // Edit message function for client
  const handleEditMessage = (message) => {
    if (!canEditMessage(message.time)) {
      toast.error("Cannot edit message after 10 minutes");
      return;
    }
    
    setEditingMessage(message);
    setEditContent(message.message);
    setEditDialogOpen(true);
    setAnchorEl(null);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim() || !editingMessage) return;

    try {
      const raw = JSON.stringify({
        chatId: _id,
        messageId: editingMessage._id,
        newMessage: editContent,
      });

      const response = await fetch(
        `${CHAT_API}/chats/chatsaccountwise/chatmessage/bymessageid/update`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: raw,
        }
      );

      if (!response.ok) throw new Error("Failed to update message");

      toast.success("Message updated successfully");
      setEditDialogOpen(false);
      setEditingMessage(null);
      setEditContent("");
      
      getsChatDetails();
    } catch (error) {
      console.error("Error updating message:", error);
      toast.error("Failed to update message");
    }
  };

  const handleCancelEdit = () => {
    setEditDialogOpen(false);
    setEditingMessage(null);
    setEditContent("");
  };

  // Delete message function for client
  const handleDeleteMessage = async (messageToDelete) => {
    try {
      const raw = JSON.stringify({
        chatId: _id,
        messageId: messageToDelete._id,
      });

      const response = await fetch(
        `${CHAT_API}/chats/chatsaccountwise/chatmessage/bymessageid/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: raw,
        }
      );

      if (!response.ok) throw new Error("Failed to delete message");

      toast.success("Message deleted successfully");
      getsChatDetails();
      setAnchorEl(null);
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  const handleCheckboxChange = (index) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task, i) =>
        i === index
          ? { ...task, checked: !task.checked }  // ✅ toggle boolean
          : task
      );

      updateClientTask(updatedTasks);
      return updatedTasks;
    });
  };

  const handleTaskToggle = (id) => {
    setTasks((prevTasks) => {
      const updated = prevTasks.map((task) =>
        task.id === id ? { ...task, checked: !task.checked } : task
      );

      updateClientTask(updated);
      return updated;
    });
  };

  const updateClientTask = (updatedTasks) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      chatId: _id,
      taskUpdates: updatedTasks.map((task) => ({
        id: task.id,
        text: task.text,
        checked: task.checked, 
      })),
    });

    console.log("Payload to Backend:", raw);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${CHAT_API}/chats/chatsaccountwise/updateTaskCheckedStatus`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("Backend response:", result);
        toast.success("Task updated");
        const allChecked = updatedTasks.every(
          (task) => task.checked === true 
        );

        if (allChecked) {
          const taskMessages =
            `completed client tasks <br>` +
            updatedTasks.map((task) => `• <s>${task.text}</s>`).join("<br>");
          console.log(
            "All tasks are checked. Updating description:",
            taskMessages
          );
          updateChatDescription(taskMessages);
        } else {
          console.log("Not all tasks are checked. Description not updated.");
        }
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  useEffect(() => {
    getsChatDetails();
  }, []);

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${day} ${month} ${formattedHours}:${formattedMinutes} ${period}`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatDescriptions]);

  const handleMenuClick = (event, message) => {
    setAnchorEl(event.currentTarget);
    setSelectedMessage(message);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMessage(null);
  };

  const updateChatDescription = (message = "") => {
    const contentToSend = message.trim() || editorContent.trim();
    if (!contentToSend) return;

    setIsSending(true);

    const newDescription = {
      message: contentToSend,
      fromwhome: "client",
      senderid: accountName,
    };

    if (replyTo) {
      newDescription.replyTo = replyTo._id;
    }

    const raw = JSON.stringify({
      newDescriptions: [newDescription],
    });

    fetch(`${CHAT_API}/chats/chatsaccountwise/chatmessagefromclient/${_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: raw,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update");
        return response.json();
      })
      .then((data) => {
        setChatDescriptions(prev => [
          ...prev,
          { ...newDescription, time: new Date().toISOString() }
        ]);
        setEditorContent("");
        setReplyTo(null);
        toast.success(data.message || "Message sent");
        setIsSending(false);
        getsChatDetails();
      })
      .catch(() => {
        toast.error("Send failed");
        setIsSending(false);
      });
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
    @keyframes flashHighlight {
      0% { background-color: #fff2b3; }
      100% { background-color: transparent; }
    }
  `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
        flexGrow: 1,
        height: "90vh",
        p: 1,
      }}
    >
      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCancelEdit}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Message</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, minHeight: 200 }}>
            <Editor 
              onChange={setEditContent} 
              value={editContent} 
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit}>Cancel</Button>
          <Button 
            onClick={handleSaveEdit} 
            variant="contained"
            disabled={!editContent.trim()}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={2}>
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ height: "89vh", p: 2 }}
        >
          <Box>
            <Typography
              variant="h6"
              component="p"
              gutterBottom
              sx={{ fontWeight: "600" }}
            >
              {chatsubject}
            </Typography>
          </Box>
          <Divider />
          <Box height={"42vh"} sx={{ overflowY: "auto", mt: 1, mb: 1 }}>
            {Array.isArray(chatDescriptions) &&
              chatDescriptions.length > 0 &&
              chatDescriptions.map((desc, index) => {
                const isClient = desc.fromwhome?.toLowerCase() === "client";
                const isAdmin = desc.fromwhome?.toLowerCase() === "admin";
                const messageTime = desc.time
                  ? formatDate(desc.time)
                  : "Just now";
                
                // Check if client message can be edited
                const isEditable = isClient && canEditMessage(desc.time);

                let senderDisplayName = "";
                if (isClient) {
                  senderDisplayName = "You";
                } else if (isAdmin && desc.senderid) {
                  senderDisplayName = desc.senderid;
                }

                return (
                  <Box
                    key={desc._id || index}
                    ref={(el) => {
                      if (desc._id) {
                        messageRefs.current[desc._id] = el;
                      }
                    }}
                    sx={{
                      display: "flex",
                      justifyContent: isClient ? "flex-end" : "flex-start",
                      mb: 2,
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: "75%",
                        backgroundColor:
                          desc._id === highlightedId
                            ? "#fff2b3"
                            : isAdmin
                            ? "#ffe6e6"
                            : "#e6f0ff",
                        p: 2,
                        borderRadius: 2,
                        borderTopLeftRadius: isClient ? 16 : 4,
                        borderTopRightRadius: isClient ? 4 : 16,
                        boxShadow: 1,
                        position: "relative",
                      }}
                    >
                      {/* Show Reply Preview */}
                      {desc.replyTo &&
                        (() => {
                          const repliedMsg = chatDescriptions.find(
                            (msg) => msg._id === desc.replyTo
                          );
                          if (!repliedMsg) return null;

                          return (
                            <Box
                              sx={{
                                backgroundColor: "#f5f5f5",
                                borderLeft: "3px solid #1976d2",
                                px: 1,
                                py: 0.5,
                                mb: 1,
                              }}
                            >
                              <Typography
                                variant="caption"
                                fontWeight="bold"
                                sx={{ cursor: "pointer", color: "#1976d2" }}
                                onClick={() => {
                                  const el = messageRefs.current[desc.replyTo];
                                  if (el) {
                                    el.scrollIntoView({
                                      behavior: "smooth",
                                      block: "center",
                                    });
                                    setHighlightedId(desc.replyTo);
                                    setTimeout(
                                      () => setHighlightedId(null),
                                      2000
                                    );
                                  }
                                }}
                              >
                                {repliedMsg.fromwhome === "client"
                                  ? "You"
                                  : repliedMsg.senderid || "Admin"}
                              </Typography>

                              <Typography
                                variant="body2"
                                sx={{ fontStyle: "italic", color: "#555" }}
                                dangerouslySetInnerHTML={{
                                  __html:
                                    repliedMsg.message?.length > 100
                                      ? repliedMsg.message.slice(0, 100) + "..."
                                      : repliedMsg.message,
                                }}
                              />
                            </Box>
                          );
                        })()}

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          color: "#333",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          component="p"
                          gutterBottom
                          sx={{ fontWeight: "600" }}
                        >
                          {senderDisplayName}
                        </Typography>

                        {/* Show menu icon for all messages (all have at least Reply option) */}
                        <MoreVertIcon
                          fontSize="small"
                          sx={{ cursor: "pointer" }}
                          onClick={(e) => handleMenuClick(e, desc)}
                        />
                        
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={() => setAnchorEl(null)}
                          PaperProps={{
                            elevation: 1,
                            sx: {
                              boxShadow: "none",
                              borderRadius: "8px",
                              border: "1px solid #ccc",
                            },
                          }}
                        >
                          {/* Reply option - available for all messages */}
                          <MenuItem
                            onClick={() => {
                              setReplyTo(selectedMessage);
                              setAnchorEl(null);
                            }}
                          >
                            Reply
                          </MenuItem>
                          
                          {/* Edit and Delete options - only for client messages */}
                          {selectedMessage?.fromwhome?.toLowerCase() === "client" && (
                            <>
                              {/* Edit option - only if within 10 minutes */}
                              {canEditMessage(selectedMessage.time) && (
                                <Box>
                                <MenuItem
                                  onClick={() => handleEditMessage(selectedMessage)}
                                >
                                  {/* <EditIcon fontSize="small" sx={{ mr: 1 }} /> */}
                                  Edit
                                </MenuItem>
                                 {/* Delete option - always available for client messages */}
                              <MenuItem
                                onClick={() => {
                                  handleDeleteMessage(selectedMessage);
                                }}
                              >
                                {/* <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> */}
                                Delete
                              </MenuItem>
                              </Box>
                              )}
                              
                             
                            </>
                          )}
                        </Menu>
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: "pre-wrap", color: "#333" }}
                        dangerouslySetInnerHTML={{
                          __html:
                            typeof desc.message === "string"
                              ? desc.message
                              : "No message available",
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          textAlign: "right",
                          color: "gray",
                          mt: 1,
                        }}
                      >
                        {messageTime}
                        {isClient && !isEditable && desc.time && (
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{
                              display: "block",
                              fontStyle: "italic",
                              color: "#888",
                              mt: 0.5,
                            }}
                          >
                            (Edit expired)
                          </Typography>
                        )}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 2,
              alignItems: "start",
            }}
          >
            {replyTo && (
              <Box
                sx={{
                  gridColumn: "1 / -1",
                  mb: 1,
                  p: 1.5,
                  backgroundColor: "#f4f6f8",
                  borderLeft: "4px solid #1976d2",
                  borderRadius: 1,
                  position: "relative",
                }}
              >
                <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
                  Replying to:{" "}
                  {replyTo.fromwhome === "client"
                    ? "You"
                    : replyTo.senderid || "Admin"}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ fontStyle: "italic", whiteSpace: "pre-wrap", pr: 4 }}
                  dangerouslySetInnerHTML={{
                    __html:
                      replyTo.message?.length > 100
                        ? `${replyTo.message.slice(0, 100)}...`
                        : replyTo.message,
                  }}
                />

                <IconButton
                  size="small"
                  onClick={() => setReplyTo(null)}
                  sx={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    color: "#777",
                    "&:hover": { color: "#000" },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}

            <Editor onChange={handleEditorChange} value={editorContent} />
            <Button
              onClick={() => updateChatDescription()}
              disabled={isSending || !editorContent.trim()}
              sx={{
                backgroundColor: 'text.menu',
                height: "fit-content",
                alignSelf: "end",
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'menu.dark',
                  boxShadow: 1,
                },
                transition: 'background-color 0.2s ease'
              }}
              color="primary"
            >
              {isSending ? <CircularProgress size={24} color="inherit" /> : "Send"}
            </Button>
          </Box>
        </Grid>
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ height: "89vh", p: 2 }}
        >
          <Box>
            <Typography
              variant="h6"
              component="p"
              gutterBottom
              sx={{ fontWeight: "600" }}
            >
              Client Tasks
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box display="flex" flexDirection="column" gap={2}>
              {tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <Box
                    key={task.id}
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <Checkbox
                      checked={task.checked}
                      onChange={() => handleTaskToggle(task.id)}
                    />
                    <Box
                      sx={{
                        p: 1,
                        width: "100%",
                        textDecoration: task.checked ? "line-through" : "none",
                      }}
                    >
                      <Typography variant="body1">{task.text}</Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No task is assigned
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UpdateChat;
