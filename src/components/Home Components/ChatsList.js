import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Stack, Typography } from "@mui/material";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
const ChatsList = ({ accountId }) => {
  const CHAT_API  = process.env.REACT_APP_CHAT_API
  const [chats, setChats] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchUnreadChats = async () => {
      try {
        const response = await axios.get(
          `${CHAT_API}/chats/unread/${accountId}/Admin`
        );
        setChats(response.data.chats || []);
        console.log("unread chat messages:", response.data.chats);
      } catch (error) {
        console.error("Error fetching unread chats:", error);
      }
    };

    if (accountId) {
      fetchUnreadChats();
    }
  }, [accountId]);

  const stripHtmlAndLimit = (html, wordLimit) => {
    if (!html) return "";
    const plainText = html.replace(/<[^>]+>/g, " "); // strip HTML tags
    const words = plainText.trim().split(/\s+/);
    if (words.length <= wordLimit) return plainText.trim();
    return words.slice(0, wordLimit).join(" ") + " ...";
  };
  const navigate = useNavigate();

  // const handleShowChat = (chatId) => {
  //   // Navigate to the chat update page with the chat ID
  //   navigate(`/updatechat/${chatId}`);

  // };

  const handleShowChat = async (chatId) => {
    try {
      // Mark as read
      await axios.patch(
        `${CHAT_API}/chats/mark-all-read/${chatId}/accounts/${accountId}/Admin`
      );

      // Navigate to the chat
      navigate(`/client/updatechat/${chatId}`);

      // Update local state
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  return (
    <>
      {/* {chats.length > 0 && (
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
              Chats & Tasks ({chats.length})
            </Typography>
          </Stack>

          <Box mt={2}>

            {chats.map((chat) => {
              const sender = chat.sender.username || "Unknown Sender";
              const message = chat.message || "";

              return (
                <Stack key={chat._id} mb={1.5}>
                  <Paper
                    sx={{ p: 2, cursor: "pointer" }}
                    onClick={() => handleShowChat(chat.chatId, chat.messageId)}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">
                      {chat.chatSubject}
                    </Typography>
                    <Stack direction="row" alignItems="flex-start" spacing={1}>
                      <SendIcon
                        fontSize="small"
                        sx={{ color: theme.palette.success.main, mt: "3px" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {sender} : {stripHtmlAndLimit(message, 15)}
                      </Typography>
                    </Stack>
                  </Paper>
                </Stack>
              );
            })}
          </Box>
        </Box>
      )} */}
      {chats.length > 0 && (
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
              Chats & Tasks ({chats.length})
            </Typography>
          </Stack>

          <Box mt={2}>
            {chats.map((chat) => {
              // Get the most recent message (last in the array since they're sorted)
              const mostRecentMessage = chat.messages[chat.messages.length - 1];
              const sender =
                mostRecentMessage.sender.username || "Unknown Sender";
              const message = mostRecentMessage.message || "";

              return (
                <Stack key={chat.chatId} mb={1.5}>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      boxShadow: 1,
                      transition: "all 0.3s",
                      cursor: "pointer",
                      "&:hover .sign-link": {
                        opacity: 1,
                        visibility: "visible",
                        textDecoration: "none",
                        cursor: "pointer",
                      },
                      position: "relative",
                    }}
                    onClick={() => handleShowChat(chat.chatId)}
                  >
                    {/* Show unread count badge if there are multiple messages */}
                    {chat.unreadCount > 1 && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: theme.palette.success.main,
                          color: "white",
                          borderRadius: "50%",
                          width: 20,
                          height: 20,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.7rem",
                        }}
                      >
                        {chat.unreadCount}
                      </Box>
                    )}

                    <Typography variant="subtitle2" fontWeight="bold">
                      {chat.chatSubject}
                    </Typography>
                    <Stack direction="row" alignItems="flex-start" spacing={1}>
                      <SendIcon
                        fontSize="small"
                        sx={{ color: theme.palette.success.main, mt: "3px" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {sender} : {stripHtmlAndLimit(message, 15)}
                      </Typography>
                    </Stack>
                  </Paper>
                </Stack>
              );
            })}
          </Box>
        </Box>
      )}
    </>
  );
};

export default ChatsList;
