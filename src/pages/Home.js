import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import React, { useContext, useEffect, useState } from "react";
import { Stack, Typography } from "@mui/material";
// import UploadFileIcon from "@mui/icons-material/UploadFile";
// import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
// import TelegramIcon from "@mui/icons-material/Telegram";
import QuickLinks from "../components/QuickLinks";
import OrganizersList from "../components/Home Components/OrganizersList";
import BillingList from "../components/Home Components/BillingList";
import DocumentsList from "../components/Home Components/DocumentsList";
import ChatsList from "../components/Home Components/ChatsList";
import ProposalsList from "../components/Home Components/ProposalsList";
// import ESignature from "../components/Home Components/eSignature"
import { LoginContext } from "../context/Context";
import DocuSealWrapper from "../components/Home Components/DocuSealWrapper";
import DocumnetApprovals from "../components/Home Components/DocumnetApprovals";
const Home = () => {
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const { logindata } = useContext(LoginContext);
 
     const [userData, setUserData] = useState("");
  const [loginUserId, setLoginUserId] = useState();
  console.log("login data", logindata);
     const LOGIN_API = process.env.REACT_APP_USER_LOGIN
  useEffect(() => {
    if (logindata?.user?.id) {
      setLoginUserId(logindata.user.id);
    }
  }, [logindata]);

  useEffect(() => {
    if (loginUserId) {
      fetchAccountId();
    }
  }, [loginUserId]);

   useEffect(() => {
      if (loginUserId) {
        fetchUserData(loginUserId);
      }
    }, [loginUserId]);
    const fetchUserData = async (id) => {

    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const url = `${LOGIN_API}/common/user/${id}`;

    try {
      const response = await fetch(url, requestOptions);
      const result = await response.json();
      console.log("users detials", result);
      if (result.email) {
        setUserData(result.email);
      }
      
     
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const [accountId, setAccountId] = useState();
  
  const fetchAccountId = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${ACCOUNT_API}/accounts/accountdetails/accountdetailslist/listbyuserid/${loginUserId}`,
        requestOptions
      );
      const result = await response.json();
      console.log("result", result);
      if (result.accounts && result.accounts.length > 0) {
        setAccountId(result.accounts[0]._id); // ✅ Setting accountId
      }
    } catch (error) {
      console.error("Error fetching account details:", error);
    }
  };
  console.log("accountid", accountId);
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
        flexGrow: 1,
        // border:'2px solid green',
        height: "90vh",
        p: 1,
      }}
    >
      <Grid container spacing={2}>
        <Grid
          size={{ xs: 12, md: 8 }}
          // sx={{ height: "88vh", overflowY: "auto" }}
        >
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: 1,
              //  marginBottom:2,
              transition: "all 0.3s",
              cursor: "pointer",
              "&:hover .sign-link": {
                opacity: 1,
                visibility: "visible",
                textDecoration: "none",
                cursor: "pointer",
              },
            }}
          >
            <Stack sx={{ p: 0 }}>
              <Typography
                variant="h6"
                component="p"
                gutterBottom
                sx={{ fontWeight: "600" }}
              >
                Waiting for action
              </Typography>
            </Stack>
            <OrganizersList accountId={accountId} />
            <BillingList accountId={accountId} />
            {/* <DocumentsList /> */}
            <ChatsList accountId={accountId} />
            <ProposalsList accountId={accountId} />
           <DocuSealWrapper/>
           <DocumnetApprovals accountId={accountId}/>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <QuickLinks accountId={accountId} loginUserId={loginUserId} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
