
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
  Button,  Input,
} from "@mui/material";
import { LinearProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect, useCallback ,useContext} from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "material-react-toastify";
import dayjs from "dayjs";
import { debounce } from "lodash";
import UploadDrawer from "./UploadDrawer";
import { LoginContext } from "../../context/Context";
import SelectableButton from "./SelectableButton";
const OrganizerDialog = ({ open, handleClose, organizer }) => {
  console.log("organizer",organizer)
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
      console.log("loginuserid",loginuserid)
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
        // console.log("id", result);

        setUsername(result.username);
      });
  };
 const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
 const [accountId,setAccountId]=useState("")
  const fetchAccountByUser =  async (id)=>{
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
        // console.log("accountid", result);
setAccountId(result.accounts[0]._id)
        // console.log("userData",result.accounts[0]._id)
        // setUsername(result.username);
      });
  }
 const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  // const ORGANIZER_AUTOSAVE_API = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/autosave`;
  const sections = organizer?.sections;

  const [selectedDropdownValues, setSelectedDropdownValues] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [selectedYesNoValues, setSelectedYesNoValues] = useState({});
  const [radioValues, setRadioValues] = useState({});
  const [checkboxValues, setCheckboxValues] = useState({});
  const [answeredElements, setAnsweredElements] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [startDate, setStartDate] = useState(dayjs());
