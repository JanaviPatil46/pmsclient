// import {
//   MenuItem,
//   Select,
//   FormControl,
//   Dialog,
//   DialogContent,
//   Typography,
//   DialogTitle,
//   IconButton,
//   Box,
//   TextField,
//   Button,
//   Input,
// } from "@mui/material";
// import { LinearProgress } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { useState, useEffect, useCallback, useContext } from "react";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { toast } from "material-react-toastify";
// import dayjs from "dayjs";
// import { debounce } from "lodash";
// import AddIcon from '@mui/icons-material/Add';
// import UploadDrawer from "./UploadDrawer";
// import { LoginContext } from "../../context/Context";
// import SelectableButton from "./SelectableButton";
// import FileUploadDrawer from "./FileUploadDrawer";
// import axios from "axios";
// const OrganizerDialog = ({ open, handleClose, organizer }) => {
//   console.log("organizer", organizer);
//   const [accountName, setAccountName] = useState("");
//   const{accId} = useState(sessionStorage.getItem("accountId"))
//      const fetchAccountDetails = async () => {
//     try {
//       const res = await axios.get(
//         `https://www.snptaxes.com/api/accounts/${accId}`
//       );
//       // setAccount(res.data);
//       setAccountName(res.data.accounts.accountName)
//       console.log("result", res.data);
//     } catch (error) {
//       console.error("Error fetching account details:", error);
//     }
//   };


//  useEffect(() => {
//     // if (loginUserId) {
//       fetchAccountDetails();
//     // }
//   }, [accId]);
//   const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
//   const { logindata } = useContext(LoginContext);
//   const [loginuserid, setLoginUserId] = useState();
//   useEffect(() => {
//     if (logindata?.user?.id) {
//       setLoginUserId(logindata.user.id);
//     }
//   }, [logindata]);
//   useEffect(() => {
//     if (loginuserid) {
//       console.log("loginuserid", loginuserid);
//       fetchData(loginuserid);
//       fetchAccountByUser(loginuserid);
//     }
//   }, [loginuserid]);
//   const [username, setUsername] = useState("");
//   const fetchData = async (id) => {
//     const myHeaders = new Headers();

//     const requestOptions = {
//       method: "GET",
//       headers: myHeaders,
//       redirect: "follow",
//     };
//     const url = `${LOGIN_API}/common/user/${id}`;
//     fetch(url, requestOptions)
//       .then((response) => response.json())
//       .then((result) => {
//         setUsername(result.username);
//       });
//   };
//   const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
//   const [accountId, setAccountId] = useState(sessionStorage.getItem("accountId"));
//   const fetchAccountByUser = async (id) => {
//     const myHeaders = new Headers();

//     const requestOptions = {
//       method: "GET",
//       headers: myHeaders,
//       redirect: "follow",
//     };
//     const url = `${ACCOUNT_API}/accounts/accountdetails/accountdetailslist/listbyuserid/${id}`;
//     fetch(url, requestOptions)
//       .then((response) => response.json())
//       .then((result) => {
//         setAccountId(result.accounts[0]._id);
//       });
//   };
//  const [folderTree, setFolderTree] = useState([]);
//   const [error, setError] = useState("");
//       useEffect(() => {
//          fetchFolderTree(accountId);
//       }, [accountId]);
    
//      // API call to fetch folder tree for a given template ID
//       const fetchFolderTree = async (accountId) => {
//         try {
//           const res = await fetch(`https://www.snptaxes.com/api/accountsdoc/files/list/clientView?folderPath=${accountId}`);
//           const data = await res.json();
//           console.log("janavi patil",data)
//           if (res.ok) {
//             setFolderTree(data.contents);
//           } else {
//             setError('Failed to fetch folder tree');
//           }
//         } catch (err) {
//           setError('Error fetching folder tree');
//         }
//       };
//   const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
 
//   const sections = organizer?.sections;

//   const [selectedDropdownValues, setSelectedDropdownValues] = useState({});
//   const [inputValues, setInputValues] = useState({});
//   const [selectedYesNoValues, setSelectedYesNoValues] = useState({});
//   const [radioValues, setRadioValues] = useState({});
//   const [checkboxValues, setCheckboxValues] = useState({});
//   const [answeredElements, setAnsweredElements] = useState({});
//   const [activeStep, setActiveStep] = useState(0);
//   const [startDate, setStartDate] = useState(dayjs());
//   const [uploadedFiles, setUploadedFiles] = useState({});
//   const [file, setFile] = useState(null);
//   const [isDocumentForm, setIsDocumentForm] = useState(false);
  
//   // New state for repeated sections
//   const [repeatedSections, setRepeatedSections] = useState({});

//   // Function to add a repeated section with numeric IDs
//   const addRepeatedSection = (sectionId) => {
//     setRepeatedSections(prev => {
//       const currentRepeats = prev[sectionId] || [];
//       // Create a numeric ID by adding a suffix number
//       const baseId = Number(sectionId);
//       const newRepeatId = baseId + currentRepeats.length + 1000000; // Add large number to avoid conflicts
      
//       return {
//         ...prev,
//         [sectionId]: [...currentRepeats, newRepeatId]
//       };
//     });
//   };

//   // Function to remove a repeated section
//   const removeRepeatedSection = (sectionId, repeatId) => {
//     setRepeatedSections(prev => {
//       const currentRepeats = prev[sectionId] || [];
//       const updatedRepeats = currentRepeats.filter(id => id !== repeatId);
      
//       // Clean up state for the removed section
//       cleanUpSectionData(repeatId);
      
//       return {
//         ...prev,
//         [sectionId]: updatedRepeats
//       };
//     });
//   };

//   // Clean up state data for removed sections
//   const cleanUpSectionData = (sectionId) => {
//     const numericSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
    
//     // Clean up inputValues
//     setInputValues(prev => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach(key => {
//         if (key.startsWith(`${numericSectionId}_`)) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     // Clean up radioValues
//     setRadioValues(prev => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach(key => {
//         if (key.startsWith(`${numericSectionId}_`)) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     // Clean up checkboxValues
//     setCheckboxValues(prev => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach(key => {
//         if (key.startsWith(`${numericSectionId}_`)) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     // Clean up selectedYesNoValues
//     setSelectedYesNoValues(prev => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach(key => {
//         if (key.startsWith(`${numericSectionId}_`)) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     // Clean up selectedDropdownValues
//     setSelectedDropdownValues(prev => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach(key => {
//         if (key.startsWith(`${numericSectionId}_`)) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     // Clean up answeredElements
//     setAnsweredElements(prev => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach(key => {
//         if (key.startsWith(`${numericSectionId}_`)) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     // Clean up uploadedFiles
//     setUploadedFiles(prev => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach(key => {
//         if (key.startsWith(`${numericSectionId}_`)) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });
//   };

//   // Create a debounced auto-save function
//   const debouncedAutoSave = useCallback(
//     debounce(async (data) => {
//       try {
//         const myHeaders = new Headers();
//         myHeaders.append("Content-Type", "application/json");

//         const raw = JSON.stringify(data);
//         console.log("autosave raw", raw);
//         const requestOptions = {
//           method: "PATCH",
//           headers: myHeaders,
//           body: raw,
//           redirect: "follow",
//         };

//         const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/${organizer._id}`;
//         const response = await fetch(url, requestOptions);
//         const result = await response.json();

//         if (!response.ok) {
//           throw new Error(result.message || "Failed to auto-save organizer");
//         }

//         console.log("Auto-save successful");
//       } catch (error) {
//         console.error("Error auto-saving organizer:", error);
//       }
//     }, 2000),
//     [organizer?._id]
//   );

 
// const prepareSubmitData = (finalSubmit = false) => {
//   // Get all sections in correct order (base sections with repeated sections inserted after their parent)
//   const allSectionsInOrder = getVisibleSections();

//   const sectionsData = allSectionsInOrder.map((section) => ({
//     name: section?.text || "",
//     id: section?.id || "",
//     text: section?.text || "",
//     sectionsettings: section?.sectionsettings,
//     formElements:
//       section?.formElements?.map((question) => {
//         const questionData = {
//           type: question?.type || "",
//           id: question?.id || "",
//           sectionid: Number(section?.id) || 0,
//           options:
//             question?.options?.map((option) => ({
//               id: option?.id || "",
//               text: option?.text || "",
//               selected: getOptionSelectedState(question, option, Number(section.id)),
//             })) || [],
//           text: question?.text || "",
//           textvalue: getQuestionTextValue(question, Number(section.id)),
//           questionsectionsettings: question?.questionsectionsettings,
//         };

//         // Add file metadata for file upload questions
//         if (question.type === "File Upload") {
//           const fileKey = `${section.id}_${question.text}`;
//           const fileInfo = uploadedFiles[fileKey];
          
//           if (fileInfo && fileInfo.status === 'completed') {
//             questionData.fileMetadata = {
//               fileName: fileInfo.fileName,
//               filePath: fileInfo.filePath || '',
//               uploadDate: fileInfo.uploadDate || new Date().toISOString(),
//               uploadedBy: accountName || username,
//             };
//           } else if (fileInfo) {
//             // File is still pending or uploading
//             questionData.fileMetadata = {
//               fileName: fileInfo.fileName,
//               status: fileInfo.status,
//             };
//             console.log('Saving file metadata:', questionData.fileMetadata);
//           }
//         }

//         return questionData;
//       }) || [],
//   }));

//   return {
//     sections: sectionsData,
//     status: finalSubmit ? "Completed" : "In Progress",
//     completedby: accountName,
//     active: true,
//     repeatedSections: repeatedSections,
//   };
// };
//   // Auto-save whenever relevant state changes
//   useEffect(() => {
//     if (open && organizer?._id) {
//       const data = prepareSubmitData(false);
//       debouncedAutoSave(data);
//     }
//   }, [
//     open,
//     organizer?._id,
//     inputValues,
//     radioValues,
//     checkboxValues,
//     selectedYesNoValues,
//     selectedDropdownValues,
//     startDate,
//     uploadedFiles,
//     repeatedSections,
//     debouncedAutoSave,
//   ]);

//   // Cleanup debounce on unmount
//   useEffect(() => {
//     return () => {
//       debouncedAutoSave.cancel();
//     };
//   }, [debouncedAutoSave]);

//   const handleRadioChange = (value, elementText, sectionId) => {
//     const numericSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
//     const key = `${numericSectionId}_${elementText}`;
//     setRadioValues((prevValues) => ({
//       ...prevValues,
//       [key]: value,
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));
//      // Clear validation error for this field
//     if (validationErrors[numericSectionId]?.[elementText]) {
//       setValidationErrors(prev => {
//         const newErrors = { ...prev };
//         if (newErrors[numericSectionId]) {
//           delete newErrors[numericSectionId][elementText];
//           if (Object.keys(newErrors[numericSectionId]).length === 0) {
//             delete newErrors[numericSectionId];
//           }
//         }
//         return newErrors;
//       });
//     }
//   };

//   const handleCheckboxChange = (value, elementText, sectionId) => {
//     const numericSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
//     const key = `${numericSectionId}_${elementText}`;
//     setCheckboxValues((prevValues) => ({
//       ...prevValues,
//       [key]: {
//         ...prevValues[key],
//         [value]: !prevValues[key]?.[value],
//       },
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));

//     // Clear validation error for this field
//     if (validationErrors[numericSectionId]?.[elementText]) {
//       setValidationErrors(prev => {
//         const newErrors = { ...prev };
//         if (newErrors[numericSectionId]) {
//           delete newErrors[numericSectionId][elementText];
//           if (Object.keys(newErrors[numericSectionId]).length === 0) {
//             delete newErrors[numericSectionId];
//           }
//         }
//         return newErrors;
//       });
//     }
//   };

//   const handleYesNoChange = (value, elementText, sectionId) => {
//     const numericSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
//     const key = `${numericSectionId}_${elementText}`;
//     setSelectedYesNoValues((prevValues) => ({
//       ...prevValues,
//       [key]: value,
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));
//     // Clear validation error for this field
//     if (validationErrors[numericSectionId]?.[elementText]) {
//       setValidationErrors(prev => {
//         const newErrors = { ...prev };
//         if (newErrors[numericSectionId]) {
//           delete newErrors[numericSectionId][elementText];
//           if (Object.keys(newErrors[numericSectionId]).length === 0) {
//             delete newErrors[numericSectionId];
//           }
//         }
//         return newErrors;
//       });
//     }
//   };

//   const handleInputChange = (event, elementText, sectionId) => {
//     const numericSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
//     const key = `${numericSectionId}_${elementText}`;
//     const { value } = event.target;
//     setInputValues((prevValues) => ({
//       ...prevValues,
//       [key]: value,
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));

//     // Clear validation error for this field
//     if (validationErrors[numericSectionId]?.[elementText]) {
//       setValidationErrors(prev => {
//         const newErrors = { ...prev };
//         if (newErrors[numericSectionId]) {
//           delete newErrors[numericSectionId][elementText];
//           // Remove section if no more errors
//           if (Object.keys(newErrors[numericSectionId]).length === 0) {
//             delete newErrors[numericSectionId];
//           }
//         }
//         return newErrors;
//       });
//     }
//   };

//   const handleDropdownValueChange = (event, elementText, sectionId) => {
//     const numericSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
//     const key = `${numericSectionId}_${elementText}`;
//     setSelectedDropdownValues((prevValues) => ({
//       ...prevValues,
//       [key]: event.target.value,
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));
//     // Clear validation error for this field
//     if (validationErrors[numericSectionId]?.[elementText]) {
//       setValidationErrors(prev => {
//         const newErrors = { ...prev };
//         if (newErrors[numericSectionId]) {
//           delete newErrors[numericSectionId][elementText];
//           if (Object.keys(newErrors[numericSectionId]).length === 0) {
//             delete newErrors[numericSectionId];
//           }
//         }
//         return newErrors;
//       });
//     }
//   };
// const shouldShowSection = (section) => {
//   if (!section.sectionsettings?.conditional) return true;
  
//   const conditions = section.sectionsettings.conditions || [];
//   const mode = section.sectionsettings.mode || "All"; // Default to "All" if not specified

//   // If no conditions, show the section
//   if (conditions.length === 0) return true;

//   let matchedConditions = 0;

//   conditions.forEach((condition) => {
//     if (!condition.question || !condition.answer) return;

//     let conditionMet = false;

//     // Check in base sections
//     for (const key in radioValues) {
//       const [checkSectionId] = key.split('_');
//       const numericCheckSectionId = Number(checkSectionId);
//       // Only check base sections (not repeated ones)
//       if (!Object.values(repeatedSections).flat().includes(numericCheckSectionId)) {
//         if (
//           key.endsWith(`_${condition.question}`) &&
//           radioValues[key] === condition.answer
//         ) {
//           conditionMet = true;
//           break;
//         }
//       }
//     }
//     if (conditionMet) {
//       matchedConditions++;
//       if (mode === "Any") return; // Early return for "Any" mode if one condition matches
//       return;
//     }

//     for (const key in checkboxValues) {
//       const [checkSectionId] = key.split('_');
//       const numericCheckSectionId = Number(checkSectionId);
//       if (!Object.values(repeatedSections).flat().includes(numericCheckSectionId)) {
//         if (
//           key.endsWith(`_${condition.question}`) &&
//           checkboxValues[key]?.[condition.answer]
//         ) {
//           conditionMet = true;
//           break;
//         }
//       }
//     }
//     if (conditionMet) {
//       matchedConditions++;
//       if (mode === "Any") return; // Early return for "Any" mode if one condition matches
//       return;
//     }

//     for (const key in selectedDropdownValues) {
//       const [checkSectionId] = key.split('_');
//       const numericCheckSectionId = Number(checkSectionId);
//       if (!Object.values(repeatedSections).flat().includes(numericCheckSectionId)) {
//         if (
//           key.endsWith(`_${condition.question}`) &&
//           selectedDropdownValues[key] === condition.answer
//         ) {
//           conditionMet = true;
//           break;
//         }
//       }
//     }
//     if (conditionMet) {
//       matchedConditions++;
//       if (mode === "Any") return; // Early return for "Any" mode if one condition matches
//       return;
//     }

//     for (const key in selectedYesNoValues) {
//       const [checkSectionId] = key.split('_');
//       const numericCheckSectionId = Number(checkSectionId);
//       if (!Object.values(repeatedSections).flat().includes(numericCheckSectionId)) {
//         if (
//           key.endsWith(`_${condition.question}`) &&
//           selectedYesNoValues[key] === condition.answer
//         ) {
//           conditionMet = true;
//           break;
//         }
//       }
//     }
//     if (conditionMet) {
//       matchedConditions++;
//       if (mode === "Any") return; // Early return for "Any" mode if one condition matches
//     }
//   });

//   // Return based on mode
//   if (mode === "Any") {
//     return matchedConditions > 0; // Show if at least one condition matches
//   } else { // "All" mode
//     return matchedConditions === conditions.length; // Show only if all conditions match
//   }
// };



//   // Get all visible sections including repeated ones in correct order
//   const getVisibleSections = () => {
//     const visibleBaseSections = (sections || []).filter(shouldShowSection);
//     const allSections = [];

//     // Build sections array with repeated sections inserted after their parent
//     visibleBaseSections.forEach((section) => {
//       // First, add the original base section
//       allSections.push(section);

//       // Then, immediately add all its repeated sections
//       if (section.sectionsettings?.sectionRepeatingMode && repeatedSections[section.id]) {
//         repeatedSections[section.id].forEach((repeatId, index) => {
//           allSections.push({
//             ...section,
//             id: repeatId.toString(),
//             text: `${section.text} (Repeated ${index + 1})`,
//             isRepeated: true,
//             originalSectionId: section.id
//           });
//         });
//       }
//     });

//     console.log("All sections in order:", allSections.map(s => ({ id: s.id, text: s.text, isRepeated: s.isRepeated })));
//     return allSections;
//   };

//   const visibleSections = getVisibleSections();
//   const totalSteps = visibleSections.length;

// const shouldShowElement = (element, sectionId) => {
//   const settings = element.questionsectionsettings;
//   if (!settings?.conditional) return true;
  
//   const conditions = settings?.conditions || [];
//   const mode = settings?.mode || "All"; // Default to "All" if not specified

