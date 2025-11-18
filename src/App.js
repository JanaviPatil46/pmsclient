import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import SignIn from "./login-signup/Signin";
import Home from "./pages/Home";
import Document from "./pages/Documents/Document";
import ChatsTasks from "./pages/chats&tasks/ChatsTasks";
import Organizers from "./pages/Organizers/Organizers";
import Proposals from "./pages/proposals/Proposals";
import UpdateChat from "./pages/chats&tasks/UpdateChat";
import Invoices from "./pages/Billing/Invoices";
import PayInvoice from "./pages/Billing/PayInvoice";
import Signup from "./login-signup/Signup";
import Settings from "./pages/Settings";
import ForgotPassword from "./login-signup/ForgotPassword";
import ResetPassword from "./login-signup/ResetPassword";
import UpdatePassword from "./login-signup/ActivateAccount";
import DocsFolderTree from "./docs-management/DocsFolderTree";
const App = () => {
  return (
    <>
      <BrowserRouter basename="/client">
        <Routes>
            <Route path="/" element={<Navigate to="/client/login" replace />} />
          <Route path="/client/login" element={<SignIn />} />
          <Route path="/client/signup" element={<Signup />} />
          <Route path="/client/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/client/reset-password/:token"
            element={<ResetPassword />}
          />
          <Route
            // path="/client/updatepassword/:id/:token"
            path="/client/updatepassword/:token"
            element={<UpdatePassword />}
          />
          <Route path="/" element={<Dashboard />}>
            <Route path="/client/home" element={<Home />} />
            <Route path="/client/document" element={<DocsFolderTree />} />
            <Route path="/client/chatstasks" element={<ChatsTasks />} />
            <Route path="/client/updatechat/:_id" element={<UpdateChat />} />

            <Route path="/client/organizers" element={<Organizers />} />
            <Route path="/client/billing" element={<Invoices />} />
            <Route path="/client/payinvoice" element={<PayInvoice />} />
            <Route path="/client/proposalsels" element={<Proposals />} />
            <Route path="/client/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/client/home" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