const [uploadedFiles, setUploadedFiles] = useState({}); // Stores file names for each file upload question
 const [file, setFile] = useState(null);
  const [isDocumentForm, setIsDocumentForm] = useState(false);
  // Create a debounced auto-save function
  const debouncedAutoSave = useCallback(
    debounce(async (data) => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify(data);
console.log("autosave raw",raw)
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
        // toast.success("Auto-save successful")
      } catch (error) {
        console.error("Error auto-saving organizer:", error);
      }
    }, 2000), // 2 second debounce delay
    [organizer?._id]
  );

  // Function to prepare data for submission (used by both auto-save and submit)
  const prepareSubmitData = (finalSubmit = false) => {
    return {
      sections: organizer?.sections?.map((section) => ({
        name: section?.text || "",
        id: section?.id?.toString() || "",
        text: section?.text || "",
        sectionsettings: section?.sectionsettings ,
        formElements:
          section?.formElements?.map((question) => ({
            type: question?.type || "",
            id: question?.id || "",
            sectionid: section?.id || "",
            options:
              question?.options?.map((option) => ({
                id: option?.id || "",
                text: option?.text || "",
                selected: getOptionSelectedState(
                  question,
                  option,
                  section.id
                ),
              })) || [],
            text: question?.text || "",
            textvalue: getQuestionTextValue(question, section.id),
            questionsectionsettings: question?.questionsectionsettings , 
          //    ...(question.type === "File Upload" && {
          //   fileMetadata: {
          //     fileName: uploadedFiles[`${section.id}_${question.text}`] || "",
          //     // Add other metadata like upload date, size, etc.
          //   }
          // })
          ...(question.type === "File Upload" && {
            fileMetadata: uploadedFiles[`${section.id}_${question.text}`]?.map(file => ({
              fileName: file.serverData?.fileName || file.name,
              filePath: file.serverData?.filePath || "",
              uploadedAt: file.serverData?.uploadedAt || new Date().toISOString(),
              fileSize: file.size,
              fileType: file.type,
              originalName: file.name
            })) || []
          })
          })) || [],
      })) || [],
      status: finalSubmit ? "Completed" : "In Progress",
       completedby:loginuserid,
      active: true,
     
    };
  };

  // Auto-save whenever relevant state changes
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
    debouncedAutoSave,
  ]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedAutoSave.cancel();
    };
  }, [debouncedAutoSave]);

  const handleRadioChange = (value, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    setRadioValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };

  const handleCheckboxChange = (value, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
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
  };

  const handleYesNoChange = (value, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    setSelectedYesNoValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };

  const handleInputChange = (event, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    const { value } = event.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };

  const handleDropdownValueChange = (event, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    setSelectedDropdownValues((prevValues) => ({
      ...prevValues,
      [key]: event.target.value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };

  const shouldShowSection = (section) => {
    if (!section.sectionsettings?.conditional) return true;
    const conditions = section.sectionsettings.conditions || [];

    return conditions.every((condition) => {
      if (!condition.question || !condition.answer) return false;

      for (const key in radioValues) {
        if (
          key.endsWith(`_${condition.question}`) &&
          radioValues[key] === condition.answer
        ) {
          return true;
        }
      }

      for (const key in checkboxValues) {
        if (
          key.endsWith(`_${condition.question}`) &&
          checkboxValues[key]?.[condition.answer]
        ) {
          return true;
        }
      }

      for (const key in selectedDropdownValues) {
        if (
          key.endsWith(`_${condition.question}`) &&
          selectedDropdownValues[key] === condition.answer
        ) {
          return true;
        }
      }

      for (const key in selectedYesNoValues) {
        if (
          key.endsWith(`_${condition.question}`) &&
          selectedYesNoValues[key] === condition.answer
        ) {
          return true;
        }
      }
      return false;
    });
  };

  const getVisibleSections = () => (sections || []).filter(shouldShowSection);

  const visibleSections = getVisibleSections();
  const totalSteps = visibleSections.length;

  const shouldShowElement = (element, sectionId) => {
    const settings = element.questionsectionsettings;
    if (!settings?.conditional) return true;
    const conditions = settings?.conditions || [];

    for (const condition of conditions) {
      const { question, answer } = condition;
      if (!question || !answer) continue;

      let conditionMet = false;

      for (const key in radioValues) {
        if (key.endsWith(`_${question}`) && radioValues[key] === answer) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) continue;

      for (const key in checkboxValues) {
        if (key.endsWith(`_${question}`) && checkboxValues[key]?.[answer]) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) continue;

      for (const key in selectedDropdownValues) {
        if (
          key.endsWith(`_${question}`) &&
          selectedDropdownValues[key] === answer
        ) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) continue;

      for (const key in selectedYesNoValues) {
        if (
          key.endsWith(`_${question}`) &&
          selectedYesNoValues[key] === answer
        ) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) continue;

      return false;
    }

    return true;
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
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const data = prepareSubmitData(true); // true for final submission
 const endpoint = data.status === "Completed" 
      ? `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/completeandnotify/${organizer._id}`
      : `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/${organizer._id}`;
      const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: JSON.stringify(data),
        redirect: "follow",
      };

      // const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/${organizer._id}`;

      // const response = await fetch(url, requestOptions);
        const response = await fetch(endpoint, requestOptions);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update organizer");
      }

      toast.success("Organizer updated successfully");
      handleClose();
    } catch (error) {
      console.error("Error submitting organizer:", error);
      toast.error(
        error.message || "Something went wrong while updating organizer!"
      );
    }
  };

  const getQuestionTextValue = (question, sectionId) => {
    const key = `${sectionId}_${question.text}`;

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
      //    case "File Upload":
      // return uploadedFiles[key] || ""; // Store file name in textvalue
      // default:
      //   return "";
       case "File Upload":
      // For file uploads, return a comma-separated list of file names
      return uploadedFiles[key] 
        ? uploadedFiles[key].map(file => file.name).join(", ") 
        : "";
    default:
      return "";
    }
  };

  const getOptionSelectedState = (question, option, sectionId) => {
    const key = `${sectionId}_${question.text}`;
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
      let initialDate = dayjs();

      organizer.sections.forEach((section) => {
        section.formElements.forEach((element) => {
          const key = `${section.id}_${element.text}`;

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
              // If there's a textvalue, assume it's a file name
              if (element.textvalue) {
                newUploadedFiles[key] = element.textvalue;
              }
              break;
            }
          }
        });
      });

      setInputValues(newInputValues);
      setRadioValues(newRadioValues);
      setCheckboxValues(newCheckboxValues);
      setSelectedYesNoValues(newSelectedYesNoValues);
      setSelectedDropdownValues(newSelectedDropdownValues);
      setAnsweredElements(newAnsweredElements);
      setStartDate(initialDate);
        setUploadedFiles(newUploadedFiles);
        console.log("newUploadedFiles",newUploadedFiles)
    }
  }, [organizer]);

  const isElementActive = (element) => {
    if (organizer?.issealed) return true;
    return element.active === true;
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
                  <Box key={section.id}>
                    {section.formElements.map(
                      (element) =>
                        shouldShowElement(element, section.id) && (
                          <Box key={`${section.id}_${element.id}`}>
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

                            {(element.type === "Free Entry" ||
                              element.type === "Email") && (
                              <Box mt={2}>
                                <Typography
                                  variant="subtitle2"
                                  component="p"
                                  gutterBottom
                                  sx={{ fontWeight: "550" }}
                                >
                                  {element.text}
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
                                  // maxRows={8}
                                  style={{ display: "block" }}
                                  value={
                                    inputValues[
                                      `${section.id}_${element.text}`
                                    ] || ""
                                  }
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      element.text,
                                      section.id
                                    )
                                  }
                                />
                                



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
                                      `${section.id}_${element.text}`
                                    ] || ""
                                  }
                                  onChange={(e) => {
                                    const numericValue = e.target.value.replace(
                                      /\D/g,
                                      ""
                                    );
                                    handleInputChange(
                                      { target: { value: numericValue } },
                                      element.text,
                                      section.id
                                    );
                                  }}
                                />
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
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 1,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  {element.options.map((option) => (
                                    // <Button
                                    //   key={option.text}
                                    //   variant={
                                    //     radioValues[
                                    //       `${section.id}_${element.text}`
                                    //     ] === option.text
                                    //       ? "contained"
                                    //       : "outlined"
                                    //   }
                                    //   disabled={isElementActive(element)}
                                    //   onClick={() =>
                                    //     !isElementActive(element) &&
                                    //     handleRadioChange(
                                    //       option.text,
                                    //       element.text,
                                    //       section.id
                                    //     )
                                    //   }
                                    //   sx={{
                                    //     borderRadius: "15px",
                                    //   }}
                                    // >
                                    //   {option.text}
                                    // </Button>
                                    <SelectableButton
  key={option.text}
  selected={radioValues[`${section.id}_${element.text}`] === option.text}
  disabled={isElementActive(element)}
  onClick={() =>
    handleRadioChange(option.text, element.text, section.id)
  }
>
  {option.text}
</SelectableButton>

                                  ))}
                                </Box>
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
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 1,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  {element.options.map((option) => (
                                    // <Button
                                    //   key={option.text}
                                    //   variant={
                                    //     checkboxValues[
                                    //       `${section.id}_${element.text}`
                                    //     ]?.[option.text]
                                    //       ? "contained"
                                    //       : "outlined"
                                    //   }
                                    //   disabled={isElementActive(element)}
                                    //   onClick={() =>
                                    //     !isElementActive(element) &&
                                    //     handleCheckboxChange(
                                    //       option.text,
                                    //       element.text,
                                    //       section.id
                                    //     )
                                    //   }
                                    //   sx={{
                                    //     borderRadius: "15px",
                                    //   }}
                                    // >
                                    //   {option.text}
                                    // </Button>
                                    <SelectableButton
  key={option.text}
  selected={checkboxValues[`${section.id}_${element.text}`]?.[option.text]}
  disabled={isElementActive(element)}
  onClick={() =>
    handleCheckboxChange(option.text, element.text, section.id)
  }
>
  {option.text}
</SelectableButton>

                                  ))}
                                </Box>
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
                                </Typography>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                  {element.options.map((option) => (
                                    // <Button
                                    //   key={option.text}
                                    //   variant={
                                    //     selectedYesNoValues[
                                    //       `${section.id}_${element.text}`
                                    //     ] === option.text
                                    //       ? "contained"
                                    //       : "outlined"
                                    //   }
                                    //   disabled={isElementActive(element)}
                                    //   onClick={() =>
                                    //     !isElementActive(element) &&
                                    //     handleYesNoChange(
                                    //       option.text,
                                    //       element.text,
                                    //       section.id
                                    //     )
                                    //   }
                                    //   sx={{
                                    //     borderRadius: "15px",
                                    //   }}
                                    // >
                                    //   {option.text}
                                    // </Button>
                                    <SelectableButton
  key={option.text}
  selected={selectedYesNoValues[`${section.id}_${element.text}`] === option.text}
  disabled={isElementActive(element)}
  onClick={() =>
    handleYesNoChange(option.text, element.text, section.id)
  }
>
  {option.text}
</SelectableButton>

                                  ))}
                                </Box>
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
                                </Typography>
                                <FormControl fullWidth>
                                  <Select
                                    value={
                                      selectedDropdownValues[
                                        `${section.id}_${element.text}`
                                      ] || ""
                                    }
                                    disabled={isElementActive(element)}
                                    onChange={(event) =>
                                      handleDropdownValueChange(
                                        event,
                                        element.text,
                                        section.id
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
                                        [`${section.id}_${element.text}`]: true,
                                      }));
                                    }
                                  }}
                                  renderInput={(params) => (
                                    <TextField {...params} size="small" />
                                  )}
                                />
                              </Box>
                            )}

                           
{/* {element.type === "File Upload" && (
  <Box mt={2}>
    <Typography
      variant="subtitle2"
      component="p"
      gutterBottom
      sx={{ fontWeight: "550" }}
    >
      {element.text}
    </Typography>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
     
      <Typography
        variant="body1"
        component="label"
        htmlFor={`fileInput_${section.id}_${element.id}`}
        sx={{ cursor: isElementActive(element) ? 'default' : 'pointer', }}
      >
        Upload Document
      </Typography>
      <Input
        type="file"
        id={`fileInput_${section.id}_${element.id}`}
        onChange={(e) => {
          const selectedFile = e.target.files[0];
          if (selectedFile) {
            setFile(selectedFile);
            setIsDocumentForm(true);
            // Store the temporary file name in state
            const key = `${section.id}_${element.text}`;
            setUploadedFiles(prev => ({
              ...prev,
              [key]: selectedFile.name
            }));
            setAnsweredElements(prev => ({
              ...prev,
              [key]: true
            }));
          }
        }}
        sx={{ display: "none" }}
        disabled={isElementActive(element)}
      />
    </Box>
    {uploadedFiles[`${section.id}_${element.text}`] && (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
        <Typography variant="caption">
          Selected file: {uploadedFiles[`${section.id}_${element.text}`]}
        </Typography>
        <IconButton
          size="small"
          onClick={() => {
            const key = `${section.id}_${element.text}`;
            setUploadedFiles(prev => {
              const newState = {...prev};
              delete newState[key];
              return newState;
            });
            setAnsweredElements(prev => ({
              ...prev,
              [key]: false
            }));
            // Trigger auto-save with the removed file
            const data = prepareSubmitData(false);
            debouncedAutoSave(data);
          }}
          disabled={isElementActive(element)}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    )}
  </Box>
)} */}