//   // If no conditions, show the element
//   if (conditions.length === 0) return true;

//   let matchedConditions = 0;

//   for (const condition of conditions) {
//     const { question, answer } = condition;
//     if (!question || !answer) continue;

//     let conditionMet = false;

//     // Check conditions in the same section only
//     for (const key in radioValues) {
//       const [keySectionId] = key.split('_');
//       const numericKeySectionId = Number(keySectionId);
//       const numericCurrentSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
      
//       if (numericKeySectionId === numericCurrentSectionId && key.endsWith(`_${question}`) && radioValues[key] === answer) {
//         conditionMet = true;
//         break;
//       }
//     }
//     if (conditionMet) {
//       matchedConditions++;
//       if (mode === "Any") continue; // Continue to next condition for "Any" mode
//       else continue; // Continue to check next condition for "All" mode
//     }

//     for (const key in checkboxValues) {
//       const [keySectionId] = key.split('_');
//       const numericKeySectionId = Number(keySectionId);
//       const numericCurrentSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
      
//       if (numericKeySectionId === numericCurrentSectionId && key.endsWith(`_${question}`) && checkboxValues[key]?.[answer]) {
//         conditionMet = true;
//         break;
//       }
//     }
//     if (conditionMet) {
//       matchedConditions++;
//       if (mode === "Any") continue;
//       else continue;
//     }

//     for (const key in selectedDropdownValues) {
//       const [keySectionId] = key.split('_');
//       const numericKeySectionId = Number(keySectionId);
//       const numericCurrentSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
      
//       if (numericKeySectionId === numericCurrentSectionId && key.endsWith(`_${question}`) && selectedDropdownValues[key] === answer) {
//         conditionMet = true;
//         break;
//       }
//     }
//     if (conditionMet) {
//       matchedConditions++;
//       if (mode === "Any") continue;
//       else continue;
//     }

//     for (const key in selectedYesNoValues) {
//       const [keySectionId] = key.split('_');
//       const numericKeySectionId = Number(keySectionId);
//       const numericCurrentSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
      
//       if (numericKeySectionId === numericCurrentSectionId && key.endsWith(`_${question}`) && selectedYesNoValues[key] === answer) {
//         conditionMet = true;
//         break;
//       }
//     }
//     if (conditionMet) {
//       matchedConditions++;
//       if (mode === "Any") continue;
//       else continue;
//     }

//     // If we're in "All" mode and one condition fails, return false immediately
//     if (mode === "All" && !conditionMet) {
//       return false;
//     }
//   }

//   // Return based on mode
//   if (mode === "Any") {
//     return matchedConditions > 0; // Show if at least one condition matches
//   } else { // "All" mode
//     return matchedConditions === conditions.length; // Show only if all conditions match
//   }
// };
//   const handleNext = () => {
//     if (activeStep < totalSteps - 1) {
//       setActiveStep((prevActiveStep) => prevActiveStep + 1);
//     }
//   };

//   const handleBack = () => {
//     if (activeStep > 0) {
//       setActiveStep((prevActiveStep) => prevActiveStep - 1);
//     }
//   };

//   const handleDropdownChange = (event) => {
//     const selectedIndex = event.target.value;
//     setActiveStep(selectedIndex);
//   };
//  const [validationErrors, setValidationErrors] = useState({});
//   const handleSubmit = async () => {

//      const errors = {};
    
//     visibleSections.forEach((section) => {
//       section.formElements.forEach((element) => {
//         if (shouldShowElement(element, section.id) && element.questionsectionsettings?.required) {
//           const key = `${section.id}_${element.text}`;
//           const hasAnswer = answeredElements[key];
          
//           if (!hasAnswer) {
//             if (!errors[section.id]) {
//               errors[section.id] = {};
//             }
//             errors[section.id][element.text] = `This question is required`;
//           }
//         }
//       });
//     });

//     setValidationErrors(errors);

//     // If there are errors, don't submit and scroll to first error
//     if (Object.keys(errors).length > 0) {
//       // Find the first section with errors
//       const firstErrorSectionId = Object.keys(errors)[0];
//       const sectionIndex = visibleSections.findIndex(section => section.id === firstErrorSectionId);
//       if (sectionIndex !== -1) {
//         setActiveStep(sectionIndex);
//       }
      
//       toast.error("Please complete all required questions before submitting");
//       return;
//     }
//     try {
//       const myHeaders = new Headers();
//       myHeaders.append("Content-Type", "application/json");

//       const data = prepareSubmitData(true);
//        // Determine if this is a final submission that should seal the organizer
//     const isFinalSubmission = data.status === "Completed";
    
//     // Add issealed flag to the data when completing
//     if (isFinalSubmission) {
//       data.issealed = true;
//     }
//       const endpoint =
//         data.status === "Completed"
//           ? `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/completeandnotify/${organizer._id}`
//           : `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/${organizer._id}`;
//       const requestOptions = {
//         method: "PATCH",
//         headers: myHeaders,
//         body: JSON.stringify(data),
//         redirect: "follow",
//       };

//       const response = await fetch(endpoint, requestOptions);
//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || "Failed to update organizer");
//       }

//       // toast.success("Organizer updated successfully");
//         // If this was a final submission, show success message and close
//     if (isFinalSubmission) {
//       toast.success("Organizer completed and sealed successfully!");
      
//       // Update the local organizer state to reflect it's sealed
//       organizer.issealed = true;
      
//       handleClose();
//     } else {
//       toast.success("Organizer saved successfully");
//       handleClose();
//     }
//       // handleClose();
//     } catch (error) {
//       console.error("Error submitting organizer:", error);
//       toast.error(
//         error.message || "Something went wrong while updating organizer!"
//       );
//     }
//   };

// const getQuestionTextValue = (question, sectionId) => {
//   const numericSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
//   const key = `${numericSectionId}_${question.text}`;

//   switch (question.type) {
//     case "Free Entry":
//     case "Email":
//     case "Number":
//       return inputValues[key] || "";
//     case "Radio Buttons":
//       return radioValues[key] || "";
//     case "Checkboxes":
//       return checkboxValues[key]
//         ? Object.keys(checkboxValues[key])
//             .filter((k) => checkboxValues[key][k])
//             .join(", ")
//         : "";
//     case "Yes/No":
//       return selectedYesNoValues[key] || "";
//     case "Dropdown":
//       return selectedDropdownValues[key] || "";
//     case "Date":
//       return startDate?.toISOString() || "";
//     case "Text Editor":
//       return question.text || "";
//     case "File Upload":
//       // Return the file name for display purposes
//       return uploadedFiles[key]?.fileName || "";
//     default:
//       return "";
//   }
// };
//   const getOptionSelectedState = (question, option, sectionId) => {
//     const numericSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
//     const key = `${numericSectionId}_${question.text}`;
//     switch (question.type) {
//       case "Radio Buttons":
//         return radioValues[key] === option.text;
//       case "Checkboxes":
//         return checkboxValues[key]?.[option.text] || false;
//       case "Yes/No":
//         return selectedYesNoValues[key] === option.text;
//       case "Dropdown":
//         return selectedDropdownValues[key] === option.text;
//       default:
//         return false;
//     }
//   };

//   useEffect(() => {
//     if (organizer?.sections) {
//       const newInputValues = {};
//       const newRadioValues = {};
//       const newCheckboxValues = {};
//       const newSelectedYesNoValues = {};
//       const newSelectedDropdownValues = {};
//       const newAnsweredElements = {};
//       const newUploadedFiles = {};
//       const newRepeatedSections = {};
//       let initialDate = dayjs();

//       organizer.sections.forEach((section) => {
//         const sectionId = section.id;

//         // Initialize repeated sections from saved data
//         if (section.sectionsettings?.isRepeated && section.sectionsettings?.originalSectionId) {
//           const originalSectionId = section.sectionsettings.originalSectionId;
//           if (!newRepeatedSections[originalSectionId]) {
//             newRepeatedSections[originalSectionId] = [];
//           }
//           // Store as numbers for repeated sections
//           newRepeatedSections[originalSectionId].push(Number(sectionId));
//         }

//         section.formElements.forEach((element) => {
//           // Use numeric section ID for state keys
//           const numericSectionId = Number(sectionId);
//           const key = `${numericSectionId}_${element.text}`;

//           if (element.textvalue) {
//             newAnsweredElements[key] = true;

//             switch (element.type) {
//               case "Free Entry":
//               case "Email":
//               case "Number":
//                 newInputValues[key] = element.textvalue;
//                 break;
//               case "Radio Buttons":
//                 newRadioValues[key] = element.textvalue;
//                 break;
//               case "Checkboxes":
//                 const selectedOptions = element.textvalue
//                   .split(",")
//                   .map((s) => s.trim());
//                 newCheckboxValues[key] = {};
//                 element.options.forEach((option) => {
//                   newCheckboxValues[key][option.text] =
//                     selectedOptions.includes(option.text);
//                 });
//                 break;
//               case "Yes/No":
//                 newSelectedYesNoValues[key] = element.textvalue;
//                 break;
//               case "Dropdown":
//                 newSelectedDropdownValues[key] = element.textvalue;
//                 break;
//               case "Date":
//                 initialDate = dayjs(element.textvalue);
//                 break;
//               case "File Upload":
//                 // if (element.textvalue) {
//                 //   newUploadedFiles[key] = element.textvalue;
//                 // }
//                   // Load from fileMetadata if available
//               if (element.fileMetadata && element.fileMetadata.fileName) {
//                 newUploadedFiles[key] = {
//                   fileName: element.fileMetadata.fileName,
//                   filePath: element.fileMetadata.filePath,
//                   uploadDate: element.fileMetadata.uploadDate,
//                   uploadedBy: element.fileMetadata.uploadedBy,
//                   status: 'completed'
//                 };
//                 console.log('Loaded file metadata from DB:', newUploadedFiles[key]); // DEBUG LOG
//               } else if (element.textvalue) {
//                 // Fallback to textvalue for backward compatibility
//                 newUploadedFiles[key] = {
//                   fileName: element.textvalue,
//                   status: 'completed'
//                 };
//               }
//                 break;
//             }
//           }
//         });
//       });

//       setInputValues(newInputValues);
//       setRadioValues(newRadioValues);
//       setCheckboxValues(newCheckboxValues);
//       setSelectedYesNoValues(newSelectedYesNoValues);
//       setSelectedDropdownValues(newSelectedDropdownValues);
//       setAnsweredElements(newAnsweredElements);
//       setStartDate(initialDate);
//       setUploadedFiles(newUploadedFiles);
//       setRepeatedSections(newRepeatedSections);
//     }
//   }, [organizer]);

//   const isElementActive = (element) => {
//     if (organizer?.issealed) return true;
//     return element.active === true;
//   };
// // Helper function to check if a field has validation error
//   const hasError = (sectionId, elementText) => {
//     return !!validationErrors[sectionId]?.[elementText];
//   };

//   // Helper function to get error message
//   const getErrorMessage = (sectionId, elementText) => {
//     return validationErrors[sectionId]?.[elementText] || '';
//   };
//   // Function to render a section (used for both base and repeated sections)
//   const renderSection = (section, isRepeated = false, originalSectionId = null) => {
//     const sectionId = section.id;
//     const canRepeat = section.sectionsettings?.sectionRepeatingMode && !isRepeated;

//     return (
//       <Box key={sectionId}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//           <Typography variant="h6" component="h2">
//             {section.text}
//           </Typography>
//           {isRepeated && (
//             <Button 
//               variant="outlined" 
//               color="error" 
//               size="small"
//               onClick={() => removeRepeatedSection(originalSectionId, Number(sectionId))}
//               disabled={organizer?.issealed}
//             >
//               Remove Section
//             </Button>
//           )}
//         </Box>

//         {section.formElements.map(
//           (element) =>
//             shouldShowElement(element, sectionId) && (
//               <Box key={`${sectionId}_${element.id}`}>
//                 {element.type === "Text Editor" && (
//                   <Box mt={2} mb={2}>
//                     <Typography>
//                       <span
//                         dangerouslySetInnerHTML={{
//                           __html: element.text,
//                         }}
//                       />
//                     </Typography>
//                   </Box>
//                 )}

//                 {(element.type === "Free Entry" || element.type === "Email") && (
//                   <Box mt={2}>
//                     <Typography
//                       variant="subtitle2"
//                       component="p"
//                       gutterBottom
//                       sx={{ fontWeight: "550" }}
//                     >
//                       {element.text}
//                        {element.questionsectionsettings?.required && (
//                         <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
//                       )}
//                     </Typography>
//                     <TextField
//                       disabled={isElementActive(element)}
//                       variant="filled"
//                       size="small"
//                       multiline
//                       fullWidth
//                       placeholder={`${element.type} Answer`}
//                       inputProps={{
//                         type:
//                           element.type === "Free Entry"
//                             ? "text"
//                             : element.type.toLowerCase(),
//                       }}
//                       style={{ display: "block" }}
//                       value={
//                         inputValues[
//                           `${sectionId}_${element.text}`
//                         ] || ""
//                       }
//                       onChange={(e) =>
//                         handleInputChange(
//                           e,
//                           element.text,
//                           sectionId
//                         )
//                       }
//                         error={hasError(sectionId, element.text)}
//                     />
//                      {hasError(sectionId, element.text) && (
//                       <Typography 
//                         variant="caption" 
//                         color="error" 
//                         sx={{ display: 'block', mt: 0.5, ml: 1 }}
//                       >
//                         {getErrorMessage(sectionId, element.text)}
//                       </Typography>
//                     )}
//                   </Box>
//                 )}

//                 {element.type === "Number" && (
//                   <Box mt={2}>
//                     <Typography
//                       variant="subtitle2"
//                       component="p"
//                       gutterBottom
//                       sx={{ fontWeight: "550" }}
//                     >
//                       {element.text}
//                       {element.questionsectionsettings?.required && (
//                         <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
//                       )}
//                     </Typography>
//                     <TextField
//                       disabled={isElementActive(element)}
//                       variant="outlined"
//                       size="small"
//                       multiline
//                       fullWidth
//                       placeholder={`${element.type} Answer`}
//                       inputProps={{
//                         type: "text",
//                         inputMode: "numeric",
//                         pattern: "[0-9]*",
//                       }}
//                       maxRows={8}
//                       style={{
//                         display: "block",
//                         marginTop: "15px",
//                       }}
//                       value={
//                         inputValues[
//                           `${sectionId}_${element.text}`
//                         ] || ""
//                       }
//                       onChange={(e) => {
//                         const numericValue =
//                           e.target.value.replace(/\D/g, "");
//                         handleInputChange(
//                           { target: { value: numericValue } },
//                           element.text,
//                           sectionId
//                         );
//                       }}
//                        error={hasError(sectionId, element.text)}
//                     />
//                     {hasError(sectionId, element.text) && (
//                       <Typography 
//                         variant="caption" 
//                         color="error" 
//                         sx={{ display: 'block', mt: 0.5, ml: 1 }}
//                       >
//                         {getErrorMessage(sectionId, element.text)}
//                       </Typography>
//                     )}
//                   </Box>
//                 )}

//                 {element.type === "Radio Buttons" && (
//                   <Box mt={2}>
//                     <Typography
//                       variant="subtitle2"
//                       component="p"
//                       gutterBottom
//                       sx={{ fontWeight: "550" }}
//                     >
//                       {element.text}
//                        {element.questionsectionsettings?.required && (
//                         <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
//                       )}
//                     </Typography>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         gap: 1,
//                         flexWrap: "wrap",
//                       }}
//                     >
//                       {element.options.map((option) => (
//                         <SelectableButton
//                           key={option.text}
//                           selected={
//                             radioValues[
//                               `${sectionId}_${element.text}`
//                             ] === option.text
//                           }
//                           disabled={isElementActive(element)}
//                           onClick={() =>
//                             handleRadioChange(
//                               option.text,
//                               element.text,
//                               sectionId
//                             )
//                           }
//                         >
//                           {option.text}
//                         </SelectableButton>
//                       ))}
//                     </Box>
//                     {hasError(sectionId, element.text) && (
//                       <Typography 
//                         variant="caption" 
//                         color="error" 
//                         sx={{ display: 'block', mt: 0.5, ml: 1 }}
//                       >
//                         {getErrorMessage(sectionId, element.text)}
//                       </Typography>
//                     )}
//                   </Box>
//                 )}

//                 {element.type === "Checkboxes" && (
//                   <Box mt={2}>
//                     <Typography
//                       variant="subtitle2"
//                       component="p"
//                       gutterBottom
//                       sx={{ fontWeight: "550" }}
//                     >
//                       {element.text}
//                       {element.questionsectionsettings?.required && (
//                         <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
//                       )}
//                     </Typography>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         gap: 1,
//                         flexWrap: "wrap",
//                       }}
//                     >
//                       {element.options.map((option) => (
//                         <SelectableButton
//                           key={option.text}
//                           selected={
//                             checkboxValues[
//                               `${sectionId}_${element.text}`
//                             ]?.[option.text]
//                           }
//                           disabled={isElementActive(element)}
//                           onClick={() =>
//                             handleCheckboxChange(
//                               option.text,
//                               element.text,
//                               sectionId
//                             )
//                           }
//                         >
//                           {option.text}
//                         </SelectableButton>
//                       ))}
//                     </Box>
//                     {hasError(sectionId, element.text) && (
//                       <Typography 
//                         variant="caption" 
//                         color="error" 
//                         sx={{ display: 'block', mt: 0.5, ml: 1 }}
//                       >
//                         {getErrorMessage(sectionId, element.text)}
//                       </Typography>
//                     )}
//                   </Box>
//                 )}

//                 {element.type === "Yes/No" && (
//                   <Box mt={2}>
//                     <Typography
//                       variant="subtitle2"
//                       component="p"
//                       gutterBottom
//                       sx={{ fontWeight: "550" }}
//                     >
//                       {element.text}
//                       {element.questionsectionsettings?.required && (
//                         <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
//                       )}
//                     </Typography>
//                     <Box sx={{ display: "flex", gap: 1 }}>
//                       {element.options.map((option) => (
//                         <SelectableButton
//                           key={option.text}
//                           selected={
//                             selectedYesNoValues[
//                               `${sectionId}_${element.text}`
//                             ] === option.text
//                           }
//                           disabled={isElementActive(element)}
//                           onClick={() =>
//                             handleYesNoChange(
//                               option.text,
//                               element.text,
//                               sectionId
//                             )
//                           }
//                         >
//                           {option.text}
//                         </SelectableButton>
//                       ))}
//                     </Box>
//                     {hasError(sectionId, element.text) && (
//                       <Typography 
//                         variant="caption" 
//                         color="error" 
//                         sx={{ display: 'block', mt: 0.5, ml: 1 }}
//                       >
//                         {getErrorMessage(sectionId, element.text)}
//                       </Typography>
//                     )}
//                   </Box>
//                 )}

