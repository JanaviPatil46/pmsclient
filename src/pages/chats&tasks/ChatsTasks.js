import { useState, useEffect, useContext, useCallback } from "react";
import { LoginContext } from "../../context/Context";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NewChat from "./NewChat";
import { Send, MessageSquare, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { PageTransition, ChatSkeletonRows } from "../../components/ui/motion";

const ChatsTasks = () => {
   const CHAT_API = process.env.REACT_APP_CHAT_API;
    const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const navigate = useNavigate();
  const { logindata } = useContext(LoginContext);
  const [loginuserid, setLoginUserId] = useState("");
  const [accId, setAccId] = useState("");
   const [accountId, setAccountId] = useState(sessionStorage.getItem("accountId"));
 
  const [chatList, setChatList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
   const [accountName,setAccountName]= useState("")
   const fetchAccountDetails = async () => {
    try {
      const res = await axios.get(
        `https://www.snptaxes.com/api/accounts/${accountId}`
      );
      // setAccount(res.data);
      console.log("result account", res.data);
      setAccountName(res.data.accountName)
      console.log("account name",res.data.accountName)
      // setAdminUserId(res.data.adminUserId)
    } catch (error) {
      console.error("Error fetching account details:", error);
    }
  };

    useEffect(() => {
    // if (loginUserId) {
      fetchAccountDetails();
    // }
  }, [accountId]);
console.log("accountid",accountId)
  const accountwiseChatlist = (accountId) => {
    setIsLoading(true);
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const url = `${CHAT_API}/chats/chatsaccountwise/isactivechat/${accountId}/true`;

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("chats result",result)
        if (result.chataccountwise && result.chataccountwise.length > 0) {
          setChatList(result.chataccountwise);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  };
 useEffect(() => {
    // if (loginUserId) {
      accountwiseChatlist(accountId);
    // }
  }, [accountId]);
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
      await axios.patch(`${CHAT_API}/chats/mark-all-read/${chatId}/accounts/${accountId}/Admin`);
      console.log("selected chat",chatId)
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
    accountwiseChatlist(accountId, true);
  };

  return (
    <PageTransition className="w-full max-w-[1700px] flex-1 h-[90vh] overflow-auto">
      <div className="p-4 sm:p-6 flex flex-col gap-5">

        {/* Page header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <MessageSquare size={16} className="text-primary" strokeWidth={1.8} />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Chats &amp; Tasks</h1>
              {chatList.length > 0 && (
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground border border-border">
                  {chatList.length}
                </span>
              )}
            </div>
            <p className="text-[13px] text-muted-foreground pl-10">Your active conversations and task threads.</p>
          </div>
          <button
            onClick={handleOpen}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-[13px] font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all duration-150"
          >
            <Plus size={14} strokeWidth={2.5} />
            New Chat
          </button>
        </div>

        {/* Chat list card */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          {isLoading ? (
            <ChatSkeletonRows rows={5} />
          ) : chatList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <MessageSquare size={22} className="text-muted-foreground" strokeWidth={1.5} />
              </div>
              <p className="text-sm font-medium text-foreground">No active conversations</p>
              <p className="text-[13px] text-muted-foreground">Start a new chat to get in touch with your team.</p>
            </div>
          ) : (
            chatList.map((chat, index) => {
              const unreadCount = countUnreadAdminMessages(chat);
              const formattedTime = new Date(chat.updatedAt)
                .toLocaleDateString("en-US", { month: "short", day: "2-digit" })
                .replace(",", "");
              const initials = (chat.accountid?.accountName || "?").slice(0, 2).toUpperCase();

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex items-center gap-3 px-5 py-3.5 cursor-pointer transition-all duration-150 hover:bg-muted/50 border-b border-border/60 last:border-0 ${
                    unreadCount > 0 ? "bg-primary/[0.03]" : ""
                  }`}
                  onClick={() => handleShowChat(chat._id)}
                >
                  {/* Avatar */}
                  <div className="shrink-0 h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold tracking-wide">
                    {initials}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className={`text-[13px] font-semibold truncate ${ unreadCount > 0 ? "text-foreground" : "text-foreground/80" }`}>
                        {chat.chatsubject}
                      </h2>
                      <span className="shrink-0 text-[11px] text-muted-foreground">{formattedTime}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <span className="text-[12px] text-muted-foreground truncate">
                        {(() => {
                          const messages = chat.description || [];
                          const latest = messages[messages.length - 1];
                          if (!latest) return "No messages yet";
                          const clean = latest.message?.replace(/<[^>]+>/g, "") || "";
                          const sender = latest.fromwhome === "client" ? "You" : latest.senderid || "";
                          return `${sender}: ${clean.length > 45 ? clean.slice(0, 45) + "…" : clean}`;
                        })()}
                      </span>
                      {unreadCount > 0 && (
                        <span className="shrink-0 h-[18px] min-w-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

      </div>
      <NewChat open={open} close={handleClose} accId={accountId} loginuserid={loginuserid} accountName={accountName} />
    </PageTransition>
  );
};

export default ChatsTasks;