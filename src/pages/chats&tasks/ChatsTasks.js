import { useState, useEffect, useContext, useCallback } from "react";
import { LoginContext } from "../../context/Context";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NewChat from "./NewChat";
import { Send } from "lucide-react";

const ChatsTasks = () => {
   const CHAT_API = process.env.REACT_APP_CHAT_API;
    const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const navigate = useNavigate();
  const { logindata } = useContext(LoginContext);
  const [loginuserid, setLoginUserId] = useState("");
  const [accId, setAccId] = useState("");
   const [accountId, setAccountId] = useState(sessionStorage.getItem("accountId"));
 
  const [chatList, setChatList] = useState([]);

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
      .catch((error) => console.error(error));
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
    <div className="w-full max-w-[1700px] flex-1 h-[90vh] overflow-auto p-2">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Chats &amp; Tasks</h1>
          {chatList.length > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5">{chatList.length} conversation{chatList.length !== 1 ? "s" : ""}</p>
          )}
        </div>
        <button
          onClick={handleOpen}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
        >
          <Send size={13} />
          New Chat
        </button>
      </div>

      {/* Chat list */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {chatList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Send size={28} className="mb-3 opacity-30" />
            <p className="text-sm">No active conversations</p>
          </div>
        ) : (
          chatList.map((chat, index) => {
            const unreadCount = countUnreadAdminMessages(chat);
            const formattedTime = new Date(chat.updatedAt)
              .toLocaleDateString("en-US", { month: "short", day: "2-digit" })
              .replace(",", "");
            const initials = (chat.accountid?.accountName || "?").slice(0, 2).toUpperCase();

            return (
              <div
                key={index}
                className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors hover:bg-muted/50 border-b border-border last:border-0 ${
                  unreadCount > 0 ? "bg-primary/[0.03]" : ""
                }`}
                onClick={() => handleShowChat(chat._id)}
              >
                {/* Avatar */}
                <div className="shrink-0 h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                  {initials}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h2 className="text-sm font-semibold text-foreground truncate">{chat.chatsubject}</h2>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{formattedTime}</span>
                  </div>
                  <div className="flex items-center justify-between gap-1 mt-0.5">
                    <span className="text-xs text-muted-foreground truncate">
                      {(() => {
                        const messages = chat.description || [];
                        const latest = messages[messages.length - 1];
                        if (!latest) return "No messages yet";
                        const clean = latest.message?.replace(/<[^>]+>/g, "") || "";
                        const sender = latest.fromwhome === "client" ? "You" : latest.senderid || "";
                        return `${sender}: ${clean.length > 40 ? clean.slice(0, 40) + "…" : clean}`;
                      })()}
                    </span>
                    {unreadCount > 0 && (
                      <span className="shrink-0 h-5 min-w-[1.25rem] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <NewChat open={open} close={handleClose} accId={accountId} loginuserid={loginuserid} accountName={accountName} />
    </div>
  );
};

export default ChatsTasks;