//                 {element.type === "Dropdown" && (
//                   <Box mt={2}>
//                     <Typography
//                       variant="subtitle2"
//                       component="p"
//                       gutterBottom
//                       sx={{ fontWeight: "550" }}
//                     >
//                       {element.text}
//                       {element.questionsectionsettings?.required && (
//                         <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
//                       )}
//                     </Typography>
//                     <FormControl fullWidth>
//                       <Select
//                         value={
//                           selectedDropdownValues[
//                             `${sectionId}_${element.text}`
//                           ] || ""
//                         }
//                         disabled={isElementActive(element)}
//                         onChange={(event) =>
//                           handleDropdownValueChange(
//                             event,
//                             element.text,
//                             sectionId
//                           )
//                         }
//                         size="small"
//                       >
//                         {element.options.map((option) => (
//                           <MenuItem
//                             key={option.text}
//                             value={option.text}
//                           >
//                             {option.text}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                     {hasError(sectionId, element.text) && (
//                       <Typography 
//                         variant="caption" 
//                         color="error" 
//                         sx={{ display: 'block', mt: 0.5, ml: 1 }}
//                       >
//                         {getErrorMessage(sectionId, element.text)}
//                       </Typography>
//                     )}
//                   </Box>
//                 )}

//                 {element.type === "Date" && (
//                   <Box mt={2}>
//                     <Typography
//                       variant="subtitle2"
//                       component="p"
//                       gutterBottom
//                       sx={{ fontWeight: "550" }}
//                     >
//                       {element.text}
//                       {element.questionsectionsettings?.required && (
//                         <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
//                       )}
//                     </Typography>
//                     <DatePicker
//                       format="DD/MM/YYYY"
//                       sx={{
//                         width: "100%",
//                         backgroundColor: "#fff",
//                       }}
//                       value={startDate}
//                       disabled={isElementActive(element)}
//                       onChange={(newValue) => {
//                         if (!isElementActive(element)) {
//                           setStartDate(newValue);
//                           setAnsweredElements((prev) => ({
//                             ...prev,
//                             [`${sectionId}_${element.text}`]: true,
//                           }));
//                         // Clear validation error for date field
//                           if (validationErrors[sectionId]?.[element.text]) {
//                             setValidationErrors(prev => {
//                               const newErrors = { ...prev };
//                               if (newErrors[sectionId]) {
//                                 delete newErrors[sectionId][element.text];
//                                 if (Object.keys(newErrors[sectionId]).length === 0) {
//                                   delete newErrors[sectionId];
//                                 }
//                               }
//                               return newErrors;
//                             });
//                           }
//                         }
//                       }}
//                       renderInput={(params) => (
//                         <TextField {...params} size="small" />
//                       )}
//                     />
//                     {hasError(sectionId, element.text) && (
//                       <Typography 
//                         variant="caption" 
//                         color="error" 
//                         sx={{ display: 'block', mt: 0.5, ml: 1 }}
//                       >
//                         {getErrorMessage(sectionId, element.text)}
//                       </Typography>
//                     )}
//                   </Box>
//                 )}

// {element.type === "File Upload" && (
//   <Box mt={2}>
//     <Typography
//       variant="subtitle2"
//       component="p"
//       gutterBottom
//       sx={{ fontWeight: "550" }}
//     >
//       {element.text}
//       {element.questionsectionsettings?.required && (
//         <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
//       )}
//     </Typography>
//     <Box
//       sx={{
//         display: "flex",
//         alignItems: "center",
//         gap: 1,
//       }}
//     >
//       <Button
//         variant="outlined"
//         component="label"
//         disabled={
//           isElementActive(element) || 
//           uploadedFiles[`${sectionId}_${element.text}`]?.status === 'completed'
//         }
//       >
//         Choose File
//         <Input
//           type="file"
//           onChange={(e) => {
//             const selectedFile = e.target.files[0];
//             if (selectedFile) {
//               setFile(selectedFile);
//               setIsDocumentForm(true);
//               const key = `${sectionId}_${element.text}`;
              
//               // Store temporary file info until upload is complete
//               setUploadedFiles((prev) => ({
//                 ...prev,
//                 [key]: {
//                   fileName: selectedFile.name,
//                   file: selectedFile,
//                   status: 'pending' // pending, uploading, completed, error
//                 },
//               }));
//             }
//           }}
//           sx={{ display: "none" }}
//           disabled={
//             isElementActive(element) || 
//             uploadedFiles[`${sectionId}_${element.text}`]?.status === 'completed'
//           }
//         />
//       </Button>
      
//       {uploadedFiles[`${sectionId}_${element.text}`] && (
//         <Typography variant="body2">
//           {uploadedFiles[`${sectionId}_${element.text}`].fileName}
//         </Typography>
//       )}
//     </Box>
//     {hasError(sectionId, element.text) && (
//       <Typography 
//         variant="caption" 
//         color="error" 
//         sx={{ display: 'block', mt: 0.5, ml: 1 }}
//       >
//         {getErrorMessage(sectionId, element.text)}
//       </Typography>
//     )}
    
//     {/* Show upload status */}
//     {uploadedFiles[`${sectionId}_${element.text}`]?.status === 'uploading' && (
//       <Typography variant="caption" color="primary">
//         Uploading...
//       </Typography>
//     )}
//     {uploadedFiles[`${sectionId}_${element.text}`]?.status === 'completed' && (
//       <Typography variant="caption" color="success.main">
//         ✓ Uploaded successfully
//       </Typography>
//     )}
//   </Box>
// )}
//               </Box>
//             )
//         )}

//         {/* Add Section button for repeatable sections */}
//         {canRepeat && (
//           <Box mt={3} mb={2}>
//             <Button 
//               variant="outlined" 
//               onClick={() => addRepeatedSection(sectionId)}
//               disabled={organizer?.issealed}
//               startIcon={<AddIcon />}
//             >
//               Add Another {section.text}
//             </Button>
//           </Box>
//         )}
//       </Box>
//     );
//   };

//   return (
//     <>
//       <LocalizationProvider dateAdapter={AdapterDayjs}>
//         <Dialog fullScreen open={open} onClose={handleClose}>
//           <DialogTitle
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               px: 3,
//               py: 2,
//               borderBottom: "1px solid #ddd",
//             }}
//           >
//             <Typography variant="h6" component="p">
//               {organizer?.organizerName || "Organizer"}
//             </Typography>
//             <IconButton edge="end" onClick={handleClose}>
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>
//           <DialogContent>
//             <FormControl
//               fullWidth
//               sx={{ marginBottom: "10px", marginTop: "10px" }}
//             >
//               <Select
//                 value={activeStep}
//                 onChange={handleDropdownChange}
//                 size="small"
//               >
//                 {visibleSections.map((section, index) => {
//                   const visibleElements = section.formElements.filter((el) =>
//                     shouldShowElement(el, section.id)
//                   );

//                   const answeredCount = visibleElements.reduce(
//                     (count, element) => {
//                       const key = `${section.id}_${element.text}`;
//                       return count + (answeredElements[key] ? 1 : 0);
//                     },
//                     0
//                   );

//                   const totalVisibleElements = visibleElements.length;

//                   return (
//                     <MenuItem key={section.id} value={index}>
//                       {section.text} ({answeredCount}/{totalVisibleElements})
//                     </MenuItem>
//                   );
//                 })}
//               </Select>
//             </FormControl>
//             <Box mt={2} mb={2}>
//               <LinearProgress
//                 variant="determinate"
//                 value={((activeStep + 1) / totalSteps) * 100}
//               />
//             </Box>

//             <Box sx={{ pl: 20, pr: 20 }}>
//               {visibleSections.map(
//                 (section, sectionIndex) =>
//                   sectionIndex === activeStep && (
//                     renderSection(
//                       section, 
//                       section.isRepeated, 
//                       section.originalSectionId
//                     )
//                   )
//               )}

//               <Box
//                 mt={3}
//                 display="flex"
//                 alignItems="center"
//                 justifyContent={"space-between"}
//               >
//                 <Box display="flex" gap={3} alignItems="center">
//                   {activeStep > 0 && (
//                     <Button onClick={handleBack} variant="outlined">
//                       <ArrowBackIcon fontSize="small" />
//                     </Button>
//                   )}

//                   {activeStep < totalSteps - 1 ? (
//                     <Button onClick={handleNext} color="primary"  sx={{
//               backgroundColor: 'text.menu',
//               color: 'primary.contrastText',
//               '&:hover': {
//                 backgroundColor: 'menu.dark',
//                 boxShadow: 1,
//               },
//               transition: 'background-color 0.2s ease'
//             }}>
//                       Next{" "}
//                       <ArrowForwardIcon
//                         fontSize="small"
//                         sx={{ marginLeft: 2 }}
//                       />
//                     </Button>
//                   ) : (
//                     <Button  onClick={handleSubmit} color="primary"  sx={{
//               backgroundColor: 'text.menu',
//               color: 'primary.contrastText',
//               '&:hover': {
//                 backgroundColor: 'menu.dark',
//                 boxShadow: 1,
//               },
//               transition: 'background-color 0.2s ease'
//             }}>
//                       Submit
//                     </Button>
//                   )}
//                 </Box>

//                 <Box sx={{ display: "flex", alignItems: "flex-end" }}>
//                   <Typography>
//                     Step {activeStep + 1} of {totalSteps}
//                   </Typography>
//                 </Box>
//               </Box>
//             </Box>
//           </DialogContent>
//         </Dialog>
//       </LocalizationProvider>

//       <FileUploadDrawer
//   isOpen={isDocumentForm}
//   organizer={organizer}
//   onClose={() => setIsDocumentForm(false)}
//   file={file}
//   accountId={accountId}
//   folderTree={folderTree}
//   onUploadSuccess={(fileData) => {
//     console.log("File uploaded successfully:", fileData);
    
//     // Find the key for the current file being uploaded
//     const key = Object.keys(uploadedFiles).find(
//       (k) => uploadedFiles[k]?.file === file
//     );

//     if (key) {
//       // Update the uploadedFiles state with complete file metadata
//       setUploadedFiles((prev) => ({
//         ...prev,
//         [key]: {
//           fileName: fileData.fileName,
//           filePath: fileData.filePath, // Add file path if available
//           uploadDate: new Date().toISOString(),
//           status: 'completed'
//         },
//       }));

//       // Mark as answered
//       setAnsweredElements((prev) => ({
//         ...prev,
//         [key]: true,
//       }));

//       // Trigger auto-save with the updated file metadata
//       const data = prepareSubmitData(false);
//       debouncedAutoSave(data);
      
//       toast.success("File uploaded successfully!");
//     }

//     setIsDocumentForm(false);
//     setFile(null);
//   }}
//   onUploadError={(error) => {
//     console.error("File upload failed:", error);
//     const key = Object.keys(uploadedFiles).find(
//       (k) => uploadedFiles[k]?.file === file
//     );
//     if (key) {
//       setUploadedFiles((prev) => {
//         const newState = { ...prev };
//         delete newState[key];
//         return newState;
//       });
//     }
//     setFile(null);
//     toast.error("File upload failed!");
//   }}
// />
//     </>
//   );
// };
// export default OrganizerDialog;


