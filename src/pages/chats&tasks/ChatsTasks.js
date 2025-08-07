import {
  Button,
  Typography,
  Divider,
  Paper,
} from "@mui/material";
import Box from "@mui/material/Box";
import TelegramIcon from "@mui/icons-material/Telegram";
import Grid from "@mui/material/Grid";
import { useState, useEffect, useContext, useCallback } from "react";
import { LoginContext } from "../../context/Context";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NewChat from "./NewChat";

const ChatsTasks = () => {
   const CHAT_API = process.env.REACT_APP_CHAT_API;
    const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { logindata } = useContext(LoginContext);
  const [loginuserid, setLoginUserId] = useState("");
  const [accId, setAccId] = useState("");
  
  const fetchAccountId = useCallback((id) => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${ACCOUNT_API}/accounts/accountdetails/accountdetailslist/listbyuserid/${id}`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        setAccId(response.data.accounts[0]._id)
        accountwiseChatlist(response.data.accounts[0]._id, true);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (logindata?.user?.id) {
      const id = logindata.user.id;
      setLoginUserId(id);
      fetchAccountId(id);
    }
  }, [logindata, fetchAccountId]);

  const [chatList, setChatList] = useState([]);

  const accountwiseChatlist = (accId, ActiveTrue) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const url = `${CHAT_API}/chats/chatsaccountwise/isactivechat/${accId}/${ActiveTrue}`;

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.chataccountwise && result.chataccountwise.length > 0) {
          setChatList(result.chataccountwise);
        }
      })
      .catch((error) => console.error(error));
  };

  // Function to count unread admin messages
  const countUnreadAdminMessages = (chat) => {
    if (!chat.description || !Array.isArray(chat.description)) return 0;
    
    const unreadCount = chat.description.reduce((count, message) => {
      // Check if message is unread and from Admin
      if (message.isRead === false && message.fromwhome === "Admin") {
        return count + 1;
      }
      return count;
    }, 0);

    console.log(`Unread count for chat ${chat._id}:`, unreadCount);
    return unreadCount;
  };

  const handleShowChat = async (chatId) => {
    try {
      // Mark as read
      await axios.patch(`${CHAT_API}/chats/mark-all-read/${chatId}/accounts/${accId}/Admin`);
      
      // Navigate to the chat
      navigate(`/client/updatechat/${chatId}`);
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => { 
    setOpen(false);
    accountwiseChatlist(accId, true);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm:  "100%", md: "1700px" },
        flexGrow: 1,
        height: "90vh",
        p: 1,
      }}
    >
      <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
        <Grid item>
          <Typography variant="h4" component="p" gutterBottom sx={{ fontWeight: 600 }}>
            Chats & Tasks
          </Typography>
        </Grid>
        <Grid item>
          <Button
            size="small"
           color="primary"
            fullWidth={isSmallScreen}
            onClick={handleOpen}
            sx={{
              backgroundColor: 'text.menu',
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'menu.dark',
                boxShadow: 1,
              },
              transition: 'background-color 0.2s ease'
            }}
          >
            New Chat
          </Button>
        </Grid>
      </Grid>
      <Box>
        {chatList.length > 0 &&
          chatList.map((chat, index) => {
            const unreadCount = countUnreadAdminMessages(chat);
            const formattedTime = new Date(chat.updatedAt)
              .toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
              })
              .replace(",", "");
            
            return (
              <Box key={index}>
                <Paper
                  sx={{ p: 1, cursor: "pointer" }}
                  onClick={() => handleShowChat(chat._id)}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    mb={1}
                    gap={1.5}
                    sx={{ justifyContent: "space-between", flexDirection: "row" }}
                  >
                    <Box display="flex" alignItems="center" mb={1} gap={1.5}>
                      <TelegramIcon
                        sx={{
                          color: theme.palette.text.menu
                        }}
                        fontSize="small"
                      />
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Chat with {chat.accountid.accountName}{" "}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                      {unreadCount > 0 && (
                        <Box
                          sx={{
                            backgroundColor: theme.palette.success.main,
                            color: "white",
                            borderRadius: "50%",
                            width: 20,
                            height: 20,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.75rem",
                          }}
                        >
                          {unreadCount}
                        </Box>
                      )}
                    </Box>
                  </Box>
                  <Box sx={{}}>
                    <Typography
                      component="h2"
                      variant="subtitle2"
                      gutterBottom
                      sx={{ fontWeight: "600" }}
                    >
                      {chat.chatsubject}
                    </Typography>
                    {/* <Typography component="h2" variant="caption" gutterBottom>
                      {(() => {
                        const cleanText =
                          chat.description[0]?.message.replace(/<[^>]+>/g, "") ||
                          "";
                        const words = cleanText.split(/\s+/);
                        return words.length > 35
                          ? words.slice(0, 35).join(" ") + "..."
                          : cleanText;
                      })()}
                    </Typography> */}
     <Typography variant="caption">
                    {(() => {
                      const messages = chat.description || [];
                      const latest = messages[messages.length - 1];
                      if (!latest) return "No messages yet";

                      const clean =
                        latest.message?.replace(/<[^>]+>/g, "") || "";
                      const sender =
                        latest.fromwhome === "Admin"
                          ? "You"
                          : latest.senderid?.username || "";

                      return `${sender}: ${
                        clean.length > 35 ? clean.slice(0, 35) + "..." : clean
                      }`;
                    })()}
                  </Typography>
                    <Box textAlign="right">
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        {formattedTime}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
                <Divider sx={{ mb: 1, mt: 1 }} />
              </Box>
            );
          })}
      </Box>
      <NewChat open={open} close={handleClose} accId={accId} loginuserid={loginuserid}/>
    </Box>
  );
};

export default ChatsTasks;