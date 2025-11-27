import React, { useEffect, useState ,useContext} from "react";
import DocuSealMultiSigner from "./DocuSealMultiSigner"; // adjust the path
import { LoginContext } from "../../context/Context";
const DocuSealWrapper = () => {
  const [data, setData] = useState(null); // response from backend
  const [loading, setLoading] = useState(true);
 const [targetEmail,setTargetEmail]= useState(sessionStorage.getItem("email"))
 const[accountId,setAccountId]= useState(sessionStorage.getItem("accountId"))


     

  useEffect(() => {
    const fetchSignatureList = async () => {
      try {
        const response = await fetch(
          `https://snptaxes.com/signautrelist/${accountId}`,
          { method: "GET", redirect: "follow" }
        );

        const result = await response.json(); // use .json() if backend returns JSON
        console.log("result signature",result);
        setData(result);

      } catch (error) {
        console.error("Error fetching signature list:", error);
      }
    };

    fetchSignatureList();
  }, []); // empty array → runs only once on mount



  if (loading) return <p></p>;
  if (!data || !Array.isArray(data)) return <p></p>;

  return (
    <DocuSealMultiSigner
      submissions={data}
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