import {
  MenuItem,
  Select,
  FormControl,
  Dialog,
  DialogContent,
  Typography,
  DialogTitle,
  IconButton,
  Box,
  TextField,
  Button,
  Input,
} from "@mui/material";
import { LinearProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";  
import { useState, useEffect, useCallback, useContext } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "material-react-toastify";
import dayjs from "dayjs";
import { debounce } from "lodash";
import AddIcon from '@mui/icons-material/Add';
import UploadDrawer from "./UploadDrawer";
import { LoginContext } from "../../context/Context";
import SelectableButton from "./SelectableButton";
import FileUploadDrawer from "./FileUploadDrawer";
import axios from "axios";

// import React, { useState, useEffect, useCallback, useContext } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   Typography,
//   Box,
//   Button,
//   TextField,
//   FormControl,
//   Select,
//   MenuItem,
//   IconButton,
//   LinearProgress,
//   Input,
// } from "@mui/material";
// import {
//   LocalizationProvider,
//   DatePicker,
// } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { Close as CloseIcon, ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon, Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
// import { toast } from "material-react-toastify";
// import dayjs from "dayjs";
// import debounce from "lodash/debounce";
// import axios from "axios";
// import { LoginContext } from "../path/to/LoginContext"; // Update with your actual path

// const SelectableButton = ({ children, selected, disabled, onClick }) => (
//   <Button
//     variant={selected ? "contained" : "outlined"}
//     disabled={disabled}
//     onClick={onClick}
//     sx={{
//       minWidth: "auto",
//       px: 2,
//       py: 1,
//       borderRadius: 2,
//       textTransform: "none",
//       fontWeight: selected ? "bold" : "normal",
//     }}
//   >
//     {children}
//   </Button>
// );

const OrganizerDialog = ({ open, handleClose, organizer }) => {
  console.log("organizer", organizer);
  const [accountName, setAccountName] = useState("");
  const { accId } = useState(sessionStorage.getItem("accountId"));
  
  const fetchAccountDetails = async () => {
    try {
      const res = await axios.get(
        `https://www.snptaxes.com/api/accounts/${accId}`
      );
      setAccountName(res.data.accounts.accountName)
      console.log("result", res.data);
    } catch (error) {
      console.error("Error fetching account details:", error);
    }
  };

  useEffect(() => {
    fetchAccountDetails();
  }, [accId]);

  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const { logindata } = useContext(LoginContext);
  const [loginuserid, setLoginUserId] = useState();
  
  useEffect(() => {
    if (logindata?.user?.id) {
      setLoginUserId(logindata.user.id);
    }
  }, [logindata]);

  useEffect(() => {
    if (loginuserid) {
      console.log("loginuserid", loginuserid);
      fetchData(loginuserid);
      fetchAccountByUser(loginuserid);
    }
  }, [loginuserid]);

  const [username, setUsername] = useState("");
  const fetchData = async (id) => {
    const myHeaders = new Headers();
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const url = `${LOGIN_API}/common/user/${id}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setUsername(result.username);
      });
  };

  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const [accountId, setAccountId] = useState(sessionStorage.getItem("accountId"));
  
  const fetchAccountByUser = async (id) => {
    const myHeaders = new Headers();
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const url = `${ACCOUNT_API}/accounts/accountdetails/accountdetailslist/listbyuserid/${id}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setAccountId(result.accounts[0]._id);
      });
  };

  const [folderTree, setFolderTree] = useState([]);
  const [error, setError] = useState("");
  
  useEffect(() => {
    fetchFolderTree(accountId);
  }, [accountId]);

  const fetchFolderTree = async (accountId) => {
    try {
      const res = await fetch(`https://www.snptaxes.com/api/accountsdoc/files/list/clientView?folderPath=${accountId}`);
      const data = await res.json();
      console.log("janavi patil", data)
      if (res.ok) {
        setFolderTree(data.contents);
      } else {
        setError('Failed to fetch folder tree');
      }
    } catch (err) {
      setError('Error fetching folder tree');
    }
  };

  const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  const sections = organizer?.sections;

  const [selectedDropdownValues, setSelectedDropdownValues] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [selectedYesNoValues, setSelectedYesNoValues] = useState({});
  const [radioValues, setRadioValues] = useState({});
  const [checkboxValues, setCheckboxValues] = useState({});
  const [answeredElements, setAnsweredElements] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [startDate, setStartDate] = useState(dayjs());
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [file, setFile] = useState(null);
  const [isDocumentForm, setIsDocumentForm] = useState(false);
  const [repeatedSections, setRepeatedSections] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [pendingFiles, setPendingFiles] = useState({});

  const addRepeatedSection = (sectionId) => {
    setRepeatedSections(prev => {
      const currentRepeats = prev[sectionId] || [];
      const baseId = Number(sectionId);
      const newRepeatId = baseId + currentRepeats.length + 1000000;
      
      return {
        ...prev,
        [sectionId]: [...currentRepeats, newRepeatId]
      };
    });
  };

  const removeRepeatedSection = (sectionId, repeatId) => {
    setRepeatedSections(prev => {
      const currentRepeats = prev[sectionId] || [];
      const updatedRepeats = currentRepeats.filter(id => id !== repeatId);
      
      cleanUpSectionData(repeatId);
      
      return {
        ...prev,
        [sectionId]: updatedRepeats
      };
    });
  };

  const cleanUpSectionData = (sectionId) => {
    const numericSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
    
    setInputValues(prev => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach(key => {
        if (key.startsWith(`${numericSectionId}_`)) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setRadioValues(prev => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach(key => {
        if (key.startsWith(`${numericSectionId}_`)) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setCheckboxValues(prev => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach(key => {
        if (key.startsWith(`${numericSectionId}_`)) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setSelectedYesNoValues(prev => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach(key => {
        if (key.startsWith(`${numericSectionId}_`)) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setSelectedDropdownValues(prev => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach(key => {
        if (key.startsWith(`${numericSectionId}_`)) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setAnsweredElements(prev => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach(key => {
        if (key.startsWith(`${numericSectionId}_`)) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setUploadedFiles(prev => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach(key => {
        if (key.startsWith(`${numericSectionId}_`)) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    setPendingFiles(prev => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach(key => {
        if (key.startsWith(`${numericSectionId}_`)) {
          delete newValues[key];
        }
      });
      return newValues;
    });
  };

  const handleDeleteFile = async (sectionId, elementText) => {
    const key = `${sectionId}_${elementText}`;
    const fileInfo = uploadedFiles[key];
    
    if (!fileInfo) return;

    try {
      // Show confirmation dialog
      const confirmDelete = window.confirm(
        `Are you sure you want to delete "${fileInfo.fileName}"? This action cannot be undone.`
      );
      
      if (!confirmDelete) return;

      // Delete from document backend
      if (fileInfo.filePath) {
        const deleteResponse = await fetch(
          "https://www.snptaxes.com/api/accountsdoc/delete",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              targetPath: `${fileInfo.filePath}/${fileInfo.fileName}` 
            }),
          }
        );

        const deleteData = await deleteResponse.json();

        if (!deleteResponse.ok || !deleteData.success) {
          throw new Error(deleteData.message || "Failed to delete file from storage");
        }
      }

      // Remove from uploadedFiles state
      setUploadedFiles(prev => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });

      // Remove from answered elements
      setAnsweredElements(prev => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });

      // Remove any pending files
      setPendingFiles(prev => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });

      // Clear validation errors
      const numericSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
      if (validationErrors[numericSectionId]?.[elementText]) {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          if (newErrors[numericSectionId]) {
            delete newErrors[numericSectionId][elementText];
            if (Object.keys(newErrors[numericSectionId]).length === 0) {
              delete newErrors[numericSectionId];
            }
          }
          return newErrors;
        });
      }

      // Trigger auto-save to update organizer with empty file data
      const data = prepareSubmitData(false);
      debouncedAutoSave(data);

      toast.success("File deleted successfully!");

    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error(error.message || "Failed to delete file");
    }
  };

  const debouncedAutoSave = useCallback(
    debounce(async (data) => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify(data);
        console.log("autosave raw", raw);
        const requestOptions = {
          method: "PATCH",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/${organizer._id}`;
        const response = await fetch(url, requestOptions);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to auto-save organizer");
        }

        console.log("Auto-save successful");
      } catch (error) {
        console.error("Error auto-saving organizer:", error);
      }
    }, 2000),
    [organizer?._id]
  );

  const prepareSubmitData = (finalSubmit = false) => {
    const allSectionsInOrder = getVisibleSections();

    const sectionsData = allSectionsInOrder.map((section) => ({
      name: section?.text || "",
      id: section?.id || "",
      text: section?.text || "",
      sectionsettings: section?.sectionsettings,
      formElements:
        section?.formElements?.map((question) => {
          const questionData = {
            type: question?.type || "",
            id: question?.id || "",
            sectionid: Number(section?.id) || 0,
            options:
              question?.options?.map((option) => ({
                id: option?.id || "",
                text: option?.text || "",
                selected: getOptionSelectedState(question, option, Number(section.id)),
              })) || [],
            text: question?.text || "",
            textvalue: getQuestionTextValue(question, Number(section.id)),
            questionsectionsettings: question?.questionsectionsettings,
          };

          // Add file metadata ONLY for completed file uploads
          if (question.type === "File Upload") {
            const fileKey = `${section.id}_${question.text}`;
            const fileInfo = uploadedFiles[fileKey];
            
            // ONLY include file metadata if upload is completed
            if (fileInfo && fileInfo.status === 'completed') {
              questionData.fileMetadata = {
                fileName: fileInfo.fileName,
                filePath: fileInfo.filePath || '',
                uploadDate: fileInfo.uploadDate || new Date().toISOString(),
                uploadedBy: accountName || username,
              };
              questionData.textvalue = fileInfo.fileName;
            } else {
              // For pending or non-existent files, ensure no file data is saved
              questionData.textvalue = "";
              // Don't include fileMetadata at all for pending files
            }
          }

          return questionData;
        }) || [],
    }));

    const data = {
      sections: sectionsData,
      status: finalSubmit ? "Completed" : "In Progress",
      completedby: accountName,
      active: true,
      repeatedSections: repeatedSections,
    };

    console.log("Data being saved to backend:", JSON.stringify(data, null, 2));
    
    return data;
  };

  useEffect(() => {
    if (open && organizer?._id) {
      const data = prepareSubmitData(false);
      debouncedAutoSave(data);
    }
  }, [
    open,
    organizer?._id,
    inputValues,
    radioValues,
    checkboxValues,
    selectedYesNoValues,
    selectedDropdownValues,
    startDate,
    uploadedFiles,
    repeatedSections,
    debouncedAutoSave,
  ]);

  useEffect(() => {
    return () => {
      debouncedAutoSave.cancel();
    };
  }, [debouncedAutoSave]);

  const handleRadioChange = (value, elementText, sectionId) => {
    const numericSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
    const key = `${numericSectionId}_${elementText}`;
    setRadioValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
    
    if (validationErrors[numericSectionId]?.[elementText]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        if (newErrors[numericSectionId]) {
          delete newErrors[numericSectionId][elementText];
          if (Object.keys(newErrors[numericSectionId]).length === 0) {
            delete newErrors[numericSectionId];
          }
        }
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (value, elementText, sectionId) => {
    const numericSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
    const key = `${numericSectionId}_${elementText}`;
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [key]: {
        ...prevValues[key],
        [value]: !prevValues[key]?.[value],
      },
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));

    if (validationErrors[numericSectionId]?.[elementText]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        if (newErrors[numericSectionId]) {
          delete newErrors[numericSectionId][elementText];
          if (Object.keys(newErrors[numericSectionId]).length === 0) {
            delete newErrors[numericSectionId];
          }
        }
        return newErrors;
      });
    }
  };

  const handleYesNoChange = (value, elementText, sectionId) => {
    const numericSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
    const key = `${numericSectionId}_${elementText}`;
    setSelectedYesNoValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
    
    if (validationErrors[numericSectionId]?.[elementText]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        if (newErrors[numericSectionId]) {
          delete newErrors[numericSectionId][elementText];
          if (Object.keys(newErrors[numericSectionId]).length === 0) {
            delete newErrors[numericSectionId];
          }
        }
        return newErrors;
      });
    }
  };

  const handleInputChange = (event, elementText, sectionId) => {
    const numericSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
    const key = `${numericSectionId}_${elementText}`;
    const { value } = event.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));

    if (validationErrors[numericSectionId]?.[elementText]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        if (newErrors[numericSectionId]) {
          delete newErrors[numericSectionId][elementText];
          if (Object.keys(newErrors[numericSectionId]).length === 0) {
            delete newErrors[numericSectionId];
          }
        }
        return newErrors;
      });
    }
  };

  const handleDropdownValueChange = (event, elementText, sectionId) => {
    const numericSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
    const key = `${numericSectionId}_${elementText}`;
    setSelectedDropdownValues((prevValues) => ({
      ...prevValues,
      [key]: event.target.value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
    
    if (validationErrors[numericSectionId]?.[elementText]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        if (newErrors[numericSectionId]) {
          delete newErrors[numericSectionId][elementText];
          if (Object.keys(newErrors[numericSectionId]).length === 0) {
            delete newErrors[numericSectionId];
          }
        }
        return newErrors;
      });
    }
  };

  const shouldShowSection = (section) => {
    if (!section.sectionsettings?.conditional) return true;
    
    const conditions = section.sectionsettings.conditions || [];
    const mode = section.sectionsettings.mode || "All";

    if (conditions.length === 0) return true;

    let matchedConditions = 0;

    conditions.forEach((condition) => {
      if (!condition.question || !condition.answer) return;

      let conditionMet = false;

      for (const key in radioValues) {
        const [checkSectionId] = key.split('_');
        const numericCheckSectionId = Number(checkSectionId);
        if (!Object.values(repeatedSections).flat().includes(numericCheckSectionId)) {
          if (
            key.endsWith(`_${condition.question}`) &&
            radioValues[key] === condition.answer
          ) {
            conditionMet = true;
            break;
          }
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") return;
        return;
      }

      for (const key in checkboxValues) {
        const [checkSectionId] = key.split('_');
        const numericCheckSectionId = Number(checkSectionId);
        if (!Object.values(repeatedSections).flat().includes(numericCheckSectionId)) {
          if (
            key.endsWith(`_${condition.question}`) &&
            checkboxValues[key]?.[condition.answer]
          ) {
            conditionMet = true;
            break;
          }
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") return;
        return;
      }

      for (const key in selectedDropdownValues) {
        const [checkSectionId] = key.split('_');
        const numericCheckSectionId = Number(checkSectionId);
        if (!Object.values(repeatedSections).flat().includes(numericCheckSectionId)) {
          if (
            key.endsWith(`_${condition.question}`) &&
            selectedDropdownValues[key] === condition.answer
          ) {
            conditionMet = true;
            break;
          }
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") return;
        return;
      }

      for (const key in selectedYesNoValues) {
        const [checkSectionId] = key.split('_');
        const numericCheckSectionId = Number(checkSectionId);
        if (!Object.values(repeatedSections).flat().includes(numericCheckSectionId)) {
          if (
            key.endsWith(`_${condition.question}`) &&
            selectedYesNoValues[key] === condition.answer
          ) {
            conditionMet = true;
            break;
          }
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") return;
      }
    });

    if (mode === "Any") {
      return matchedConditions > 0;
    } else {
      return matchedConditions === conditions.length;
    }
  };

  const getVisibleSections = () => {
    const visibleBaseSections = (sections || []).filter(shouldShowSection);
    const allSections = [];

    visibleBaseSections.forEach((section) => {
      allSections.push(section);

      if (section.sectionsettings?.sectionRepeatingMode && repeatedSections[section.id]) {
        repeatedSections[section.id].forEach((repeatId, index) => {
          allSections.push({
            ...section,
            id: repeatId.toString(),
            text: `${section.text} (Repeated ${index + 1})`,
            isRepeated: true,
            originalSectionId: section.id
          });
        });
      }
    });

    console.log("All sections in order:", allSections.map(s => ({ id: s.id, text: s.text, isRepeated: s.isRepeated })));
    return allSections;
  };

  const visibleSections = getVisibleSections();
  const totalSteps = visibleSections.length;

  const shouldShowElement = (element, sectionId) => {
    const settings = element.questionsectionsettings;
    if (!settings?.conditional) return true;
    
    const conditions = settings?.conditions || [];
    const mode = settings?.mode || "All";

    if (conditions.length === 0) return true;

    let matchedConditions = 0;

    for (const condition of conditions) {
      const { question, answer } = condition;
      if (!question || !answer) continue;

      let conditionMet = false;

      for (const key in radioValues) {
        const [keySectionId] = key.split('_');
        const numericKeySectionId = Number(keySectionId);
        const numericCurrentSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
        
        if (numericKeySectionId === numericCurrentSectionId && key.endsWith(`_${question}`) && radioValues[key] === answer) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") continue;
        else continue;
      }

      for (const key in checkboxValues) {
        const [keySectionId] = key.split('_');
        const numericKeySectionId = Number(keySectionId);
        const numericCurrentSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
        
        if (numericKeySectionId === numericCurrentSectionId && key.endsWith(`_${question}`) && checkboxValues[key]?.[answer]) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") continue;
        else continue;
      }

      for (const key in selectedDropdownValues) {
        const [keySectionId] = key.split('_');
        const numericKeySectionId = Number(keySectionId);
        const numericCurrentSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
        
        if (numericKeySectionId === numericCurrentSectionId && key.endsWith(`_${question}`) && selectedDropdownValues[key] === answer) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") continue;
        else continue;
      }

      for (const key in selectedYesNoValues) {
        const [keySectionId] = key.split('_');
        const numericKeySectionId = Number(keySectionId);
        const numericCurrentSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
        
        if (numericKeySectionId === numericCurrentSectionId && key.endsWith(`_${question}`) && selectedYesNoValues[key] === answer) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") continue;
        else continue;
      }

      if (mode === "All" && !conditionMet) {
        return false;
      }
    }

    if (mode === "Any") {
      return matchedConditions > 0;
    } else {
      return matchedConditions === conditions.length;
    }
  };

  const handleNext = () => {
    if (activeStep < totalSteps - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleDropdownChange = (event) => {
    const selectedIndex = event.target.value;
    setActiveStep(selectedIndex);
  };

  const handleSubmit = async () => {
    const errors = {};
    
    visibleSections.forEach((section) => {
      section.formElements.forEach((element) => {
        if (shouldShowElement(element, section.id) && element.questionsectionsettings?.required) {
          const key = `${section.id}_${element.text}`;
          
          if (element.type === "File Upload") {
            const fileInfo = uploadedFiles[key];
            if (!fileInfo || fileInfo.status !== 'completed') {
              if (!errors[section.id]) {
                errors[section.id] = {};
              }
              errors[section.id][element.text] = `Please upload the required file`;
            }
          } else {
            const hasAnswer = answeredElements[key];
            if (!hasAnswer) {
              if (!errors[section.id]) {
                errors[section.id] = {};
              }
              errors[section.id][element.text] = `This question is required`;
            }
          }
        }
      });
    });

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstErrorSectionId = Object.keys(errors)[0];
      const sectionIndex = visibleSections.findIndex(section => section.id === firstErrorSectionId);
      if (sectionIndex !== -1) {
        setActiveStep(sectionIndex);
      }
      
      toast.error("Please complete all required questions before submitting");
      return;
    }

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const data = prepareSubmitData(true);
      const isFinalSubmission = data.status === "Completed";
      
      if (isFinalSubmission) {
        data.issealed = true;
      }

      const endpoint =
        data.status === "Completed"
          ? `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/completeandnotify/${organizer._id}`
          : `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/${organizer._id}`;
      const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: JSON.stringify(data),
        redirect: "follow",
      };

      const response = await fetch(endpoint, requestOptions);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update organizer");
      }

      if (isFinalSubmission) {
        toast.success("Organizer completed and sealed successfully!");
        organizer.issealed = true;
        handleClose();
      } else {
        toast.success("Organizer saved successfully");
        handleClose();
      }
    } catch (error) {
      console.error("Error submitting organizer:", error);
      toast.error(
        error.message || "Something went wrong while updating organizer!"
      );
    }
  };

  const getQuestionTextValue = (question, sectionId) => {
    const numericSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
    const key = `${numericSectionId}_${question.text}`;

    switch (question.type) {
      case "Free Entry":
      case "Email":
      case "Number":
        return inputValues[key] || "";
      case "Radio Buttons":
        return radioValues[key] || "";
      case "Checkboxes":
        return checkboxValues[key]
          ? Object.keys(checkboxValues[key])
              .filter((k) => checkboxValues[key][k])
              .join(", ")
          : "";
      case "Yes/No":
        return selectedYesNoValues[key] || "";
      case "Dropdown":
        return selectedDropdownValues[key] || "";
      case "Date":
        return startDate?.toISOString() || "";
      case "Text Editor":
        return question.text || "";
      case "File Upload":
        const fileInfo = uploadedFiles[key];
        return (fileInfo && fileInfo.status === 'completed') ? fileInfo.fileName : "";
      default:
        return "";
    }
  };

  const getOptionSelectedState = (question, option, sectionId) => {
    const numericSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
    const key = `${numericSectionId}_${question.text}`;
    switch (question.type) {
      case "Radio Buttons":
        return radioValues[key] === option.text;
      case "Checkboxes":
        return checkboxValues[key]?.[option.text] || false;
      case "Yes/No":
        return selectedYesNoValues[key] === option.text;
      case "Dropdown":
        return selectedDropdownValues[key] === option.text;
      default:
        return false;
    }
  };

  useEffect(() => {
    if (organizer?.sections) {
      const newInputValues = {};
      const newRadioValues = {};
      const newCheckboxValues = {};
      const newSelectedYesNoValues = {};
      const newSelectedDropdownValues = {};
      const newAnsweredElements = {};
      const newUploadedFiles = {};
      const newRepeatedSections = {};
      let initialDate = dayjs();

      organizer.sections.forEach((section) => {
        const sectionId = section.id;

        if (section.sectionsettings?.isRepeated && section.sectionsettings?.originalSectionId) {
          const originalSectionId = section.sectionsettings.originalSectionId;
          if (!newRepeatedSections[originalSectionId]) {
            newRepeatedSections[originalSectionId] = [];
          }
          newRepeatedSections[originalSectionId].push(Number(sectionId));
        }

        section.formElements.forEach((element) => {
          const numericSectionId = Number(sectionId);
          const key = `${numericSectionId}_${element.text}`;

          if (element.textvalue) {
            newAnsweredElements[key] = true;

            switch (element.type) {
              case "Free Entry":
              case "Email":
              case "Number":
                newInputValues[key] = element.textvalue;
                break;
              case "Radio Buttons":
                newRadioValues[key] = element.textvalue;
                break;
              case "Checkboxes":
                const selectedOptions = element.textvalue
                  .split(",")
                  .map((s) => s.trim());
                newCheckboxValues[key] = {};
                element.options.forEach((option) => {
                  newCheckboxValues[key][option.text] =
                    selectedOptions.includes(option.text);
                });
                break;
              case "Yes/No":
                newSelectedYesNoValues[key] = element.textvalue;
                break;
              case "Dropdown":
                newSelectedDropdownValues[key] = element.textvalue;
                break;
              case "Date":
                initialDate = dayjs(element.textvalue);
                break;
              case "File Upload":
                if (element.fileMetadata && element.fileMetadata.fileName) {
                  newUploadedFiles[key] = {
                    fileName: element.fileMetadata.fileName,
                    filePath: element.fileMetadata.filePath,
                    uploadDate: element.fileMetadata.uploadDate,
                    uploadedBy: element.fileMetadata.uploadedBy,
                    status: 'completed'
                  };
                } else if (element.textvalue) {
                  newUploadedFiles[key] = {
                    fileName: element.textvalue,
                    status: 'completed'
                  };
                }
                break;
            }
          }
        });
      });

      // Clear any file data that's not completed
      Object.keys(newUploadedFiles).forEach(key => {
        if (newUploadedFiles[key]?.status !== 'completed') {
          delete newUploadedFiles[key];
        }
      });

      setInputValues(newInputValues);
      setRadioValues(newRadioValues);
      setCheckboxValues(newCheckboxValues);
      setSelectedYesNoValues(newSelectedYesNoValues);
      setSelectedDropdownValues(newSelectedDropdownValues);
      setAnsweredElements(newAnsweredElements);
      setStartDate(initialDate);
      setUploadedFiles(newUploadedFiles);
      setRepeatedSections(newRepeatedSections);
    }
  }, [organizer]);

  const isElementActive = (element) => {
    if (organizer?.issealed) return true;
    return element.active === true;
  };

  const hasError = (sectionId, elementText) => {
    return !!validationErrors[sectionId]?.[elementText];
  };

  const getErrorMessage = (sectionId, elementText) => {
    return validationErrors[sectionId]?.[elementText] || '';
  };

  const renderSection = (section, isRepeated = false, originalSectionId = null) => {
    const sectionId = section.id;
    const canRepeat = section.sectionsettings?.sectionRepeatingMode && !isRepeated;

    return (
      <Box key={sectionId}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            {section.text}
          </Typography>
          {isRepeated && (
            <Button 
              variant="outlined" 
              color="error" 
              size="small"
              onClick={() => removeRepeatedSection(originalSectionId, Number(sectionId))}
              disabled={organizer?.issealed}
            >
              Remove Section
            </Button>
          )}
        </Box>

        {section.formElements.map(
          (element) =>
            shouldShowElement(element, sectionId) && (
              <Box key={`${sectionId}_${element.id}`}>
                {element.type === "Text Editor" && (
                  <Box mt={2} mb={2}>
                    <Typography>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: element.text,
                        }}
                      />
                    </Typography>
                  </Box>
                )}

                {(element.type === "Free Entry" || element.type === "Email") && (
                  <Box mt={2}>
                    <Typography
                      variant="subtitle2"
                      component="p"
                      gutterBottom
                      sx={{ fontWeight: "550" }}
                    >
                      {element.text}
                      {element.questionsectionsettings?.required && (
                        <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
                      )}
                    </Typography>
                    <TextField
                      disabled={isElementActive(element)}
                      variant="filled"
                      size="small"
                      multiline
                      fullWidth
                      placeholder={`${element.type} Answer`}
                      inputProps={{
                        type:
                          element.type === "Free Entry"
                            ? "text"
                            : element.type.toLowerCase(),
                      }}
                      style={{ display: "block" }}
                      value={
                        inputValues[
                          `${sectionId}_${element.text}`
                        ] || ""
                      }
                      onChange={(e) =>
                        handleInputChange(
                          e,
                          element.text,
                          sectionId
                        )
                      }
                      error={hasError(sectionId, element.text)}
                    />
                    {hasError(sectionId, element.text) && (
                      <Typography 
                        variant="caption" 
                        color="error" 
                        sx={{ display: 'block', mt: 0.5, ml: 1 }}
                      >
                        {getErrorMessage(sectionId, element.text)}
                      </Typography>
                    )}
                  </Box>
                )}

                {element.type === "Number" && (
                  <Box mt={2}>
                    <Typography
                      variant="subtitle2"
                      component="p"
                      gutterBottom
                      sx={{ fontWeight: "550" }}
                    >
                      {element.text}
                      {element.questionsectionsettings?.required && (
                        <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
                      )}
                    </Typography>
                    <TextField
                      disabled={isElementActive(element)}
                      variant="outlined"
                      size="small"
                      multiline
                      fullWidth
                      placeholder={`${element.type} Answer`}
                      inputProps={{
                        type: "text",
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                      }}
                      maxRows={8}
                      style={{
                        display: "block",
                        marginTop: "15px",
                      }}
                      value={
                        inputValues[
                          `${sectionId}_${element.text}`
                        ] || ""
                      }
                      onChange={(e) => {
                        const numericValue =
                          e.target.value.replace(/\D/g, "");
                        handleInputChange(
                          { target: { value: numericValue } },
                          element.text,
                          sectionId
                        );
                      }}
                      error={hasError(sectionId, element.text)}
                    />
                    {hasError(sectionId, element.text) && (
                      <Typography 
                        variant="caption" 
                        color="error" 
                        sx={{ display: 'block', mt: 0.5, ml: 1 }}
                      >
                        {getErrorMessage(sectionId, element.text)}
                      </Typography>
                    )}
                  </Box>
                )}

                {element.type === "Radio Buttons" && (
                  <Box mt={2}>
                    <Typography
                      variant="subtitle2"
                      component="p"
                      gutterBottom
                      sx={{ fontWeight: "550" }}
                    >
                      {element.text}
                      {element.questionsectionsettings?.required && (
                        <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
                      )}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      {element.options.map((option) => (
                        <SelectableButton
                          key={option.text}
                          selected={
                            radioValues[
                              `${sectionId}_${element.text}`
                            ] === option.text
                          }
                          disabled={isElementActive(element)}
                          onClick={() =>
                            handleRadioChange(
                              option.text,
                              element.text,
                              sectionId
                            )
                          }
                        >
                          {option.text}
                        </SelectableButton>
                      ))}
                    </Box>
                    {hasError(sectionId, element.text) && (
                      <Typography 
                        variant="caption" 
                        color="error" 
                        sx={{ display: 'block', mt: 0.5, ml: 1 }}
                      >
                        {getErrorMessage(sectionId, element.text)}
                      </Typography>
                    )}
                  </Box>
                )}

                {element.type === "Checkboxes" && (
                  <Box mt={2}>
                    <Typography
                      variant="subtitle2"
                      component="p"
                      gutterBottom
                      sx={{ fontWeight: "550" }}
                    >
                      {element.text}
                      {element.questionsectionsettings?.required && (
                        <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
                      )}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      {element.options.map((option) => (
                        <SelectableButton
                          key={option.text}
                          selected={
                            checkboxValues[
                              `${sectionId}_${element.text}`
                            ]?.[option.text]
                          }
                          disabled={isElementActive(element)}
                          onClick={() =>
                            handleCheckboxChange(
                              option.text,
                              element.text,
                              sectionId
                            )
                          }
                        >
                          {option.text}
                        </SelectableButton>
                      ))}
                    </Box>
                    {hasError(sectionId, element.text) && (
                      <Typography 
                        variant="caption" 
                        color="error" 
                        sx={{ display: 'block', mt: 0.5, ml: 1 }}
                      >
                        {getErrorMessage(sectionId, element.text)}
                      </Typography>
                    )}
                  </Box>
                )}

                {element.type === "Yes/No" && (
                  <Box mt={2}>
                    <Typography
                      variant="subtitle2"
                      component="p"
                      gutterBottom
                      sx={{ fontWeight: "550" }}
                    >
                      {element.text}
                      {element.questionsectionsettings?.required && (
                        <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
                      )}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {element.options.map((option) => (
                        <SelectableButton
                          key={option.text}
                          selected={
                            selectedYesNoValues[
                              `${sectionId}_${element.text}`
                            ] === option.text
                          }
                          disabled={isElementActive(element)}
                          onClick={() =>
                            handleYesNoChange(
                              option.text,
                              element.text,
                              sectionId
                            )
                          }
                        >
                          {option.text}
                        </SelectableButton>
                      ))}
                    </Box>
                    {hasError(sectionId, element.text) && (
                      <Typography 
                        variant="caption" 
                        color="error" 
                        sx={{ display: 'block', mt: 0.5, ml: 1 }}
                      >
                        {getErrorMessage(sectionId, element.text)}
                      </Typography>
                    )}
                  </Box>
                )}

                {element.type === "Dropdown" && (
                  <Box mt={2}>
                    <Typography
                      variant="subtitle2"
                      component="p"
                      gutterBottom
                      sx={{ fontWeight: "550" }}
                    >
                      {element.text}
                      {element.questionsectionsettings?.required && (
                        <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
                      )}
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        value={
                          selectedDropdownValues[
                            `${sectionId}_${element.text}`
                          ] || ""
                        }
                        disabled={isElementActive(element)}
                        onChange={(event) =>
                          handleDropdownValueChange(
                            event,
                            element.text,
                            sectionId
                          )
                        }
                        size="small"
                      >
                        {element.options.map((option) => (
                          <MenuItem
                            key={option.text}
                            value={option.text}
                          >
                            {option.text}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {hasError(sectionId, element.text) && (
                      <Typography 
                        variant="caption" 
                        color="error" 
                        sx={{ display: 'block', mt: 0.5, ml: 1 }}
                      >
                        {getErrorMessage(sectionId, element.text)}
                      </Typography>
                    )}
                  </Box>
                )}

                {element.type === "Date" && (
                  <Box mt={2}>
                    <Typography
                      variant="subtitle2"
                      component="p"
                      gutterBottom
                      sx={{ fontWeight: "550" }}
                    >
                      {element.text}
                      {element.questionsectionsettings?.required && (
                        <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
                      )}
                    </Typography>
                    <DatePicker
                      format="DD/MM/YYYY"
                      sx={{
                        width: "100%",
                        backgroundColor: "#fff",
                      }}
                      value={startDate}
                      disabled={isElementActive(element)}
                      onChange={(newValue) => {
                        if (!isElementActive(element)) {
                          setStartDate(newValue);
                          setAnsweredElements((prev) => ({
                            ...prev,
                            [`${sectionId}_${element.text}`]: true,
                          }));
                          if (validationErrors[sectionId]?.[element.text]) {
                            setValidationErrors(prev => {
                              const newErrors = { ...prev };
                              if (newErrors[sectionId]) {
                                delete newErrors[sectionId][element.text];
                                if (Object.keys(newErrors[sectionId]).length === 0) {
                                  delete newErrors[sectionId];
                                }
                              }
                              return newErrors;
                            });
                          }
                        }
                      }}
                      renderInput={(params) => (
                        <TextField {...params} size="small" />
                      )}
                    />
                    {hasError(sectionId, element.text) && (
                      <Typography 
                        variant="caption" 
                        color="error" 
                        sx={{ display: 'block', mt: 0.5, ml: 1 }}
                      >
                        {getErrorMessage(sectionId, element.text)}
                      </Typography>
                    )}
                  </Box>
                )}

                {element.type === "File Upload" && (
                  <Box mt={2}>
                    <Typography
                      variant="subtitle2"
                      component="p"
                      gutterBottom
                      sx={{ fontWeight: "550" }}
                    >
                      {element.text}
                      {element.questionsectionsettings?.required && (
                        <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
                      )}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Button
                        variant="outlined"
                        component="label"
                        disabled={
                          isElementActive(element) || 
                          uploadedFiles[`${sectionId}_${element.text}`]?.status === 'completed'
                        }
                      >
                        Choose File
                        <Input
                          type="file"
                          onChange={(e) => {
                            const selectedFile = e.target.files[0];
                            if (selectedFile) {
                              setFile(selectedFile);
                              setIsDocumentForm(true);
                              const key = `${sectionId}_${element.text}`;
                              
                              setPendingFiles((prev) => ({
                                ...prev,
                                [key]: {
                                  fileName: selectedFile.name,
                                  file: selectedFile,
                                },
                              }));
                            }
                          }}
                          sx={{ display: "none" }}
                          disabled={
                            isElementActive(element) || 
                            uploadedFiles[`${sectionId}_${element.text}`]?.status === 'completed'
                          }
                        />
                      </Button>
                      
                      {/* File display with delete option */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                        {pendingFiles[`${sectionId}_${element.text}`] && (
                          <Typography variant="body2">
                            {pendingFiles[`${sectionId}_${element.text}`].fileName}
                            {" (Ready to upload)"}
                          </Typography>
                        )}
                        
                        {uploadedFiles[`${sectionId}_${element.text}`] && (
                          <>
                            <Typography variant="body2" sx={{ flex: 1 }}>
                              {uploadedFiles[`${sectionId}_${element.text}`].fileName}
                            </Typography>
                            
                            {/* Delete icon button */}
                            {!isElementActive(element) && (
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleDeleteFile(sectionId, element.text)}
                                title="Delete file"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            )}
                          </>
                        )}
                      </Box>
                    </Box>
                    
                    {/* Status messages */}
                    {hasError(sectionId, element.text) && (
                      <Typography 
                        variant="caption" 
                        color="error" 
                        sx={{ display: 'block', mt: 0.5, ml: 1 }}
                      >
                        {getErrorMessage(sectionId, element.text)}
                      </Typography>
                    )}
                    
                    {pendingFiles[`${sectionId}_${element.text}`] && (
                      <Typography variant="caption" color="warning.main">
                        ⚠ File selected but not uploaded yet
                      </Typography>
                    )}
                    {uploadedFiles[`${sectionId}_${element.text}`]?.status === 'uploading' && (
                      <Typography variant="caption" color="primary">
                        Uploading...
                      </Typography>
                    )}
                    {uploadedFiles[`${sectionId}_${element.text}`]?.status === 'completed' && (
                      <Typography variant="caption" color="success.main">
                        ✓ Uploaded successfully
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            )
        )}

        {canRepeat && (
          <Box mt={3} mb={2}>
            <Button 
              variant="outlined" 
              onClick={() => addRepeatedSection(sectionId)}
              disabled={organizer?.issealed}
              startIcon={<AddIcon />}
            >
              Add Another {section.text}
            </Button>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Dialog fullScreen open={open} onClose={handleClose}>
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 3,
              py: 2,
              borderBottom: "1px solid #ddd",
            }}
          >
            <Typography variant="h6" component="p">
              {organizer?.organizerName || "Organizer"}
            </Typography>
            <IconButton edge="end" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <FormControl
              fullWidth
              sx={{ marginBottom: "10px", marginTop: "10px" }}
            >
              <Select
                value={activeStep}
                onChange={handleDropdownChange}
                size="small"
              >
                {visibleSections.map((section, index) => {
                  const visibleElements = section.formElements.filter((el) =>
                    shouldShowElement(el, section.id)
                  );

                  const answeredCount = visibleElements.reduce(
                    (count, element) => {
                      const key = `${section.id}_${element.text}`;
                      return count + (answeredElements[key] ? 1 : 0);
                    },
                    0
                  );

                  const totalVisibleElements = visibleElements.length;

                  return (
                    <MenuItem key={section.id} value={index}>
                      {section.text} ({answeredCount}/{totalVisibleElements})
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <Box mt={2} mb={2}>
              <LinearProgress
                variant="determinate"
                value={((activeStep + 1) / totalSteps) * 100}
              />
            </Box>

            <Box sx={{ pl: 20, pr: 20 }}>
              {visibleSections.map(
                (section, sectionIndex) =>
                  sectionIndex === activeStep && (
                    renderSection(
                      section, 
                      section.isRepeated, 
                      section.originalSectionId
                    )
                  )
              )}

              <Box
                mt={3}
                display="flex"
                alignItems="center"
                justifyContent={"space-between"}
              >
                <Box display="flex" gap={3} alignItems="center">
                  {activeStep > 0 && (
                    <Button onClick={handleBack} variant="outlined">
                      <ArrowBackIcon fontSize="small" />
                    </Button>
                  )}

                  {activeStep < totalSteps - 1 ? (
                    <Button onClick={handleNext} color="primary"  sx={{
                      backgroundColor: 'text.menu',
                      color: 'primary.contrastText',
                      '&:hover': {
                        backgroundColor: 'menu.dark',
                        boxShadow: 1,
                      },
                      transition: 'background-color 0.2s ease'
                    }}>
                      Next{" "}
                      <ArrowForwardIcon
                        fontSize="small"
                        sx={{ marginLeft: 2 }}
                      />
                    </Button>
                  ) : (
                    <Button  onClick={handleSubmit} color="primary"  sx={{
                      backgroundColor: 'text.menu',
                      color: 'primary.contrastText',
                      '&:hover': {
                        backgroundColor: 'menu.dark',
                        boxShadow: 1,
                      },
                      transition: 'background-color 0.2s ease'
                    }}>
                      Submit
                    </Button>
                  )}
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                  <Typography>
                    Step {activeStep + 1} of {totalSteps}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </LocalizationProvider>

      <FileUploadDrawer
        isOpen={isDocumentForm}
        organizer={organizer}
        onClose={() => {
          // If drawer is closed without uploading, remove the pending file
          if (file) {
            const key = Object.keys(pendingFiles).find(
              (k) => pendingFiles[k]?.file === file
            );
            if (key) {
              setPendingFiles((prev) => {
                const newState = { ...prev };
                delete newState[key];
                return newState;
              });
            }
            setFile(null);
          }
          setIsDocumentForm(false);
        }}
        file={file}
        accountId={accountId}
        folderTree={folderTree}
        onUploadSuccess={(fileData) => {
          console.log("File uploaded successfully:", fileData);
          
          // Find the key for the current file being uploaded
          const key = Object.keys(pendingFiles).find(
            (k) => pendingFiles[k]?.file === file
          );

          if (key) {
            // Move from pendingFiles to uploadedFiles with completed status
            setUploadedFiles((prev) => ({
              ...prev,
              [key]: {
                fileName: fileData.fileName,
                filePath: fileData.filePath,
                uploadDate: new Date().toISOString(),
                uploadedBy: accountName || username,
                status: 'completed'
              },
            }));

            // Remove from pending files
            setPendingFiles((prev) => {
              const newState = { ...prev };
              delete newState[key];
              return newState;
            });

            // Mark as answered ONLY after successful upload
            setAnsweredElements((prev) => ({
              ...prev,
              [key]: true,
            }));

            // Clear validation error for this field
            const [sectionId, elementText] = key.split('_');
            const numericSectionId = Number(sectionId);
            if (validationErrors[numericSectionId]?.[elementText]) {
              setValidationErrors(prev => {
                const newErrors = { ...prev };
                if (newErrors[numericSectionId]) {
                  delete newErrors[numericSectionId][elementText];
                  if (Object.keys(newErrors[numericSectionId]).length === 0) {
                    delete newErrors[numericSectionId];
                  }
                }
                return newErrors;
              });
            }

            // Trigger auto-save with the updated file metadata
            const data = prepareSubmitData(false);
            debouncedAutoSave(data);
            
            toast.success("File uploaded successfully!");
          }

          setIsDocumentForm(false);
          setFile(null);
        }}
        onUploadError={(error) => {
          console.error("File upload failed:", error);
          const key = Object.keys(pendingFiles).find(
            (k) => pendingFiles[k]?.file === file
          );
          if (key) {
            // Remove the file from pending files if upload fails
            setPendingFiles((prev) => {
              const newState = { ...prev };
              delete newState[key];
              return newState;
            });
          }
          setFile(null);
          toast.error("File upload failed!");
        }}
      />
    </>
  );
};

// FileUploadDrawer component remains the same as in your original code
// const FileUploadDrawer = ({
//   isOpen,
//   onClose,
//   folderTree,
//   fetchFolderTree,
//   selectedFolderForMenu,
//   file,
//   onUploadSuccess,
//   onUploadError,
// }) => {
//   const [selectedFolder, setSelectedFolder] = useState("");
//   const [message, setMessage] = useState("");
//   const [isUploading, setIsUploading] = useState(false);

//   useEffect(() => {
//     if (isOpen && selectedFolderForMenu) {
//       setSelectedFolder(selectedFolderForMenu.path);
//     } else if (!isOpen) {
//       setSelectedFolder("");
//       setMessage("");
//       setIsUploading(false);
//     }
//   }, [isOpen, selectedFolderForMenu]);

//   const handleFolderSelect = (path) => setSelectedFolder(path);

//   const handleUpload = async () => {
//     if (!file || !selectedFolder) {
//       setMessage("Please select a file and a folder.");
//       return;
//     }

//     setIsUploading(true);
//     setMessage("");

//     try {
//       const formData = new FormData();
//       formData.append("files", file);

//       const res = await axios.post(
//         `https://www.snptaxes.com/api/accountsdoc/file/upload?folderPath=${encodeURIComponent(
//           selectedFolder
//         )}`,
//         formData,
//         { 
//           headers: { "Content-Type": "multipart/form-data" },
//           onUploadProgress: (progressEvent) => {
//             const progress = Math.round(
//               (progressEvent.loaded * 100) / progressEvent.total
//             );
//             setMessage(`Uploading... ${progress}%`);
//           }
//         }
//       );

//       const successMessage = `✅ ${res.data.message || "File uploaded successfully"}`;
//       setMessage(successMessage);
      
//       // Call the success callback with file data
//       if (onUploadSuccess) {
//         onUploadSuccess({
//           fileName: file.name,
//           filePath: selectedFolder,
//           uploadDate: new Date().toISOString(),
//           serverResponse: res.data
//         });
//       }

//       // Refresh folder tree and close drawer
//       if (fetchFolderTree) {
//         fetchFolderTree();
//       }
      
//       // Don't close immediately - let user see success message
//       setTimeout(() => {
//         onClose();
//       }, 1500);

//     } catch (err) {
//       console.error("Upload error:", err);
//       const errorMessage = "❌ Error uploading file";
//       setMessage(errorMessage);
//       toast.error(errorMessage);
      
//       // Call the error callback
//       if (onUploadError) {
//         onUploadError(err);
//       }
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <Drawer 
//       anchor="right" 
//       open={isOpen} 
//       onClose={onClose}  
//       ModalProps={{
//         keepMounted: true
//       }}
//       sx={{
//         zIndex: (theme) => theme.zIndex.modal + 1,
//         width: 600,
//       }}
//     >
//       <Box sx={{ width: 400, p: 3, height: "100%" }}>
//         <Typography variant="h6" gutterBottom>
//           📄 Upload File
//         </Typography>

//         {/* Display selected file info */}
//         {file && (
//           <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
//             <Typography variant="subtitle2" gutterBottom>
//               Selected File:
//             </Typography>
//             <Typography variant="body2">
//               <strong>Name:</strong> {file.name}
//             </Typography>
//             <Typography variant="body2">
//               <strong>Size:</strong> {(file.size / (1024 * 1024)).toFixed(2)} MB
//             </Typography>
//             <Typography variant="body2">
//               <strong>Type:</strong> {file.type || 'Unknown'}
//             </Typography>
//           </Box>
//         )}

//         <Button
//           variant="contained"
//           color="primary"
//           fullWidth
//           onClick={handleUpload}
//           disabled={!file || !selectedFolder || isUploading}
//           sx={{ mb: 2 }}
//         >
//           {isUploading ? 'Uploading...' : 'Upload File'}
//         </Button>

//         {message && (
//           <Typography 
//             sx={{ 
//               mt: 2, 
//               mb: 2, 
//               fontWeight: "bold",
//               color: message.includes('❌') ? 'error.main' : 'success.main'
//             }}
//           >
//             {message}
//           </Typography>
//         )}

//         <Box sx={{ mt: 3, mb: 3 }}>
//           <Typography variant="subtitle1" gutterBottom>
//             Select Upload Folder
//           </Typography>
//           <FolderTreeSelector
//             items={folderTree}
//             onSelect={handleFolderSelect}
//             selectedFolder={selectedFolder}
//           />
//         </Box>

//         <Button 
//           variant="outlined" 
//           fullWidth 
//           onClick={onClose}
//           disabled={isUploading}
//         >
//           Cancel
//         </Button>
//       </Box>
//     </Drawer>
//   );
// };

// // FolderTreeSelector component remains the same as in your original code
// const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
//   const [expanded, setExpanded] = useState({});

//   const toggleExpand = (path) => {
//     setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
//   };

//   const getFileIcon = (fileName) => {
//     const ext = fileName.split(".").pop().toLowerCase();

//     switch (ext) {
//       case "pdf":
//         return <FaFilePdf color="#d32f2f" size={18} />;
//       case "jpg":
//       case "jpeg":
//       case "png":
//       case "gif":
//         return <FaFileImage color="#1976d2" size={18} />;
//       case "doc":
//       case "docx":
//         return <FaFileWord color="#1565c0" size={18} />;
//       case "xls":
//       case "xlsx":
//         return <FaFileExcel color="#2e7d32" size={18} />;
//       case "txt":
//       case "md":
//         return <FaFileAlt color="#616161" size={18} />;
//       default:
//         return <AiFillFileUnknown color="#757575" size={18} />;
//     }
//   };

//   return (
//     <List disablePadding>
//       {items?.map((item) => {
//         if (item.type !== "folder") return null;

//         // ⛔ Skip displaying this folder completely
//         if (item.name?.toLowerCase() === "firm documents shared with client") return null;

//         const isSelected = selectedFolder === item.path;
//         const isExpanded = expanded[item.path];

//         return (
//           <React.Fragment key={item.path}>
//             <ListItem
//               sx={{
//                 pl: 2 + level * 2,
//                 bgcolor: isSelected ? "#b2d8ff" : "transparent",
//                 borderRadius: 1,
//                 mb: 0.5,
//                 "&:hover": { bgcolor: "#dbefff", color: "black" },
//                 cursor: item.meta?.readOnly ? "not-allowed" : "pointer",
//               }}
//               onClick={() => {
//                 if (!item.meta?.readOnly) onSelect(item.path);
//               }}
//             >
//               <ListItemIcon
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   toggleExpand(item.path);
//                 }}
//                 sx={{ cursor: 'pointer', minWidth: 40 }}
//               >
//                 {isExpanded ? <FolderOpenIcon /> : <FolderIcon />}
//               </ListItemIcon>

//               <ListItemText
//                 primary={item.name}
//                 sx={{
//                   fontWeight: isSelected ? "bold" : "normal",
//                   color: isSelected ? "#0056b3" : "inherit",
//                 }}
//               />

//               {item.children?.length > 0 &&
//                 (isExpanded ? (
//                   <ExpandLess
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleExpand(item.path);
//                     }}
//                     sx={{ cursor: 'pointer' }}
//                   />
//                 ) : (
//                   <ExpandMore
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleExpand(item.path);
//                     }}
//                     sx={{ cursor: 'pointer' }}
//                   />
//                 ))}
//             </ListItem>

//             {item.children?.length > 0 && (
//               <Collapse in={isExpanded} timeout="auto" unmountOnExit>
//                 <FolderTreeSelector
//                   items={item.children}
//                   onSelect={onSelect}
//                   selectedFolder={selectedFolder}
//                   level={level + 1}
//                 />
//                 {item.meta?.files?.length > 0 && (
//                   <List sx={{ pl: 4 }}>
//                     {item.meta.files.map((file) => (
//                       <ListItem
//                         key={file.name}
//                         sx={{ pl: 2 }}
//                       >
//                         <ListItemIcon>
//                           <Box sx={{ mr: 1 }}>{getFileIcon(file.name)}</Box>
//                         </ListItemIcon>
//                         <ListItemText
//                           primary={`${file.name}${
//                             file.readOnly ? " (Read Only)" : ""
//                           }`}
//                         />
//                       </ListItem>
//                     ))}
//                   </List>
//                 )}
//               </Collapse>
//             )}
//           </React.Fragment>
//         );
//       })}
//     </List>
//   );
// };

export default OrganizerDialog;
// const OrganizerDialog = ({ open, handleClose, organizer }) => {
//   console.log("organizer", organizer);
//   const [accountName, setAccountName] = useState("");
//   const { accId } = useState(sessionStorage.getItem("accountId"));
  
//   const fetchAccountDetails = async () => {
//     try {
//       const res = await axios.get(
//         `https://www.snptaxes.com/api/accounts/${accId}`
//       );
//       setAccountName(res.data.accounts.accountName)
//       console.log("result", res.data);
//     } catch (error) {
//       console.error("Error fetching account details:", error);
//     }
//   };

//   useEffect(() => {
//     fetchAccountDetails();
//   }, [accId]);

//   const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
//   const { logindata } = useContext(LoginContext);
//   const [loginuserid, setLoginUserId] = useState();
  
//   useEffect(() => {
//     if (logindata?.user?.id) {
//       setLoginUserId(logindata.user.id);
//     }
//   }, [logindata]);

//   useEffect(() => {
//     if (loginuserid) {
//       console.log("loginuserid", loginuserid);
//       fetchData(loginuserid);
//       fetchAccountByUser(loginuserid);
//     }
//   }, [loginuserid]);

//   const [username, setUsername] = useState("");
//   const fetchData = async (id) => {
//     const myHeaders = new Headers();
//     const requestOptions = {
//       method: "GET",
//       headers: myHeaders,
//       redirect: "follow",
//     };
//     const url = `${LOGIN_API}/common/user/${id}`;
//     fetch(url, requestOptions)
//       .then((response) => response.json())
//       .then((result) => {
//         setUsername(result.username);
//       });
//   };

//   const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
//   const [accountId, setAccountId] = useState(sessionStorage.getItem("accountId"));
  
//   const fetchAccountByUser = async (id) => {
//     const myHeaders = new Headers();
//     const requestOptions = {
//       method: "GET",
//       headers: myHeaders,
//       redirect: "follow",
//     };
//     const url = `${ACCOUNT_API}/accounts/accountdetails/accountdetailslist/listbyuserid/${id}`;
//     fetch(url, requestOptions)
//       .then((response) => response.json())
//       .then((result) => {
//         setAccountId(result.accounts[0]._id);
//       });
//   };

//   const [folderTree, setFolderTree] = useState([]);
//   const [error, setError] = useState("");
  
//   useEffect(() => {
//     fetchFolderTree(accountId);
//   }, [accountId]);

//   const fetchFolderTree = async (accountId) => {
//     try {
//       const res = await fetch(`https://www.snptaxes.com/api/accountsdoc/files/list/clientView?folderPath=${accountId}`);
//       const data = await res.json();
//       console.log("janavi patil", data)
//       if (res.ok) {
//         setFolderTree(data.contents);
//       } else {
//         setError('Failed to fetch folder tree');
//       }
//     } catch (err) {
//       setError('Error fetching folder tree');
//     }
//   };

//   const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
//   const sections = organizer?.sections;

//   const [selectedDropdownValues, setSelectedDropdownValues] = useState({});
//   const [inputValues, setInputValues] = useState({});
//   const [selectedYesNoValues, setSelectedYesNoValues] = useState({});
//   const [radioValues, setRadioValues] = useState({});
//   const [checkboxValues, setCheckboxValues] = useState({});
//   const [answeredElements, setAnsweredElements] = useState({});
//   const [activeStep, setActiveStep] = useState(0);
//   const [startDate, setStartDate] = useState(dayjs());
//   const [uploadedFiles, setUploadedFiles] = useState({});
//   const [file, setFile] = useState(null);
//   const [isDocumentForm, setIsDocumentForm] = useState(false);
//   const [repeatedSections, setRepeatedSections] = useState({});
//   const [validationErrors, setValidationErrors] = useState({});
//   const [pendingFiles, setPendingFiles] = useState({});

//   const addRepeatedSection = (sectionId) => {
//     setRepeatedSections(prev => {
//       const currentRepeats = prev[sectionId] || [];
//       const baseId = Number(sectionId);
//       const newRepeatId = baseId + currentRepeats.length + 1000000;
      
//       return {
//         ...prev,
//         [sectionId]: [...currentRepeats, newRepeatId]
//       };
//     });
//   };

//   const removeRepeatedSection = (sectionId, repeatId) => {
//     setRepeatedSections(prev => {
//       const currentRepeats = prev[sectionId] || [];
//       const updatedRepeats = currentRepeats.filter(id => id !== repeatId);
      
//       cleanUpSectionData(repeatId);
      
//       return {
//         ...prev,
//         [sectionId]: updatedRepeats
//       };
//     });
//   };

//   const cleanUpSectionData = (sectionId) => {
//     const numericSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
    
//     setInputValues(prev => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach(key => {
//         if (key.startsWith(`${numericSectionId}_`)) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     setRadioValues(prev => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach(key => {
//         if (key.startsWith(`${numericSectionId}_`)) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     setCheckboxValues(prev => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach(key => {
//         if (key.startsWith(`${numericSectionId}_`)) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     setSelectedYesNoValues(prev => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach(key => {
//         if (key.startsWith(`${numericSectionId}_`)) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     setSelectedDropdownValues(prev => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach(key => {
//         if (key.startsWith(`${numericSectionId}_`)) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     setAnsweredElements(prev => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach(key => {
//         if (key.startsWith(`${numericSectionId}_`)) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     setUploadedFiles(prev => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach(key => {
//         if (key.startsWith(`${numericSectionId}_`)) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });

//     setPendingFiles(prev => {
//       const newValues = { ...prev };
//       Object.keys(newValues).forEach(key => {
//         if (key.startsWith(`${numericSectionId}_`)) {
//           delete newValues[key];
//         }
//       });
//       return newValues;
//     });
//   };

//   const debouncedAutoSave = useCallback(
//     debounce(async (data) => {
//       try {
//         const myHeaders = new Headers();
//         myHeaders.append("Content-Type", "application/json");

//         const raw = JSON.stringify(data);
//         console.log("autosave raw", raw);
//         const requestOptions = {
//           method: "PATCH",
//           headers: myHeaders,
//           body: raw,
//           redirect: "follow",
//         };

//         const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/${organizer._id}`;
//         const response = await fetch(url, requestOptions);
//         const result = await response.json();

//         if (!response.ok) {
//           throw new Error(result.message || "Failed to auto-save organizer");
//         }

//         console.log("Auto-save successful");
//       } catch (error) {
//         console.error("Error auto-saving organizer:", error);
//       }
//     }, 2000),
//     [organizer?._id]
//   );

//   const prepareSubmitData = (finalSubmit = false) => {
//     const allSectionsInOrder = getVisibleSections();

//     const sectionsData = allSectionsInOrder.map((section) => ({
//       name: section?.text || "",
//       id: section?.id || "",
//       text: section?.text || "",
//       sectionsettings: section?.sectionsettings,
//       formElements:
//         section?.formElements?.map((question) => {
//           const questionData = {
//             type: question?.type || "",
//             id: question?.id || "",
//             sectionid: Number(section?.id) || 0,
//             options:
//               question?.options?.map((option) => ({
//                 id: option?.id || "",
//                 text: option?.text || "",
//                 selected: getOptionSelectedState(question, option, Number(section.id)),
//               })) || [],
//             text: question?.text || "",
//             textvalue: getQuestionTextValue(question, Number(section.id)),
//             questionsectionsettings: question?.questionsectionsettings,
//           };

//           // Add file metadata ONLY for completed file uploads
//           if (question.type === "File Upload") {
//             const fileKey = `${section.id}_${question.text}`;
//             const fileInfo = uploadedFiles[fileKey];
            
//             // ONLY include file metadata if upload is completed
//             if (fileInfo && fileInfo.status === 'completed') {
//               questionData.fileMetadata = {
//                 fileName: fileInfo.fileName,
//                 filePath: fileInfo.filePath || '',
//                 uploadDate: fileInfo.uploadDate || new Date().toISOString(),
//                 uploadedBy: accountName || username,
//               };
//               questionData.textvalue = fileInfo.fileName;
//             } else {
//               // For pending or non-existent files, ensure no file data is saved
//               questionData.textvalue = "";
//               // Don't include fileMetadata at all for pending files
//             }
//           }

//           return questionData;
//         }) || [],
//     }));

//     const data = {
//       sections: sectionsData,
//       status: finalSubmit ? "Completed" : "In Progress",
//       completedby: accountName,
//       active: true,
//       repeatedSections: repeatedSections,
//     };

//     console.log("Data being saved to backend:", JSON.stringify(data, null, 2));
    
//     return data;
//   };

//   useEffect(() => {
//     if (open && organizer?._id) {
//       const data = prepareSubmitData(false);
//       debouncedAutoSave(data);
//     }
//   }, [
//     open,
//     organizer?._id,
//     inputValues,
//     radioValues,
//     checkboxValues,
//     selectedYesNoValues,
//     selectedDropdownValues,
//     startDate,
//     uploadedFiles,
//     repeatedSections,
//     debouncedAutoSave,
//   ]);

//   useEffect(() => {
//     return () => {
//       debouncedAutoSave.cancel();
//     };
//   }, [debouncedAutoSave]);

//   const handleRadioChange = (value, elementText, sectionId) => {
//     const numericSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
//     const key = `${numericSectionId}_${elementText}`;
//     setRadioValues((prevValues) => ({
//       ...prevValues,
//       [key]: value,
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));
    
//     if (validationErrors[numericSectionId]?.[elementText]) {
//       setValidationErrors(prev => {
//         const newErrors = { ...prev };
//         if (newErrors[numericSectionId]) {
//           delete newErrors[numericSectionId][elementText];
//           if (Object.keys(newErrors[numericSectionId]).length === 0) {
//             delete newErrors[numericSectionId];
//           }
//         }
//         return newErrors;
//       });
//     }
//   };

//   const handleCheckboxChange = (value, elementText, sectionId) => {
//     const numericSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
//     const key = `${numericSectionId}_${elementText}`;
//     setCheckboxValues((prevValues) => ({
//       ...prevValues,
//       [key]: {
//         ...prevValues[key],
//         [value]: !prevValues[key]?.[value],
//       },
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));

//     if (validationErrors[numericSectionId]?.[elementText]) {
//       setValidationErrors(prev => {
//         const newErrors = { ...prev };
//         if (newErrors[numericSectionId]) {
//           delete newErrors[numericSectionId][elementText];
//           if (Object.keys(newErrors[numericSectionId]).length === 0) {
//             delete newErrors[numericSectionId];
//           }
//         }
//         return newErrors;
//       });
//     }
//   };

//   const handleYesNoChange = (value, elementText, sectionId) => {
//     const numericSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
//     const key = `${numericSectionId}_${elementText}`;
//     setSelectedYesNoValues((prevValues) => ({
//       ...prevValues,
//       [key]: value,
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));
    
//     if (validationErrors[numericSectionId]?.[elementText]) {
//       setValidationErrors(prev => {
//         const newErrors = { ...prev };
//         if (newErrors[numericSectionId]) {
//           delete newErrors[numericSectionId][elementText];
//           if (Object.keys(newErrors[numericSectionId]).length === 0) {
//             delete newErrors[numericSectionId];
//           }
//         }
//         return newErrors;
//       });
//     }
//   };

//   const handleInputChange = (event, elementText, sectionId) => {
//     const numericSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
//     const key = `${numericSectionId}_${elementText}`;
//     const { value } = event.target;
//     setInputValues((prevValues) => ({
//       ...prevValues,
//       [key]: value,
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));

//     if (validationErrors[numericSectionId]?.[elementText]) {
//       setValidationErrors(prev => {
//         const newErrors = { ...prev };
//         if (newErrors[numericSectionId]) {
//           delete newErrors[numericSectionId][elementText];
//           if (Object.keys(newErrors[numericSectionId]).length === 0) {
//             delete newErrors[numericSectionId];
//           }
//         }
//         return newErrors;
//       });
//     }
//   };

//   const handleDropdownValueChange = (event, elementText, sectionId) => {
//     const numericSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
//     const key = `${numericSectionId}_${elementText}`;
//     setSelectedDropdownValues((prevValues) => ({
//       ...prevValues,
//       [key]: event.target.value,
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));
    
//     if (validationErrors[numericSectionId]?.[elementText]) {
//       setValidationErrors(prev => {
//         const newErrors = { ...prev };
//         if (newErrors[numericSectionId]) {
//           delete newErrors[numericSectionId][elementText];
//           if (Object.keys(newErrors[numericSectionId]).length === 0) {
//             delete newErrors[numericSectionId];
//           }
//         }
//         return newErrors;
//       });
//     }
//   };

//   const shouldShowSection = (section) => {
//     if (!section.sectionsettings?.conditional) return true;
    
//     const conditions = section.sectionsettings.conditions || [];
//     const mode = section.sectionsettings.mode || "All";

//     if (conditions.length === 0) return true;

//     let matchedConditions = 0;

//     conditions.forEach((condition) => {
//       if (!condition.question || !condition.answer) return;

//       let conditionMet = false;

//       for (const key in radioValues) {
//         const [checkSectionId] = key.split('_');
//         const numericCheckSectionId = Number(checkSectionId);
//         if (!Object.values(repeatedSections).flat().includes(numericCheckSectionId)) {
//           if (
//             key.endsWith(`_${condition.question}`) &&
//             radioValues[key] === condition.answer
//           ) {
//             conditionMet = true;
//             break;
//           }
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") return;
//         return;
//       }

//       for (const key in checkboxValues) {
//         const [checkSectionId] = key.split('_');
//         const numericCheckSectionId = Number(checkSectionId);
//         if (!Object.values(repeatedSections).flat().includes(numericCheckSectionId)) {
//           if (
//             key.endsWith(`_${condition.question}`) &&
//             checkboxValues[key]?.[condition.answer]
//           ) {
//             conditionMet = true;
//             break;
//           }
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") return;
//         return;
//       }

//       for (const key in selectedDropdownValues) {
//         const [checkSectionId] = key.split('_');
//         const numericCheckSectionId = Number(checkSectionId);
//         if (!Object.values(repeatedSections).flat().includes(numericCheckSectionId)) {
//           if (
//             key.endsWith(`_${condition.question}`) &&
//             selectedDropdownValues[key] === condition.answer
//           ) {
//             conditionMet = true;
//             break;
//           }
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") return;
//         return;
//       }

//       for (const key in selectedYesNoValues) {
//         const [checkSectionId] = key.split('_');
//         const numericCheckSectionId = Number(checkSectionId);
//         if (!Object.values(repeatedSections).flat().includes(numericCheckSectionId)) {
//           if (
//             key.endsWith(`_${condition.question}`) &&
//             selectedYesNoValues[key] === condition.answer
//           ) {
//             conditionMet = true;
//             break;
//           }
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") return;
//       }
//     });

//     if (mode === "Any") {
//       return matchedConditions > 0;
//     } else {
//       return matchedConditions === conditions.length;
//     }
//   };

//   const getVisibleSections = () => {
//     const visibleBaseSections = (sections || []).filter(shouldShowSection);
//     const allSections = [];

//     visibleBaseSections.forEach((section) => {
//       allSections.push(section);

//       if (section.sectionsettings?.sectionRepeatingMode && repeatedSections[section.id]) {
//         repeatedSections[section.id].forEach((repeatId, index) => {
//           allSections.push({
//             ...section,
//             id: repeatId.toString(),
//             text: `${section.text} (Repeated ${index + 1})`,
//             isRepeated: true,
//             originalSectionId: section.id
//           });
//         });
//       }
//     });

//     console.log("All sections in order:", allSections.map(s => ({ id: s.id, text: s.text, isRepeated: s.isRepeated })));
//     return allSections;
//   };

//   const visibleSections = getVisibleSections();
//   const totalSteps = visibleSections.length;

//   const shouldShowElement = (element, sectionId) => {
//     const settings = element.questionsectionsettings;
//     if (!settings?.conditional) return true;
    
//     const conditions = settings?.conditions || [];
//     const mode = settings?.mode || "All";

//     if (conditions.length === 0) return true;

//     let matchedConditions = 0;

//     for (const condition of conditions) {
//       const { question, answer } = condition;
//       if (!question || !answer) continue;

//       let conditionMet = false;

//       for (const key in radioValues) {
//         const [keySectionId] = key.split('_');
//         const numericKeySectionId = Number(keySectionId);
//         const numericCurrentSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
        
//         if (numericKeySectionId === numericCurrentSectionId && key.endsWith(`_${question}`) && radioValues[key] === answer) {
//           conditionMet = true;
//           break;
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") continue;
//         else continue;
//       }

//       for (const key in checkboxValues) {
//         const [keySectionId] = key.split('_');
//         const numericKeySectionId = Number(keySectionId);
//         const numericCurrentSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
        
//         if (numericKeySectionId === numericCurrentSectionId && key.endsWith(`_${question}`) && checkboxValues[key]?.[answer]) {
//           conditionMet = true;
//           break;
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") continue;
//         else continue;
//       }

//       for (const key in selectedDropdownValues) {
//         const [keySectionId] = key.split('_');
//         const numericKeySectionId = Number(keySectionId);
//         const numericCurrentSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
        
//         if (numericKeySectionId === numericCurrentSectionId && key.endsWith(`_${question}`) && selectedDropdownValues[key] === answer) {
//           conditionMet = true;
//           break;
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") continue;
//         else continue;
//       }

//       for (const key in selectedYesNoValues) {
//         const [keySectionId] = key.split('_');
//         const numericKeySectionId = Number(keySectionId);
//         const numericCurrentSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
        
//         if (numericKeySectionId === numericCurrentSectionId && key.endsWith(`_${question}`) && selectedYesNoValues[key] === answer) {
//           conditionMet = true;
//           break;
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") continue;
//         else continue;
//       }

//       if (mode === "All" && !conditionMet) {
//         return false;
//       }
//     }

//     if (mode === "Any") {
//       return matchedConditions > 0;
//     } else {
//       return matchedConditions === conditions.length;
//     }
//   };

//   const handleNext = () => {
//     if (activeStep < totalSteps - 1) {
//       setActiveStep((prevActiveStep) => prevActiveStep + 1);
//     }
//   };

//   const handleBack = () => {
//     if (activeStep > 0) {
//       setActiveStep((prevActiveStep) => prevActiveStep - 1);
//     }
//   };

//   const handleDropdownChange = (event) => {
//     const selectedIndex = event.target.value;
//     setActiveStep(selectedIndex);
//   };

//   const handleSubmit = async () => {
//     const errors = {};
    
//     visibleSections.forEach((section) => {
//       section.formElements.forEach((element) => {
//         if (shouldShowElement(element, section.id) && element.questionsectionsettings?.required) {
//           const key = `${section.id}_${element.text}`;
          
//           if (element.type === "File Upload") {
//             const fileInfo = uploadedFiles[key];
//             if (!fileInfo || fileInfo.status !== 'completed') {
//               if (!errors[section.id]) {
//                 errors[section.id] = {};
//               }
//               errors[section.id][element.text] = `Please upload the required file`;
//             }
//           } else {
//             const hasAnswer = answeredElements[key];
//             if (!hasAnswer) {
//               if (!errors[section.id]) {
//                 errors[section.id] = {};
//               }
//               errors[section.id][element.text] = `This question is required`;
//             }
//           }
//         }
//       });
//     });

//     setValidationErrors(errors);

//     if (Object.keys(errors).length > 0) {
//       const firstErrorSectionId = Object.keys(errors)[0];
//       const sectionIndex = visibleSections.findIndex(section => section.id === firstErrorSectionId);
//       if (sectionIndex !== -1) {
//         setActiveStep(sectionIndex);
//       }
      
//       toast.error("Please complete all required questions before submitting");
//       return;
//     }

//     try {
//       const myHeaders = new Headers();
//       myHeaders.append("Content-Type", "application/json");

//       const data = prepareSubmitData(true);
//       const isFinalSubmission = data.status === "Completed";
      
//       if (isFinalSubmission) {
//         data.issealed = true;
//       }

//       const endpoint =
//         data.status === "Completed"
//           ? `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/completeandnotify/${organizer._id}`
//           : `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/${organizer._id}`;
//       const requestOptions = {
//         method: "PATCH",
//         headers: myHeaders,
//         body: JSON.stringify(data),
//         redirect: "follow",
//       };

//       const response = await fetch(endpoint, requestOptions);
//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || "Failed to update organizer");
//       }

//       if (isFinalSubmission) {
//         toast.success("Organizer completed and sealed successfully!");
//         organizer.issealed = true;
//         handleClose();
//       } else {
//         toast.success("Organizer saved successfully");
//         handleClose();
//       }
//     } catch (error) {
//       console.error("Error submitting organizer:", error);
//       toast.error(
//         error.message || "Something went wrong while updating organizer!"
//       );
//     }
//   };

//   const getQuestionTextValue = (question, sectionId) => {
//     const numericSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
//     const key = `${numericSectionId}_${question.text}`;

//     switch (question.type) {
//       case "Free Entry":
//       case "Email":
//       case "Number":
//         return inputValues[key] || "";
//       case "Radio Buttons":
//         return radioValues[key] || "";
//       case "Checkboxes":
//         return checkboxValues[key]
//           ? Object.keys(checkboxValues[key])
//               .filter((k) => checkboxValues[key][k])
//               .join(", ")
//           : "";
//       case "Yes/No":
//         return selectedYesNoValues[key] || "";
//       case "Dropdown":
//         return selectedDropdownValues[key] || "";
//       case "Date":
//         return startDate?.toISOString() || "";
//       case "Text Editor":
//         return question.text || "";
//       case "File Upload":
//         const fileInfo = uploadedFiles[key];
//         return (fileInfo && fileInfo.status === 'completed') ? fileInfo.fileName : "";
//       default:
//         return "";
//     }
//   };

//   const getOptionSelectedState = (question, option, sectionId) => {
//     const numericSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
//     const key = `${numericSectionId}_${question.text}`;
//     switch (question.type) {
//       case "Radio Buttons":
//         return radioValues[key] === option.text;
//       case "Checkboxes":
//         return checkboxValues[key]?.[option.text] || false;
//       case "Yes/No":
//         return selectedYesNoValues[key] === option.text;
//       case "Dropdown":
//         return selectedDropdownValues[key] === option.text;
//       default:
//         return false;
//     }
//   };

//   useEffect(() => {
//     if (organizer?.sections) {
//       const newInputValues = {};
//       const newRadioValues = {};
//       const newCheckboxValues = {};
//       const newSelectedYesNoValues = {};
//       const newSelectedDropdownValues = {};
//       const newAnsweredElements = {};
//       const newUploadedFiles = {};
//       const newRepeatedSections = {};
//       let initialDate = dayjs();

//       organizer.sections.forEach((section) => {
//         const sectionId = section.id;

//         if (section.sectionsettings?.isRepeated && section.sectionsettings?.originalSectionId) {
//           const originalSectionId = section.sectionsettings.originalSectionId;
//           if (!newRepeatedSections[originalSectionId]) {
//             newRepeatedSections[originalSectionId] = [];
//           }
//           newRepeatedSections[originalSectionId].push(Number(sectionId));
//         }

//         section.formElements.forEach((element) => {
//           const numericSectionId = Number(sectionId);
//           const key = `${numericSectionId}_${element.text}`;

//           if (element.textvalue) {
//             newAnsweredElements[key] = true;

//             switch (element.type) {
//               case "Free Entry":
//               case "Email":
//               case "Number":
//                 newInputValues[key] = element.textvalue;
//                 break;
//               case "Radio Buttons":
//                 newRadioValues[key] = element.textvalue;
//                 break;
//               case "Checkboxes":
//                 const selectedOptions = element.textvalue
//                   .split(",")
//                   .map((s) => s.trim());
//                 newCheckboxValues[key] = {};
//                 element.options.forEach((option) => {
//                   newCheckboxValues[key][option.text] =
//                     selectedOptions.includes(option.text);
//                 });
//                 break;
//               case "Yes/No":
//                 newSelectedYesNoValues[key] = element.textvalue;
//                 break;
//               case "Dropdown":
//                 newSelectedDropdownValues[key] = element.textvalue;
//                 break;
//               case "Date":
//                 initialDate = dayjs(element.textvalue);
//                 break;
//               case "File Upload":
//                 if (element.fileMetadata && element.fileMetadata.fileName) {
//                   newUploadedFiles[key] = {
//                     fileName: element.fileMetadata.fileName,
//                     filePath: element.fileMetadata.filePath,
//                     uploadDate: element.fileMetadata.uploadDate,
//                     uploadedBy: element.fileMetadata.uploadedBy,
//                     status: 'completed'
//                   };
//                 } else if (element.textvalue) {
//                   newUploadedFiles[key] = {
//                     fileName: element.textvalue,
//                     status: 'completed'
//                   };
//                 }
//                 break;
//             }
//           }
//         });
//       });

//       // Clear any file data that's not completed
//       Object.keys(newUploadedFiles).forEach(key => {
//         if (newUploadedFiles[key]?.status !== 'completed') {
//           delete newUploadedFiles[key];
//         }
//       });

//       setInputValues(newInputValues);
//       setRadioValues(newRadioValues);
//       setCheckboxValues(newCheckboxValues);
//       setSelectedYesNoValues(newSelectedYesNoValues);
//       setSelectedDropdownValues(newSelectedDropdownValues);
//       setAnsweredElements(newAnsweredElements);
//       setStartDate(initialDate);
//       setUploadedFiles(newUploadedFiles);
//       setRepeatedSections(newRepeatedSections);
//     }
//   }, [organizer]);

//   const isElementActive = (element) => {
//     if (organizer?.issealed) return true;
//     return element.active === true;
//   };

//   const hasError = (sectionId, elementText) => {
//     return !!validationErrors[sectionId]?.[elementText];
//   };

//   const getErrorMessage = (sectionId, elementText) => {
//     return validationErrors[sectionId]?.[elementText] || '';
//   };

//   const renderSection = (section, isRepeated = false, originalSectionId = null) => {
//     const sectionId = section.id;
//     const canRepeat = section.sectionsettings?.sectionRepeatingMode && !isRepeated;

//     return (
//       <Box key={sectionId}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//           <Typography variant="h6" component="h2">
//             {section.text}
//           </Typography>
//           {isRepeated && (
//             <Button 
//               variant="outlined" 
//               color="error" 
//               size="small"
//               onClick={() => removeRepeatedSection(originalSectionId, Number(sectionId))}
//               disabled={organizer?.issealed}
//             >
//               Remove Section
//             </Button>
//           )}
//         </Box>

//         {section.formElements.map(
//           (element) =>
//             shouldShowElement(element, sectionId) && (
//               <Box key={`${sectionId}_${element.id}`}>
//                 {element.type === "Text Editor" && (
//                   <Box mt={2} mb={2}>
//                     <Typography>
//                       <span
//                         dangerouslySetInnerHTML={{
//                           __html: element.text,
//                         }}
//                       />
//                     </Typography>
//                   </Box>
//                 )}

//                 {(element.type === "Free Entry" || element.type === "Email") && (
//                   <Box mt={2}>
//                     <Typography
//                       variant="subtitle2"
//                       component="p"
//                       gutterBottom
//                       sx={{ fontWeight: "550" }}
//                     >
//                       {element.text}
//                       {element.questionsectionsettings?.required && (
//                         <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
//                       )}
//                     </Typography>
//                     <TextField
//                       disabled={isElementActive(element)}
//                       variant="filled"
//                       size="small"
//                       multiline
//                       fullWidth
//                       placeholder={`${element.type} Answer`}
//                       inputProps={{
//                         type:
//                           element.type === "Free Entry"
//                             ? "text"
//                             : element.type.toLowerCase(),
//                       }}
//                       style={{ display: "block" }}
//                       value={
//                         inputValues[
//                           `${sectionId}_${element.text}`
//                         ] || ""
//                       }
//                       onChange={(e) =>
//                         handleInputChange(
//                           e,
//                           element.text,
//                           sectionId
//                         )
//                       }
//                       error={hasError(sectionId, element.text)}
//                     />
//                     {hasError(sectionId, element.text) && (
//                       <Typography 
//                         variant="caption" 
//                         color="error" 
//                         sx={{ display: 'block', mt: 0.5, ml: 1 }}
//                       >
//                         {getErrorMessage(sectionId, element.text)}
//                       </Typography>
//                     )}
//                   </Box>
//                 )}

//                 {element.type === "Number" && (
//                   <Box mt={2}>
//                     <Typography
//                       variant="subtitle2"
//                       component="p"
//                       gutterBottom
//                       sx={{ fontWeight: "550" }}
//                     >
//                       {element.text}
//                       {element.questionsectionsettings?.required && (
//                         <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
//                       )}
//                     </Typography>
//                     <TextField
//                       disabled={isElementActive(element)}
//                       variant="outlined"
//                       size="small"
//                       multiline
//                       fullWidth
//                       placeholder={`${element.type} Answer`}
//                       inputProps={{
//                         type: "text",
//                         inputMode: "numeric",
//                         pattern: "[0-9]*",
//                       }}
//                       maxRows={8}
//                       style={{
//                         display: "block",
//                         marginTop: "15px",
//                       }}
//                       value={
//                         inputValues[
//                           `${sectionId}_${element.text}`
//                         ] || ""
//                       }
//                       onChange={(e) => {
//                         const numericValue =
//                           e.target.value.replace(/\D/g, "");
//                         handleInputChange(
//                           { target: { value: numericValue } },
//                           element.text,
//                           sectionId
//                         );
//                       }}
//                       error={hasError(sectionId, element.text)}
//                     />
//                     {hasError(sectionId, element.text) && (
//                       <Typography 
//                         variant="caption" 
//                         color="error" 
//                         sx={{ display: 'block', mt: 0.5, ml: 1 }}
//                       >
//                         {getErrorMessage(sectionId, element.text)}
//                       </Typography>
//                     )}
//                   </Box>
//                 )}

//                 {element.type === "Radio Buttons" && (
//                   <Box mt={2}>
//                     <Typography
//                       variant="subtitle2"
//                       component="p"
//                       gutterBottom
//                       sx={{ fontWeight: "550" }}
//                     >
//                       {element.text}
//                       {element.questionsectionsettings?.required && (
//                         <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
//                       )}
//                     </Typography>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         gap: 1,
//                         flexWrap: "wrap",
//                       }}
//                     >
//                       {element.options.map((option) => (
//                         <SelectableButton
//                           key={option.text}
//                           selected={
//                             radioValues[
//                               `${sectionId}_${element.text}`
//                             ] === option.text
//                           }
//                           disabled={isElementActive(element)}
//                           onClick={() =>
//                             handleRadioChange(
//                               option.text,
//                               element.text,
//                               sectionId
//                             )
//                           }
//                         >
//                           {option.text}
//                         </SelectableButton>
//                       ))}
//                     </Box>
//                     {hasError(sectionId, element.text) && (
//                       <Typography 
//                         variant="caption" 
//                         color="error" 
//                         sx={{ display: 'block', mt: 0.5, ml: 1 }}
//                       >
//                         {getErrorMessage(sectionId, element.text)}
//                       </Typography>
//                     )}
//                   </Box>
//                 )}

//                 {element.type === "Checkboxes" && (
//                   <Box mt={2}>
//                     <Typography
//                       variant="subtitle2"
//                       component="p"
//                       gutterBottom
//                       sx={{ fontWeight: "550" }}
//                     >
//                       {element.text}
//                       {element.questionsectionsettings?.required && (
//                         <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
//                       )}
//                     </Typography>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         gap: 1,
//                         flexWrap: "wrap",
//                       }}
//                     >
//                       {element.options.map((option) => (
//                         <SelectableButton
//                           key={option.text}
//                           selected={
//                             checkboxValues[
//                               `${sectionId}_${element.text}`
//                             ]?.[option.text]
//                           }
//                           disabled={isElementActive(element)}
//                           onClick={() =>
//                             handleCheckboxChange(
//                               option.text,
//                               element.text,
//                               sectionId
//                             )
//                           }
//                         >
//                           {option.text}
//                         </SelectableButton>
//                       ))}
//                     </Box>
//                     {hasError(sectionId, element.text) && (
//                       <Typography 
//                         variant="caption" 
//                         color="error" 
//                         sx={{ display: 'block', mt: 0.5, ml: 1 }}
//                       >
//                         {getErrorMessage(sectionId, element.text)}
//                       </Typography>
//                     )}
//                   </Box>
//                 )}

//                 {element.type === "Yes/No" && (
//                   <Box mt={2}>
//                     <Typography
//                       variant="subtitle2"
//                       component="p"
//                       gutterBottom
//                       sx={{ fontWeight: "550" }}
//                     >
//                       {element.text}
//                       {element.questionsectionsettings?.required && (
//                         <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
//                       )}
//                     </Typography>
//                     <Box sx={{ display: "flex", gap: 1 }}>
//                       {element.options.map((option) => (
//                         <SelectableButton
//                           key={option.text}
//                           selected={
//                             selectedYesNoValues[
//                               `${sectionId}_${element.text}`
//                             ] === option.text
//                           }
//                           disabled={isElementActive(element)}
//                           onClick={() =>
//                             handleYesNoChange(
//                               option.text,
//                               element.text,
//                               sectionId
//                             )
//                           }
//                         >
//                           {option.text}
//                         </SelectableButton>
//                       ))}
//                     </Box>
//                     {hasError(sectionId, element.text) && (
//                       <Typography 
//                         variant="caption" 
//                         color="error" 
//                         sx={{ display: 'block', mt: 0.5, ml: 1 }}
//                       >
//                         {getErrorMessage(sectionId, element.text)}
//                       </Typography>
//                     )}
//                   </Box>
//                 )}

//                 {element.type === "Dropdown" && (
//                   <Box mt={2}>
//                     <Typography
//                       variant="subtitle2"
//                       component="p"
//                       gutterBottom
//                       sx={{ fontWeight: "550" }}
//                     >
//                       {element.text}
//                       {element.questionsectionsettings?.required && (
//                         <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
//                       )}
//                     </Typography>
//                     <FormControl fullWidth>
//                       <Select
//                         value={
//                           selectedDropdownValues[
//                             `${sectionId}_${element.text}`
//                           ] || ""
//                         }
//                         disabled={isElementActive(element)}
//                         onChange={(event) =>
//                           handleDropdownValueChange(
//                             event,
//                             element.text,
//                             sectionId
//                           )
//                         }
//                         size="small"
//                       >
//                         {element.options.map((option) => (
//                           <MenuItem
//                             key={option.text}
//                             value={option.text}
//                           >
//                             {option.text}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                     {hasError(sectionId, element.text) && (
//                       <Typography 
//                         variant="caption" 
//                         color="error" 
//                         sx={{ display: 'block', mt: 0.5, ml: 1 }}
//                       >
//                         {getErrorMessage(sectionId, element.text)}
//                       </Typography>
//                     )}
//                   </Box>
//                 )}

//                 {element.type === "Date" && (
//                   <Box mt={2}>
//                     <Typography
//                       variant="subtitle2"
//                       component="p"
//                       gutterBottom
//                       sx={{ fontWeight: "550" }}
//                     >
//                       {element.text}
//                       {element.questionsectionsettings?.required && (
//                         <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
//                       )}
//                     </Typography>
//                     <DatePicker
//                       format="DD/MM/YYYY"
//                       sx={{
//                         width: "100%",
//                         backgroundColor: "#fff",
//                       }}
//                       value={startDate}
//                       disabled={isElementActive(element)}
//                       onChange={(newValue) => {
//                         if (!isElementActive(element)) {
//                           setStartDate(newValue);
//                           setAnsweredElements((prev) => ({
//                             ...prev,
//                             [`${sectionId}_${element.text}`]: true,
//                           }));
//                           if (validationErrors[sectionId]?.[element.text]) {
//                             setValidationErrors(prev => {
//                               const newErrors = { ...prev };
//                               if (newErrors[sectionId]) {
//                                 delete newErrors[sectionId][element.text];
//                                 if (Object.keys(newErrors[sectionId]).length === 0) {
//                                   delete newErrors[sectionId];
//                                 }
//                               }
//                               return newErrors;
//                             });
//                           }
//                         }
//                       }}
//                       renderInput={(params) => (
//                         <TextField {...params} size="small" />
//                       )}
//                     />
//                     {hasError(sectionId, element.text) && (
//                       <Typography 
//                         variant="caption" 
//                         color="error" 
//                         sx={{ display: 'block', mt: 0.5, ml: 1 }}
//                       >
//                         {getErrorMessage(sectionId, element.text)}
//                       </Typography>
//                     )}
//                   </Box>
//                 )}

//                 {element.type === "File Upload" && (
//                   <Box mt={2}>
//                     <Typography
//                       variant="subtitle2"
//                       component="p"
//                       gutterBottom
//                       sx={{ fontWeight: "550" }}
//                     >
//                       {element.text}
//                       {element.questionsectionsettings?.required && (
//                         <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
//                       )}
//                     </Typography>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 1,
//                       }}
//                     >
//                       <Button
//                         variant="outlined"
//                         component="label"
//                         disabled={
//                           isElementActive(element) || 
//                           uploadedFiles[`${sectionId}_${element.text}`]?.status === 'completed'
//                         }
//                       >
//                         Choose File
//                         <Input
//                           type="file"
//                           onChange={(e) => {
//                             const selectedFile = e.target.files[0];
//                             if (selectedFile) {
//                               setFile(selectedFile);
//                               setIsDocumentForm(true);
//                               const key = `${sectionId}_${element.text}`;
                              
//                               // Store in pendingFiles instead of uploadedFiles
//                               setPendingFiles((prev) => ({
//                                 ...prev,
//                                 [key]: {
//                                   fileName: selectedFile.name,
//                                   file: selectedFile,
//                                 },
//                               }));
//                             }
//                           }}
//                           sx={{ display: "none" }}
//                           disabled={
//                             isElementActive(element) || 
//                             uploadedFiles[`${sectionId}_${element.text}`]?.status === 'completed'
//                           }
//                         />
//                       </Button>
                      
//                       {pendingFiles[`${sectionId}_${element.text}`] && (
//                         <Typography variant="body2">
//                           {pendingFiles[`${sectionId}_${element.text}`].fileName}
//                           {" (Ready to upload)"}
//                         </Typography>
//                       )}
//                       {uploadedFiles[`${sectionId}_${element.text}`] && (
//                         <Typography variant="body2">
//                           {uploadedFiles[`${sectionId}_${element.text}`].fileName}
//                         </Typography>
//                       )}
//                     </Box>
//                     {hasError(sectionId, element.text) && (
//                       <Typography 
//                         variant="caption" 
//                         color="error" 
//                         sx={{ display: 'block', mt: 0.5, ml: 1 }}
//                       >
//                         {getErrorMessage(sectionId, element.text)}
//                       </Typography>
//                     )}
                    
//                     {pendingFiles[`${sectionId}_${element.text}`] && (
//                       <Typography variant="caption" color="warning.main">
//                         ⚠ File selected but not uploaded yet
//                       </Typography>
//                     )}
//                     {uploadedFiles[`${sectionId}_${element.text}`]?.status === 'uploading' && (
//                       <Typography variant="caption" color="primary">
//                         Uploading...
//                       </Typography>
//                     )}
//                     {uploadedFiles[`${sectionId}_${element.text}`]?.status === 'completed' && (
//                       <Typography variant="caption" color="success.main">
//                         ✓ Uploaded successfully
//                       </Typography>
//                     )}
//                   </Box>
//                 )}
//               </Box>
//             )
//         )}

//         {canRepeat && (
//           <Box mt={3} mb={2}>
//             <Button 
//               variant="outlined" 
//               onClick={() => addRepeatedSection(sectionId)}
//               disabled={organizer?.issealed}
//               startIcon={<AddIcon />}
//             >
//               Add Another {section.text}
//             </Button>
//           </Box>
//         )}
//       </Box>
//     );
//   };

//   return (
//     <>
//       <LocalizationProvider dateAdapter={AdapterDayjs}>
//         <Dialog fullScreen open={open} onClose={handleClose}>
//           <DialogTitle
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               px: 3,
//               py: 2,
//               borderBottom: "1px solid #ddd",
//             }}
//           >
//             <Typography variant="h6" component="p">
//               {organizer?.organizerName || "Organizer"}
//             </Typography>
//             <IconButton edge="end" onClick={handleClose}>
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>
//           <DialogContent>
//             <FormControl
//               fullWidth
//               sx={{ marginBottom: "10px", marginTop: "10px" }}
//             >
//               <Select
//                 value={activeStep}
//                 onChange={handleDropdownChange}
//                 size="small"
//               >
//                 {visibleSections.map((section, index) => {
//                   const visibleElements = section.formElements.filter((el) =>
//                     shouldShowElement(el, section.id)
//                   );

//                   const answeredCount = visibleElements.reduce(
//                     (count, element) => {
//                       const key = `${section.id}_${element.text}`;
//                       return count + (answeredElements[key] ? 1 : 0);
//                     },
//                     0
//                   );

//                   const totalVisibleElements = visibleElements.length;

//                   return (
//                     <MenuItem key={section.id} value={index}>
//                       {section.text} ({answeredCount}/{totalVisibleElements})
//                     </MenuItem>
//                   );
//                 })}
//               </Select>
//             </FormControl>
//             <Box mt={2} mb={2}>
//               <LinearProgress
//                 variant="determinate"
//                 value={((activeStep + 1) / totalSteps) * 100}
//               />
//             </Box>

//             <Box sx={{ pl: 20, pr: 20 }}>
//               {visibleSections.map(
//                 (section, sectionIndex) =>
//                   sectionIndex === activeStep && (
//                     renderSection(
//                       section, 
//                       section.isRepeated, 
//                       section.originalSectionId
//                     )
//                   )
//               )}

//               <Box
//                 mt={3}
//                 display="flex"
//                 alignItems="center"
//                 justifyContent={"space-between"}
//               >
//                 <Box display="flex" gap={3} alignItems="center">
//                   {activeStep > 0 && (
//                     <Button onClick={handleBack} variant="outlined">
//                       <ArrowBackIcon fontSize="small" />
//                     </Button>
//                   )}

//                   {activeStep < totalSteps - 1 ? (
//                     <Button onClick={handleNext} color="primary"  sx={{
//                       backgroundColor: 'text.menu',
//                       color: 'primary.contrastText',
//                       '&:hover': {
//                         backgroundColor: 'menu.dark',
//                         boxShadow: 1,
//                       },
//                       transition: 'background-color 0.2s ease'
//                     }}>
//                       Next{" "}
//                       <ArrowForwardIcon
//                         fontSize="small"
//                         sx={{ marginLeft: 2 }}
//                       />
//                     </Button>
//                   ) : (
//                     <Button  onClick={handleSubmit} color="primary"  sx={{
//                       backgroundColor: 'text.menu',
//                       color: 'primary.contrastText',
//                       '&:hover': {
//                         backgroundColor: 'menu.dark',
//                         boxShadow: 1,
//                       },
//                       transition: 'background-color 0.2s ease'
//                     }}>
//                       Submit
//                     </Button>
//                   )}
//                 </Box>

//                 <Box sx={{ display: "flex", alignItems: "flex-end" }}>
//                   <Typography>
//                     Step {activeStep + 1} of {totalSteps}
//                   </Typography>
//                 </Box>
//               </Box>
//             </Box>
//           </DialogContent>
//         </Dialog>
//       </LocalizationProvider>

//       <FileUploadDrawer
//         isOpen={isDocumentForm}
//         organizer={organizer}
//         onClose={() => {
//           // If drawer is closed without uploading, remove the pending file
//           if (file) {
//             const key = Object.keys(pendingFiles).find(
//               (k) => pendingFiles[k]?.file === file
//             );
//             if (key) {
//               setPendingFiles((prev) => {
//                 const newState = { ...prev };
//                 delete newState[key];
//                 return newState;
//               });
//             }
//             setFile(null);
//           }
//           setIsDocumentForm(false);
//         }}
//         file={file}
//         accountId={accountId}
//         folderTree={folderTree}
//         onUploadSuccess={(fileData) => {
//           console.log("File uploaded successfully:", fileData);
          
//           // Find the key for the current file being uploaded
//           const key = Object.keys(pendingFiles).find(
//             (k) => pendingFiles[k]?.file === file
//           );

//           if (key) {
//             // Move from pendingFiles to uploadedFiles with completed status
//             setUploadedFiles((prev) => ({
//               ...prev,
//               [key]: {
//                 fileName: fileData.fileName,
//                 filePath: fileData.filePath,
//                 uploadDate: new Date().toISOString(),
//                 uploadedBy: accountName || username,
//                 status: 'completed'
//               },
//             }));

//             // Remove from pending files
//             setPendingFiles((prev) => {
//               const newState = { ...prev };
//               delete newState[key];
//               return newState;
//             });

//             // Mark as answered ONLY after successful upload
//             setAnsweredElements((prev) => ({
//               ...prev,
//               [key]: true,
//             }));

//             // Clear validation error for this field
//             const [sectionId, elementText] = key.split('_');
//             const numericSectionId = Number(sectionId);
//             if (validationErrors[numericSectionId]?.[elementText]) {
//               setValidationErrors(prev => {
//                 const newErrors = { ...prev };
//                 if (newErrors[numericSectionId]) {
//                   delete newErrors[numericSectionId][elementText];
//                   if (Object.keys(newErrors[numericSectionId]).length === 0) {
//                     delete newErrors[numericSectionId];
//                   }
//                 }
//                 return newErrors;
//               });
//             }

//             // Trigger auto-save with the updated file metadata
//             const data = prepareSubmitData(false);
//             debouncedAutoSave(data);
            
//             toast.success("File uploaded successfully!");
//           }

//           setIsDocumentForm(false);
//           setFile(null);
//         }}
//         onUploadError={(error) => {
//           console.error("File upload failed:", error);
//           const key = Object.keys(pendingFiles).find(
//             (k) => pendingFiles[k]?.file === file
//           );
//           if (key) {
//             // Remove the file from pending files if upload fails
//             setPendingFiles((prev) => {
//               const newState = { ...prev };
//               delete newState[key];
//               return newState;
//             });
//           }
//           setFile(null);
//           toast.error("File upload failed!");
//         }}
//       />
//     </>
//   );
// };

// export default OrganizerDialog;