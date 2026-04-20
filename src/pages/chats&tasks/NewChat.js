import { useState } from "react";
import PropTypes from "prop-types";
import Editor from "../../components/Texteditor";
import { X, Send } from "lucide-react";
import { toast } from "material-react-toastify";

function NewChat({ open, close, loginuserid, accId, accountName }) {
  console.log("accountName in new chat", accountName);
  console.log("accId in new chat", accId);
  const CHAT_API = process.env.REACT_APP_CHAT_API;

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
        senderid: accountName,
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

    fetch(`${CHAT_API}/chats/chatsaccountwise/admin`, requestOptions)
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

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={close}
        />
      )}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[70vw] md:w-[42vw] bg-background border-l border-border shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/40 shrink-0">
          <div className="flex items-center gap-2">
            <Send size={16} className="text-primary" />
            <h2 className="text-base font-semibold text-foreground">New Chat</h2>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Subject */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Subject
            </label>
            <textarea
              rows={2}
              placeholder="Subject"
              value={inputText}
              onChange={handlechatsubject}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors resize-none"
            />
          </div>

          {/* Message editor */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Message
            </label>
            <Editor onChange={handleEditorChange} value={editorContent} />
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 flex gap-2 px-5 py-4 border-t border-border bg-muted/20">
          <button
            type="button"
            onClick={saveChat}
            disabled={!inputText.trim() || !editorContent.trim()}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={13} />
            Create Chat
          </button>
          <button
            type="button"
            onClick={close}
            className="flex-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

NewChat.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func.isRequired,
  loginuserid: PropTypes.string.isRequired,
  accId: PropTypes.string.isRequired,
};

export default NewChat;