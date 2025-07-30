import React, { useEffect, useState ,useContext} from "react";
import DocuSealMultiSigner from "./DocuSealMultiSigner"; // adjust the path
import { LoginContext } from "../../context/Context";
const DocuSealWrapper = () => {
  const [data, setData] = useState(null); // response from backend
  const [loading, setLoading] = useState(true);
 const [targetEmail,setTargetEmail]= useState("")
 const { logindata } = useContext(LoginContext);
 const SIGNATURE_API =process.env.REACT_APP_ESIGNATURE_API
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
        setTargetEmail(result.email);
      }
      
     
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

useEffect(() => {
  fetch(`${SIGNATURE_API}/api/submissions`)
    .then((res) => res.json())
    .then((responseData) => {
      // Filter only submissions with status "opened" or "pending"
      const filtered = responseData.submissions?.filter((sub) =>
        [ "pending"].includes(sub.status)
      );

      console.log("Filtered Submissions:", filtered);

      setData({ submissions: filtered }); // update state with filtered data
      setLoading(false);
    })
    .catch((err) => {
      console.error("Failed to fetch submissions:", err);
      setLoading(false);
    });
}, []);


  if (loading) return <p></p>;
  if (!data || !Array.isArray(data.submissions)) return <p>No data found</p>;

  return (
    <DocuSealMultiSigner
      submissions={data.submissions}
      targetEmail={targetEmail}
    />
  );
};

export default DocuSealWrapper;
