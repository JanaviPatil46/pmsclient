import React, { useEffect, useState ,useContext} from "react";
import DocuSealMultiSigner from "./DocuSealMultiSigner"; // adjust the path
import { LoginContext } from "../../context/Context";
const DocuSealWrapper = () => {
  const [data, setData] = useState(null); // response from backend
  const [loading, setLoading] = useState(true);
 const [targetEmail,setTargetEmail]= useState(sessionStorage.getItem("email"))
//  const { logindata } = useContext(LoginContext);
 const SIGNATURE_API =process.env.REACT_APP_ESIGNATURE_API

    
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
  if (!data || !Array.isArray(data.submissions)) return <p></p>;

  return (
    <DocuSealMultiSigner
      submissions={data.submissions}
      targetEmail={targetEmail}
    />
  );
};

export default DocuSealWrapper;

// import React from 'react'
// import { Box } from '@mui/material'
// import { useEffect, useState } from "react";
// import SignatureList from './SignatureList';
// const DocuSealWrapper = ({accountId}) => {
//     const [esignList, setEsignList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [targetEmail,setTargetEmail]= useState(sessionStorage.getItem("email"))
//   useEffect(() => {
//     const fetchEsignList = async () => {
//       try {
//         const response = await fetch(
//           `https://snptaxes.com/signautrelist/${accountId}`,
//           { method: "GET", redirect: "follow" }
//         );

//         const data = await response.json();
//         console.log("Response Data:", data);

//         setEsignList(data);
//       } catch (error) {
//         console.error("Error fetching list:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEsignList();
//   }, []);
//   return (
//    <Box>
// {esignList && esignList.length > 0 && (
//   <SignatureList
//     documentsList={esignList}
//     targetEmail={targetEmail}
//   />
// )}

//    </Box>
//   )
// }

// export default DocuSealWrapper