{element.type === "File Upload" && (
  <Box mt={2}>
    <Typography
      variant="subtitle2"
      component="p"
      gutterBottom
      sx={{ fontWeight: "550" }}
    >
      {element.text}
    </Typography>
    
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography
        variant="body1"
        component="label"
        htmlFor={`fileInput_${section.id}_${element.id}`}
        sx={{ cursor: isElementActive(element) ? 'default' : 'pointer' }}
      >
        Upload Documents
      </Typography>
      <Input
        type="file"
        id={`fileInput_${section.id}_${element.id}`}
        onChange={(e) => {
          const selectedFiles = Array.from(e.target.files);
          if (selectedFiles.length > 0) {
            setFile(selectedFiles);
            setIsDocumentForm(true);
            
            // Store temporary file names in state
            const key = `${section.id}_${element.text}`;
            const currentFiles = uploadedFiles[key] || [];
            
            setUploadedFiles(prev => ({
              ...prev,
              [key]: [...currentFiles, ...selectedFiles.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type,
                // We'll update this with server data after upload
                serverData: null
              }))]
            }));
            
            setAnsweredElements(prev => ({
              ...prev,
              [key]: true
            }));
          }
        }}
        sx={{ display: "none" }}
        disabled={isElementActive(element)}
        multiple // Allow multiple file selection
      />
    </Box>
    
    {uploadedFiles[`${section.id}_${element.text}`]?.length > 0 && (
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" gutterBottom>
          Selected files:
        </Typography>
        {uploadedFiles[`${section.id}_${element.text}`].map((file, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Typography variant="caption">
              {file.name} ({Math.round(file.size / 1024)} KB)
            </Typography>
            <IconButton
              size="small"
              onClick={() => {
                const key = `${section.id}_${element.text}`;
                setUploadedFiles(prev => {
                  const newFiles = [...prev[key]];
                  newFiles.splice(index, 1);
                  return {
                    ...prev,
                    [key]: newFiles
                  };
                });
                
                // If no files left, mark as unanswered
                if (uploadedFiles[key].length === 1) {
                  setAnsweredElements(prev => ({
                    ...prev,
                    [key]: false
                  }));
                }
                
                // Trigger auto-save
                const data = prepareSubmitData(false);
                debouncedAutoSave(data);
              }}
              disabled={isElementActive(element)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>
    )}
  </Box>
)}
                          </Box>
                        )
                    )}
                  </Box>
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
                  <Button onClick={handleNext} variant="contained">
                    Next{" "}
                    <ArrowForwardIcon fontSize="small" sx={{ marginLeft: 2 }} />
                  </Button>
                ) : (
                  <Button variant="contained" onClick={handleSubmit}>
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
  
<UploadDrawer
  open={isDocumentForm}
  organizer={organizer}
  onClose={() => setIsDocumentForm(false)}
  file={file}
  accountId={accountId}
  onUploadSuccess={(fileData) => {
    console.log("File uploaded successfully:", fileData);
    // fileData should contain at least the file name
    const fileName = fileData.fileName;
    
    // Find which question this file belongs to
    const key = Object.keys(uploadedFiles).find(
      k => uploadedFiles[k] === file?.name
    );
    
    if (key) {
      // Update the uploadedFiles state with the final file name
      setUploadedFiles(prev => ({
        ...prev,
        [key]: fileName
      }));
      
      // Trigger auto-save with the new file name
      const data = prepareSubmitData(false);
      debouncedAutoSave(data);
    }
    
    setFile(null);
    setIsDocumentForm(false);
  }}
  onUploadError={(error) => {
    console.error("File upload failed:", error);
    // Clear the file selection if upload fails
    const key = Object.keys(uploadedFiles).find(
      k => uploadedFiles[k] === file?.name
    );
    if (key) {
      setUploadedFiles(prev => {
        const newState = {...prev};
        delete newState[key];
        return newState;
      });
    }
    setFile(null);
  }}
/>
{/* <UploadDrawer
  open={isDocumentForm}
  organizer={organizer}
  onClose={() => setIsDocumentForm(false)}
  files={file} // Now passing multiple files
  accountId={accountId}
  onUploadSuccess={(uploadedFileData) => {
    console.log("Files uploaded successfully:", uploadedFileData);
    
    // Find which question these files belong to
    const key = Object.keys(uploadedFiles).find(
      k => uploadedFiles[k].some(f => file.some(selectedFile => selectedFile.name === f.name))
    );
    
    if (key && uploadedFileData.length > 0) {
      // Update the uploadedFiles state with server data
      setUploadedFiles(prev => {
        const updatedFiles = prev[key].map(localFile => {
          const serverFile = uploadedFileData.find(
            serverFile => serverFile.originalName === localFile.name
          );
          return serverFile ? { ...localFile, serverData: serverFile } : localFile;
        });
        
        return {
          ...prev,
          [key]: updatedFiles
        };
      });
      
      // Trigger auto-save with the new file data
      const data = prepareSubmitData(false);
      debouncedAutoSave(data);
    }
    
    setFile(null);
    setIsDocumentForm(false);
  }}
  onUploadError={(error) => {
    console.error("File upload failed:", error);
    // Clear the file selection if upload fails
    const key = Object.keys(uploadedFiles).find(
      k => uploadedFiles[k].some(f => file.some(selectedFile => selectedFile.name === f.name))
    );
    
    if (key) {
      setUploadedFiles(prev => {
        const newFiles = prev[key].filter(
          f => !file.some(selectedFile => selectedFile.name === f.name)
        );
        return {
          ...prev,
          [key]: newFiles
        };
      });
    }
    setFile(null);
  }}
/> */}

    </>
  );
};

export default OrganizerDialog;