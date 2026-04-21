import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "../../components/ui/motion";
import { FileText, FolderOpen, ChevronRight, File } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ease = [0.16, 1, 0.3, 1];

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, delay: i * 0.05, ease },
  }),
};

const DocumentsList = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const accountId = sessionStorage.getItem("accountId");
    if (!accountId) {
      setIsLoading(false);
      return;
    }

    const fetchDocs = async () => {
      try {
        const res = await fetch(
          `https://www.snptaxes.com/api/accountsdoc/files/list/clientView?folderPath=${accountId}`
        );
        const data = await res.json();
        if (res.ok && Array.isArray(data.contents)) {
          const files = [];
          const collect = (items) => {
            items.forEach((item) => {
              if (item.type === "file") files.push(item);
              if (item.children?.length) collect(item.children);
            });
          };
          collect(data.contents);
          setDocuments(files.slice(0, 5));
        }
      } catch (_) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocs();
  }, []);

  const getFileIcon = (name = "") => {
    const ext = name.split(".").pop().toLowerCase();
    if (ext === "pdf") return <FileText size={14} className="shrink-0 text-red-500" />;
    if (["jpg", "jpeg", "png", "gif"].includes(ext))
      return <File size={14} className="shrink-0 text-blue-500" />;
    if (["doc", "docx"].includes(ext))
      return <FileText size={14} className="shrink-0 text-blue-700" />;
    if (["xls", "xlsx"].includes(ext))
      return <FileText size={14} className="shrink-0 text-green-600" />;
    return <FileText size={14} className="shrink-0 text-muted-foreground" />;
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <FolderOpen size={14} className="text-amber-500 shrink-0" />
          <span className="text-[13px] font-semibold text-foreground">Documents</span>
        </div>
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/client/documents")}
          className="inline-flex items-center gap-0.5 text-[12px] font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          See All <ChevronRight size={12} />
        </motion.button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex flex-col gap-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-3 py-2.5">
              <Skeleton className="h-4 w-4 rounded shrink-0" />
              <Skeleton className={`h-3 rounded flex-1 ${i % 2 === 0 ? "w-3/4" : "w-1/2"}`} />
              <Skeleton className="h-3 w-14 rounded shrink-0" />
            </div>
          ))}
        </div>
      ) : documents.length > 0 ? (
        <AnimatePresence>
          <div className="flex flex-col gap-1.5">
            {documents.map((doc, i) => (
              <motion.div
                key={doc.path || i}
                custom={i}
                variants={itemVariants}
                initial="hidden"
                animate="show"
                whileHover={{ scale: 1.01, translateY: -1 }}
                className="group flex items-center gap-2 rounded-lg border border-border/60 bg-card px-3 py-2.5 cursor-pointer hover:border-border hover:shadow-sm transition-shadow duration-150"
              >
                {getFileIcon(doc.name)}
                <span className="flex-1 truncate text-[13px] text-foreground min-w-0">
                  {doc.name}
                </span>
                {doc.meta?.uploadedAt && (
                  <span className="shrink-0 text-[11px] text-muted-foreground font-medium">
                    {new Date(doc.meta.uploadedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                    })}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease }}
          className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-8 gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            <FolderOpen size={16} className="text-muted-foreground" strokeWidth={1.5} />
          </div>
          <p className="text-[13px] font-medium text-foreground">No documents</p>
          <p className="text-[12px] text-muted-foreground">Files will appear here once uploaded.</p>
        </motion.div>
      )}
    </div>
  );
};

export default DocumentsList;