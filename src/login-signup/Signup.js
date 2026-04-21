import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import { Eye, EyeOff } from "lucide-react";
import logo from "../Images/snplogo-removebg-preview.png";
import { toast } from "material-react-toastify";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import 'react-phone-number-input/style.css';
const steps = ["Email Verification", "Personal Details", "Password & OTP"];

const ClientSignUp = (props) => {
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN
  const CLIENT_DOCS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
  const SEVER_PORT = process.env.REACT_APP_SERVER_URI;
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;

  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    firstname: "",
    middleName: "",
    lastName: "",
    accountName: "",
    // phoneNumber: "",
   phoneNumber: {
    phone: "",
    country: "us",
    countryCode: "1"
  },
    password: "",
    cpassword: "",
    otp: "",
    termsAccepted: false,
  });

  const [validation, setValidation] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [clientIdUpdate, setClientIdUpdate] = useState("");


  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Update account name when name fields change
    if (["firstname", "middleName", "lastName"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        accountName:
          `${prev.firstname} ${prev.middleName} ${prev.lastName}`.trim(),
      }));
    }
  };

  const handleOtpChange = (otp) => {
    setFormData((prev) => ({ ...prev, otp }));
  };

const handlePhoneChange = (value, country) => {
  setFormData(prev => ({
    ...prev,
    phoneNumber: {
      ...prev.phoneNumber,
      phone: value,
      country: country?.countryCode.toLowerCase() || "us",
      countryCode: country?.dialCode || "1"
    }
  }));
};
  // Password visibility handlers
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e) => e.preventDefault();
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleSignInClick = () => navigate("/client/login");

  // Step 1: Email verification
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const { email, termsAccepted } = formData;

    if (!email) {
      toast.error("Email is required!", { position: "top-center" });
      return;
    }
    if (!email.includes("@")) {
      toast.warning("Please include @ in your email!", {
        position: "top-center",
      });
      return;
    }
    if (!termsAccepted) {
      toast.error("Please accept terms and conditions", {
        position: "top-center",
      });
      return;
    }

    try {
      // Check if user exists
      const userCheck = await fetch(
        `${LOGIN_API}/common/user/email/getuserbyemail/${email}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      // const result = await userCheck.json();
      // if (result.user?.length > 0) {
      //   toast.error("User with this email already exists", {
      //     position: "top-right",
      //   });
      //   return;
      // }

      // Send OTP
      const otpResponse = await axios.post(
        `${LOGIN_API}/clientsotp/clientrequest-otp/`,
        {
          email: email,
        }
      );

      toast.success("OTP sent to your email. Please check your inbox.");
      handleNext();
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  // Step 2: Personal details
  const handlePersonalDetailsSubmit = (e) => {
    e.preventDefault();
    const { firstname, lastName, phoneNumber } = formData;

    let isValid = true;
    const newValidation = {
      firstName: "",
      lastName: "",
      phoneNumber: "",
    };

    if (!firstname) {
      newValidation.firstName = "First Name can't be blank";
      isValid = false;
    }
    if (!lastName) {
      newValidation.lastName = "Last Name can't be blank";
      isValid = false;
    }
    // if (!phoneNumber || phoneNumber.length < 6) {
    //   newValidation.phoneNumber = "Phone number must contain at least 6 digits";
    //   isValid = false;
    // }
  if (!phoneNumber.phone || phoneNumber.phone.replace(/\D/g, '').length < 6) {
    newValidation.phoneNumber = "Phone number must contain at least 6 digits";
    isValid = false;
  }

    setValidation(newValidation);
    if (isValid) handleNext();
  };

  // Step 3: Password and OTP verification
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { password, cpassword, otp } = formData;

    if (!password || password.length < 8) {
      toast.error("Password must be at least 8 characters", {
        position: "top-center",
      });
      return;
    }
    if (password !== cpassword) {
      toast.error("Passwords do not match", { position: "top-center" });
      return;
    }
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP", {
        position: "top-center",
      });
      return;
    }

    try {
      // Verify OTP
      const otpVerify = await axios.post(
        `${LOGIN_API}/clientsotp/verifyclient-otp/`,
        {
          email: formData.email,
          otp: otp,
        }
      );
console.log("OTP Verification Response:", otpVerify);
      if (otpVerify.data === "Email verified successfully") {
        await registerClient();
        toast.success("Registration successful!");
        navigate("/client/login");
      } else {
        toast.error("OTP verification failed");
        
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred during registration");
    }
  };


const registerClient = async () => {
  try {
    // Extract just the phone number digits from the phone object
    const phoneDigits = formData.phoneNumber.phone.replace(/\D/g, '');
    
    const clientResponse = await fetch(`${LOGIN_API}/admin/clientsignup/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        firstName: formData.firstname,
        middleName: formData.middleName,
        lastName: formData.lastName,
        phoneNumber: {
          phone: phoneDigits,
          country: formData.phoneNumber.country.toLowerCase(), // ensure lowercase
          countryCode: formData.phoneNumber.countryCode
        },
        accountName: formData.accountName,
        password: formData.password,
        cpassword: formData.cpassword,
      }),
    });

    const clientResult = await clientResponse.json();

    if (!clientResponse.ok) {
      throw new Error(clientResult.message || "Client signup failed");
    }

    if (!clientResult.client || !clientResult.client._id) {
      throw new Error("Client ID not returned in response");
    }

    setClientIdUpdate(clientResult.client._id);
    await createUserAccount(clientResult.client._id);
  } catch (error) {
    console.error("Client registration error:", error);
    throw error;
  }
};
  const createUserAccount = async (clientId) => {
    try {
      // Create user
      const userResponse = await fetch(`${LOGIN_API}/common/login/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.firstname,
          email: formData.email,
          password: formData.password,
          role: "Client",
        }),
      });

      const userResult = await userResponse.json();
console.log("User Signup Response:", userResult);
      // Update client with user ID
      await fetch(`${LOGIN_API}/admin/clientsignup/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid: userResult._id }),
      });

      // Create financial account
      await createFinancialAccount(userResult._id);

      // Send welcome email
      await clientCreatedmail();
    } catch (error) {
      console.error("User creation error:", error);
      throw error;
    }
  };

  const createFinancialAccount = async (userId) => {
    try {
      // Create account
      const accountResponse = await fetch(
        `${ACCOUNT_API}/accounts/accountdetails`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientType: "Individual",
            accountName: formData.accountName,
            userid: userId,
          }),
        }
      );

      const accountResult = await accountResponse.json();

      // Update account with user ID
      await fetch(
        `${ACCOUNT_API}/accounts/accountdetails/${accountResult.newAccount._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userid: userId }),
        }
      );
 // Create contact for this account
    await createContact(accountResult.newAccount._id);
      // Create client documents folder
      await addFolderTemplate(accountResult.newAccount._id);
    } catch (error) {
      console.error("Account creation error:", error);
      throw error;
    }
  };
  const createContact = async (accountId) => {
  try {
    const contactData = {
      firstName: formData.firstname,
      middleName: formData.middleName,
      lastName: formData.lastName,
      contactName: `${formData.firstname} ${formData.lastName}`.trim(),
      email: formData.email,
      login: true,
      notify: true,
      emailSync: true,
      accountid: accountId,
      phoneNumbers: [{
        phone: formData.phoneNumber.phone.replace(/\D/g, ''),
        country: formData.phoneNumber.country,
        countryCode: formData.phoneNumber.countryCode
      }]
    };

    console.log("contactdata", contactData);

    // Wrap the contact in an array before sending
    const response = await fetch(`${ACCOUNT_API}/contacts/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([contactData]), // Notice the array wrapper
    });

    const contactResult = await response.json();

    console.log("contactResult", contactResult);

    if (!response.ok) {
      throw new Error(contactResult.error || "Contact creation failed");
    }

    // Assuming the backend returns an array, take the first element
    const createdContact = contactResult.newContacts[0];

    // Update the account with the contact ID
    await fetch(`${ACCOUNT_API}/accounts/accountdetails/${accountId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contacts: createdContact._id }),
    });

    return createdContact;
  } catch (error) {
    console.error("Contact creation error:", error);
    throw error;
  }
};
// const createContact = async (accountId) => {
//   try {
//     const contactData = {
//       firstName: formData.firstname,
//       middleName: formData.middleName,
//       lastName: formData.lastName,
//       contactName: `${formData.firstname} ${formData.lastName}`.trim(),
//       email: formData.email,
//       login: true,
//       notify: true,
//       emailSync: true,
//       accountid: accountId,
//       phoneNumbers: [{
//           phone: formData.phoneNumber.phone.replace(/\D/g, ''),
//         country: formData.phoneNumber.country,
//         countryCode: formData.phoneNumber.countryCode
//       }]
//     };
// console.log("contactdata",contactData)
//     const response = await fetch(`${ACCOUNT_API}/contacts/`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(contactData),
//     });

//     const contactResult = await response.json();


//     console.log("contactResult",contactResult)
//     // if (!response.ok) {
//     //   throw new Error(contactResult.message || "Contact creation failed");
//     // }

//     // Update the account with the contact ID if needed
//     await fetch(`${ACCOUNT_API}/accounts/accountdetails/${accountId}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ contactid: contactResult._id }),
//     });

