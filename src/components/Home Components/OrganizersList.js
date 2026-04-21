import React, { useState, useEffect } from "react";
import { ClipboardList, ArrowRight } from "lucide-react";
import OrganizerDialog from "../../pages/Organizers/OrganizerDialog";

const OrganizersList = ({ accountId }) => {
  const ORGANIZER_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  const [organizers, setOrganizers] = useState([]);
 
  const fetchOrganizers = async () => {
    try {
      const url = `${ORGANIZER_API}/workflow/orgaccwise/organizer/pending/${accountId}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch organizerTemplatesData");
      }
      const data = await response.json();
      // console.log("organizer",data);
      setOrganizers(data.pendingOrganizers);
     
    } catch (error) {
      console.error("Error fetching organizerTemplatesData:", error);
    }
  };
  useEffect(() => {
    if (accountId) {
      fetchOrganizers();
    }
  }, [accountId]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
   const handleOpenDialog = (organizer) => {
    setSelectedOrganizer(organizer);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrganizer(null);
   fetchOrganizers();
  };
  return (
    <>
      {organizers.length > 0 && (
        <div className="px-5 py-3">
          <div className="flex items-center gap-2 mb-2.5">
            <ClipboardList size={13} className="text-primary shrink-0" />
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Organizers
            </span>
            <span className="ml-auto text-[11px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
              {organizers.length}
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {organizers.map((organizer, index) => (
              <div
                key={index}
                onClick={() => handleOpenDialog(organizer)}
                className="group flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background px-3.5 py-2.5 cursor-pointer hover:bg-muted/50 hover:border-border transition-all duration-200"
              >
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-foreground">Complete Organizer</p>
                  <p className="text-[12px] text-muted-foreground truncate mt-0.5">{organizer.organizerName}</p>
                </div>
                <ArrowRight size={13} className="shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      )}
      <OrganizerDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        organizer={selectedOrganizer}
      />
    </>
  );
};

export default OrganizersList;
