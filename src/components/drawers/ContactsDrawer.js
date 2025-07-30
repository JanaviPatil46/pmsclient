import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Typography, Stack, Chip, Box, Divider, Alert,Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import MenuButton from "../MenuButton";
import axios from "axios";
import { ListItem, TextField, Autocomplete } from "@mui/material";
import { toast } from 'material-react-toastify';
import ReactFlagsSelect from "react-flags-select";
const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));
export default function ContactsDrawer({ onClose }) {
  const [selected, setSelected] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactName, setContactName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [note, setNote] = useState("");
  const [ssn, setSsn] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [combinedValues, setCombinedValues] = useState();
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  useEffect(() => {
    setContactName(`${firstName} ${middleName} ${lastName}`.trim());
  }, [firstName, middleName, lastName]);
  const handlePhoneNumberChange = (id, phone) => {
    setPhoneNumbers((prevPhoneNumbers) =>
      prevPhoneNumbers.map((item) =>
        item.id === id ? { ...item, phone } : item
      )
    );
  };
  const handleAddPhoneNumber = () => {
    setPhoneNumbers((prevPhoneNumbers) => [
      ...prevPhoneNumbers,
      { id: Date.now(), phone: "", isPrimary: false },
    ]);
  };

  const handleDeletePhoneNumber = (id) => {
    setPhoneNumbers((prevPhoneNumbers) =>
      prevPhoneNumbers.filter((item) => item.id !== id)
    );
  };
  // const [countries, setCountries] = useState([]);
  // const [selectedCountry, setSelectedCountry] = useState(null);
  // useEffect(() => {
  //   axios
  //     .get("https://restcountries.com/v3.1/all")
  //     .then((response) => {
  //       const countryData = response.data.map((country) => ({
  //         name: country.name.common,
  //         code: country.cca2,
  //       }));
  //       setCountries(countryData);
  //       console.log(countryData);
  //     })
  //     .catch((error) => console.error("Error fetching country data:", error));
  // }, []);
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmaileError] = useState("");
  const validateForm = () => {
    let isValid = true;
    if (!firstName) {
      setFirstNameError("First name is required");

      isValid = false;
    } else {
      setFirstNameError("");
    }

    if (!lastName) {
      setLastNameError("Last name is required.");
      isValid = false;
    } else {
      setLastNameError("");
    }
    if (!email) {
      setEmaileError("Email is required.");
      isValid = false;
    } else {
      setEmaileError("");
    }
    return isValid;
  };
  const sendingData = async (e) => {
    e.preventDefault();

    // Validate form before proceeding
    if (!validateForm()) {
      return; // Stop execution if validation fails
    }

    // handleNewDrawerClose();
    // handleDrawerClose();

    const raw = JSON.stringify([
      {
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        contactName: contactName,
        companyName: companyName,
        note: note,
        ssn: ssn,
        email: email,
        login: false,
        notify: false,
        emailSync: false,
        tags: combinedValues,
        // country: {
        //     name: "South Georgia",
        //     code: "GS"
        // },
        country: selected,
        streetAddress: streetAddress,
        city: city,
        state: state,
        postalCode: postalCode,
        phoneNumbers: phoneNumbers.map((phone) => phone.phone),
      },
    ]);
    console.log(raw);
    const requestOptions = {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },
      body: raw,
      redirect: "follow",
    };
    const url = "http://127.0.0.1/contacts/";
    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        // Handle success
        toast.success("Contact created successfully!");
        console.log('Contact:', result);  // Log the contactId
        onClose();
        // navigate("/clients/contacts");

        // Additional logic after successful creation if needed
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
        toast.error("Failed to create contact");
      });
  };
  return (
    <Stack>
      <Stack direction="row" sx={{ mb: 2, gap: 1, alignItems: "center" }}>
        <Typography variant="h6" component="p" sx={{ flexGrow: 1 }}>
          New Contacts
        </Typography>
        <MenuButton>
          <CloseIcon
            onClick={onClose}
            sx={{ cursor: "pointer", fontSize: "20px" }}
          />
        </MenuButton>
      </Stack>
      <Divider />

      <Stack sx={{ height: "90%", mb: 2 }}>
        <Stack sx={{ p: 0, mt: 3 }}>
          <Typography
            component="h2"
            variant="subtitle2"
            gutterBottom
            sx={{ fontWeight: "600" }}
          >
            Contact Info
          </Typography>
        </Stack>
        <Stack>
          <Grid container spacing={3}>
            <FormGrid size={{ xs: 12, md: 4 }}>
              <FormLabel htmlFor="first-name" required>
                First Name
              </FormLabel>
              <OutlinedInput
                id="first-name"
                name="first-name"
                type="name"
                placeholder="First Name"
                autoComplete="first name"
                required
                size="small"
                value={firstName}
                onChange={(e) => {
                  const value = e.target.value;
                  setFirstName(value);

                  // Clear the error message when input is not empty
                  if (value.trim() !== "") {
                    setFirstNameError("");
                  }
                }}
                error={!!firstNameError}
              />
            </FormGrid>
            <FormGrid size={{ xs: 12, md: 4 }}>
              <FormLabel htmlFor="middle-name">Middle Name</FormLabel>
              <OutlinedInput
                id="middle-name"
                name="middle-name"
                type="middle-name"
                placeholder="Middle name"
                autoComplete="middle name"
                // required
                size="small"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
              />
            </FormGrid>
            <FormGrid size={{ xs: 12, md: 4 }}>
              <FormLabel htmlFor="last-name" required>
                Last Name
              </FormLabel>
              <OutlinedInput
                id="last-name"
                name="last-name"
                type="last-name"
                placeholder="Last name"
                autoComplete="last name"
                required
                size="small"
                value={lastName}
                onChange={(e) => {
                  const value = e.target.value;
                  setLastName(value);

                  // Clear the error message when input is not empty
                  if (value.trim() !== "") {
                    setLastNameError("");
                  }
                }}
                error={!!firstNameError}
              />
              {!!lastNameError && (
                <Alert
                  sx={{
                    width: "96%",
                    p: "0", // Adjust padding to control the size
                    pl: "4%",
                    height: "23px",
                    borderRadius: "10px",
                    borderTopLeftRadius: "0",
                    borderTopRightRadius: "0",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center", // Center content vertically
                    "& .MuiAlert-icon": {
                      fontSize: "16px", // Adjust the size of the icon
                      mr: "8px", // Add margin to the right of the icon
                    },
                  }}
                  variant="filled"
                  severity="error"
                >
                  {lastNameError}
                </Alert>
              )}
            </FormGrid>
            <FormGrid size={{ xs: 12 }}>
              <FormLabel htmlFor="contact-name">Contact Name</FormLabel>
              <OutlinedInput
                id="contact-name"
                name="contact-name"
                type="contact-name"
                placeholder="Contact Name"
                autoComplete="shipping address-line2"
                // required
                size="small"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
            </FormGrid>
            <FormGrid size={{ xs: 12 }}>
              <FormLabel htmlFor="company-name">Company Name</FormLabel>
              <OutlinedInput
                id="company-name"
                name="company-name"
                type="company-name"
                placeholder="Company name"
                autoComplete="shipping address-line2"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                // required
                size="small"
              />
            </FormGrid>
            <FormGrid size={{ xs: 12 }}>
              <FormLabel htmlFor="note">Note</FormLabel>
              {/* <OutlinedInput
                id="note"
                name="note"
                type="note"
                placeholder="Note"
                autoComplete="shipping address-line2"
                value={note}
                
                onChange={(e) => setNote(e.target.value)}
               
                size="small"
              /> */}
              <OutlinedInput
  id="note"
  name="note"
  placeholder="Note"
  value={note}
  onChange={(e) => setNote(e.target.value)}
  size="small"
  multiline
  minRows={3}
  sx={{
    '& .MuiInputBase-input': {
      resize: 'vertical', // This works only when multiline is true
    },
  }}
/>

            </FormGrid>
            <FormGrid size={{ xs: 12 }}>
              <FormLabel htmlFor="ssn">SSN</FormLabel>
              <OutlinedInput
                id="ssn"
                name="ssn"
                type="ssn"
                placeholder="SSN"
                autoComplete="shipping address-line2"
                value={ssn}
                onChange={(e) => setSsn(e.target.value)}
                // required
                size="small"
              />
            </FormGrid>
            <FormGrid size={{ xs: 12 }}>
              <FormLabel htmlFor="email" required>
                Email
              </FormLabel>
              <OutlinedInput
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                autoComplete="email"
                required
                size="small"
                value={email}
                onChange={(e) => {
                  const value = e.target.value;
                  setEmail(value);

                  // Clear the error message when input is not empty
                  if (value.trim() !== "") {
                    setEmaileError("");
                  }
                }}
                error={!!emailError}
              />
              {!!emailError && (
                <Alert
                  sx={{
                    width: "96%",
                    p: "0", // Adjust padding to control the size
                    pl: "4%",
                    height: "23px",
                    borderRadius: "10px",
                    borderTopLeftRadius: "0",
                    borderTopRightRadius: "0",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center", // Center content vertically
                    "& .MuiAlert-icon": {
                      fontSize: "16px", // Adjust the size of the icon
                      mr: "8px", // Add margin to the right of the icon
                    },
                  }}
                  variant="filled"
                  severity="error"
                >
                  {emailError}
                </Alert>
              )}
            </FormGrid>

            <Stack sx={{ p: 0 }}>
              <Typography
                component="h2"
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: "600" }}
              >
                Phone numbers
              </Typography>
            </Stack>
            <FormGrid size={{ xs: 12 }}>
              {phoneNumbers.map((phone) => (
                <Box
                  key={phone.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,

                    mb: 2,
                  }}
                >
                  <Box>
                    <PhoneInput
                      country={"us"}
                      value={phone.phone}
                      onChange={(phoneValue) =>
                        handlePhoneNumberChange(phone.id, phoneValue)
                      }
                      inputStyle={{
                        width: "36dvw",
                      }}
                      containerStyle={{
                        width: "100%",
                      }}
                      dropdownStyle={{
                        width: "100%",
                      }}
                    />
                  </Box>
                  <DeleteOutlineIcon
                    onClick={() => handleDeletePhoneNumber(phone.id)}
                    style={{ cursor: "pointer", color: "red" }}
                  />
                </Box>
              ))}
              <Stack>
                {" "}
                <Typography
                  onClick={handleAddPhoneNumber}
                  component="h2"
                  variant="subtitle2"
                  gutterBottom
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    cursor: "pointer",
                  }}
                >
                  <AddCircleOutlineIcon style={{ fontSize: "18px" }} />
                  Add phone number
                </Typography>
              </Stack>
            </FormGrid>

            <Stack sx={{ p: 0 }}>
              <Typography
                component="h2"
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: "600" }}
              >
                Address
              </Typography>
            </Stack>
            <FormGrid size={{ xs: 12 }}>
              <FormLabel htmlFor="country">Country</FormLabel>

              <ReactFlagsSelect
                selected={selected}
                onSelect={(code) => setSelected(code)}
              />
            </FormGrid>
            <FormGrid size={{ xs: 12 }}>
              <FormLabel htmlFor="street-address">Street address</FormLabel>
              <OutlinedInput
                id="street-address"
                name="street-address"
                type="street-address"
                placeholder="Street address"
                autoComplete="street-address"
                // required
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                size="small"
              />
            </FormGrid>
            <FormGrid size={{ xs: 12, md: 4 }}>
              <FormLabel htmlFor="city">City</FormLabel>
              <OutlinedInput
                id="city"
                name="city"
                type="city"
                placeholder="City"
                autoComplete="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                size="small"
              />
            </FormGrid>
            <FormGrid size={{ xs: 12, md: 4 }}>
              <FormLabel htmlFor="state">State / Province</FormLabel>
              <OutlinedInput
                id="state"
                name="state"
                type="state"
                placeholder="State / Province"
                autoComplete="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                size="small"
              />
            </FormGrid>
            <FormGrid size={{ xs: 12, md: 4 }}>
              <FormLabel htmlFor="zip">Zip / Postal code</FormLabel>
              <OutlinedInput
                id="zip"
                name="zip"
                type="zip"
                placeholder="Zip / Postal code"
                autoComplete="shipping postal-code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                size="small"
              />
            </FormGrid>


            <Button
                    variant="contained"
                  
                    onClick={sendingData}
                    sx={{ width: { xs: '100%', sm: 'fit-content' } }}
                  >
                    Create
                  </Button>
          </Grid>
        </Stack>
      </Stack>
    </Stack>
  );
}