//     return contactResult;
//   } catch (error) {
//     console.error("Contact creation error:", error);
//     throw error;
//   }
// };
  const addFolderTemplate = async (accountId) => {
    try {
      const response = await fetch(`${CLIENT_DOCS}/clientdocs/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId }),
      });
      await response.json();
    } catch (error) {
      console.error("Folder creation error:", error);
      throw error;
    }
  };

  const clientCreatedmail = async () => {
    const port = window.location.port;
    const urlportlogin = `${port}/`;

    try {
      await fetch(`http://127.0.0.1/clientmail/clientsavedemail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          url: urlportlogin,
        }),
      });
    } catch (error) {
      console.error("Email sending error:", error);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground"><strong>Welcome to SNP Tax & Financials</strong></h2>
              <p className="text-sm text-muted-foreground">Let's get started</p>
            </div>

            <div className="flex flex-col gap-1 mt-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                autoFocus
                required
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background text-foreground text-sm px-3 py-2 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="flex items-start gap-2 mt-1">
              <input
                type="checkbox"
                id="termsAccepted"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded border-border accent-primary"
              />
              <label htmlFor="termsAccepted" className="text-sm text-muted-foreground">
                By signing up you agree to TaxDome Terms of Service, Privacy Policy and SMS Policy
              </label>
            </div>

            <button
              type="submit"
              className="w-[30%] rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Continue
            </button>
          </form>
        );
      case 1:
        return (
          <form onSubmit={handlePersonalDetailsSubmit} className="flex flex-col gap-3">
            <div>
              <h2 className="text-xl font-semibold text-foreground"><strong>Welcome to SNP Tax & Financials</strong></h2>
              <p className="text-sm text-muted-foreground">Some basic details about you</p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">First name</label>
              <input
                name="firstname"
                placeholder="First name"
                value={formData.firstname}
                onChange={handleChange}
                className={`w-full rounded-lg border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  validation.firstName ? "border-destructive" : "border-border"
                }`}
              />
              {validation.firstName && <p className="text-xs text-destructive">{validation.firstName}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">Middle name</label>
              <input
                name="middleName"
                placeholder="Middle name"
                value={formData.middleName}
                onChange={handleChange}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">Last name</label>
              <input
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full rounded-lg border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  validation.lastName ? "border-destructive" : "border-border"
                }`}
              />
              {validation.lastName && <p className="text-xs text-destructive">{validation.lastName}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">Account name</label>
              <input
                name="accountName"
                placeholder="Account name"
                value={formData.accountName}
                onChange={handleChange}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">Phone number</label>
              <PhoneInput
                value={formData.phoneNumber.phone}
                onChange={(value, country) => handlePhoneChange(value, country)}
                country={formData.phoneNumber.country || "us"}
                inputStyle={{ width: "100%" }}
                buttonStyle={{ borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px" }}
                containerStyle={{ display: "flex", alignItems: "center", gap: "8px" }}
              />
              {validation.phoneNumber && <p className="text-xs text-destructive">{validation.phoneNumber}</p>}
            </div>

            <div className="flex justify-between mt-2">
              <button
                type="button"
                onClick={handleBack}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Continue
              </button>
            </div>
          </form>
        );
      case 2:
        return (
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground"><strong>Welcome to SNP Tax & Financials</strong></h2>
              <p className="text-sm text-muted-foreground">Enter password</p>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border px-3 py-2 pr-10 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="button"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="cpassword" className="text-sm font-medium text-foreground">Confirm Password</label>
              <div className="relative">
                <input
                  id="cpassword"
                  name="cpassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.cpassword}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border px-3 py-2 pr-10 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="button"
                  onClick={handleClickShowConfirmPassword}
                  onMouseDown={handleMouseDownPassword}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-foreground">Enter verification code</p>
              <OtpInput
                value={formData.otp}
                onChange={handleOtpChange}
                numInputs={6}
                separator={<span>-</span>}
                renderInput={(props) => <input {...props} />}
                containerStyle={{ display: "flex" }}
                inputStyle={{
                  width: "2rem",
                  height: "2rem",
                  margin: "0 0.5rem",
                  fontSize: "1.5rem",
                  border: "1px solid var(--border)",
                  borderRadius: "4px",
                  textAlign: "center",
                  background: "var(--background)",
                  color: "var(--foreground)",
                }}
              />
            </div>

            <p className="text-sm text-muted-foreground">By signing up, you agree to our terms & conditions</p>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Let's get started
              </button>
            </div>
          </form>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      {/* Top bar with logo */}
      <header className="flex items-center px-6 py-4 border-b border-border shrink-0">
        <img src={logo} alt="SNP Tax & Financials" className="h-8 w-auto" />
      </header>

      <main className="flex flex-1 items-center justify-center p-4 py-8">
        <div className="w-full max-w-md flex flex-col gap-5">

          {/* Step indicator */}
          <div className="flex items-center gap-1">
            {steps.map((label, index) => (
              <div key={label} className="flex items-center gap-1 flex-1">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors ${
                  index <= activeStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground border border-border"
                }`}>
                  {index < activeStep ? "✓" : index + 1}
                </div>
                <span className={`text-[11px] hidden sm:inline truncate ${
                  index === activeStep ? "text-foreground font-semibold" : "text-muted-foreground"
                }`}>{label}</span>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-1 transition-colors ${
                    index < activeStep ? "bg-primary" : "bg-border"
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step content card */}
          <div className="rounded-xl border border-border bg-card shadow-sm p-6">
            {getStepContent(activeStep)}
          </div>

          {/* Sign in footer */}
          <p className="text-center text-[13px] text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={handleSignInClick}
              className="text-primary hover:underline font-semibold"
            >
              Sign in
            </button>
          </p>
        </div>
      </main>
    </div>
  );
};

export default ClientSignUp;
