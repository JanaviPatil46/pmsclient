import React, { useContext, useEffect, useState } from "react";
import QuickLinks from "../components/QuickLinks";
import OrganizersList from "../components/Home Components/OrganizersList";
import BillingList from "../components/Home Components/BillingList";
import DocumentsList from "../components/Home Components/DocumentsList";
import ChatsList from "../components/Home Components/ChatsList";
import ProposalsList from "../components/Home Components/ProposalsList";
import axios from "axios";
import { LoginContext } from "../context/Context";
import DocuSealWrapper from "../components/Home Components/DocuSealWrapper";
import DocumnetApprovals from "../components/Home Components/DocumnetApprovals";
import { set } from "lodash";
import DocuSealMultiSigner from "../components/Home Components/DocuSealMultiSigner";
import PendingApprovals from "../components/Home Components/PendingApprovals";
const Home = () => {
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  // const { logindata } = useContext(LoginContext);
//  const { selectedUser, refreshKey } = useContext(LoginContext);
//      const [userData, setUserData] = useState("");
//   const [loginUserId, setLoginUserId] = useState();
//   console.log("login data", logindata);
//      const LOGIN_API = process.env.REACT_APP_USER_LOGIN
//   useEffect(() => {
//     if (logindata?.user?.id) {
//       setLoginUserId(logindata.user.id);
//     }
//   }, [logindata]);

  // useEffect(() => {
  //   if (loginUserId) {
  //     fetchAccountId();
  //   }
  // }, [loginUserId]);

  //  useEffect(() => {
  //     if (loginUserId) {
  //       fetchUserData(loginUserId);
  //     }
  //   }, [loginUserId]);
  //   const fetchUserData = async (id) => {

  //   const requestOptions = {
  //     method: "GET",
  //     redirect: "follow",
  //   };

  //   const url = `${LOGIN_API}/common/user/${id}`;

  //   try {
  //     const response = await fetch(url, requestOptions);
  //     const result = await response.json();
  //     console.log("users detials", result);
  //     if (result.email) {
  //       setUserData(result.email);
  //     }
      
     
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //   }
  // };
  // const [accountId, setAccountId] = useState();
  // const [adminUserId,setAdminUserId]= useState()
  // const fetchAccountId = async () => {
  //   const requestOptions = {
  //     method: "GET",
  //     redirect: "follow",
  //   };

  //   try {
  //     const response = await fetch(
  //       `${ACCOUNT_API}/accounts/accountdetails/accountdetailslist/listbyuserid/${loginUserId}`,
  //       requestOptions
  //     );
  //     const result = await response.json();
  //     console.log("result", result);
  //     if (result.accounts && result.accounts.length > 0) {
  //       setAccountId(result.accounts[0]._id); // ✅ Setting accountId
  //       setAdminUserId(result.accounts[0].adminUserId.email)
  //     }
  //   } catch (error) {
  //     console.error("Error fetching account details:", error);
  //   }
  // };
  // console.log("accountid", accountId);

   
     const [accountId, setAccountId] = useState(sessionStorage.getItem("accountId"));
     console.log("accountId from home",accountId)
  const [adminUserId,setAdminUserId]= useState("")
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
      setAdminUserId(res.data.adminUserId.emailSyncEmail)
      // console.log("admin user id",res.data.adminUserId.email)
    } catch (error) {
      console.error("Error fetching account details:", error);
    }
  };

    useEffect(() => {
    // if (loginUserId) {
      fetchAccountDetails();
    // }
  }, [accountId]);
  return (
    <div className="w-full max-w-[1700px] flex-1 h-[90vh] overflow-auto p-2">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-5">
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border bg-muted/40">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <p className="text-sm font-semibold text-foreground tracking-tight">Waiting for action</p>
            </div>
            <div className="divide-y divide-border">
              <OrganizersList accountId={accountId} />
              <BillingList accountId={accountId} />
              <ChatsList accountId={accountId} />
              <ProposalsList accountId={accountId} />
              <DocuSealWrapper accountId={accountId} />
              <DocuSealMultiSigner accountId={accountId} />
              <DocumnetApprovals accountId={accountId} adminUserId={adminUserId} />
              <PendingApprovals accountId={accountId} adminUserId={adminUserId} />
            </div>
          </div>
        </div>
        <div>
          <QuickLinks accountId={accountId} accountName={accountName} />
        </div>
      </div>
    </div>
  );
};

export default Home;
