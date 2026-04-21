import React, { useEffect, useState } from "react";
import axios from "axios";
import { MessageSquare, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
const ChatsList = ({ accountId }) => {
  const CHAT_API = process.env.REACT_APP_CHAT_API;
  const [chats, setChats] = useState([]);

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
        <div className="px-5 py-3">
          <div className="flex items-center gap-2 mb-2.5">
            <MessageSquare size={13} className="text-blue-400 shrink-0" />
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Chats & Tasks</span>
            <span className="ml-auto text-[11px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
              {chats.length}
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {chats.map((chat) => {
              const mostRecentMessage = chat.messages[chat.messages.length - 1];
              const sender = mostRecentMessage.sender || "Unknown Sender";
              const message = mostRecentMessage.message || "";
              return (
                <div
                  key={chat.chatId}
                  onClick={() => handleShowChat(chat.chatId)}
                  className="group relative flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background px-3.5 py-2.5 cursor-pointer hover:bg-muted/50 hover:border-border transition-all duration-200"
                >
                  {chat.unreadCount > 1 && (
                    <span className="absolute top-2 right-8 min-w-[18px] h-[18px] rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
                      {chat.unreadCount}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-foreground truncate">{chat.chatSubject}</p>
                    <p className="text-[12px] text-muted-foreground truncate mt-0.5">
                      {sender}: {stripHtmlAndLimit(message, 15)}
                    </p>
                  </div>
                  <ArrowRight size={13} className="shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatsList;
