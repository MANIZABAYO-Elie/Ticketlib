import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import ContactPage from "../pages/ContactPage";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/profilePage";
import LoggedInProfilePage from "../pages/LoggedInProfilePage";
import DiscoverEventsPage from "../pages/DiscoverEventPage";
import TicketProceed from "../pages/TicketProceed";
import PaymentConfirmation from "../pages/PaymentConfirmation";
import TermsAndConditions from "../pages/TermsAndConditions";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerificationPage from "../pages/OtpVerificationPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import Dashboard from "../pages/Dashboard";

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
         <Route path="/contact" element={<ContactPage />} />
         <Route path="/signup" element={<SignupPage/>} />
         <Route path="/signIn" element={<LoginPage/>} />
         <Route path="/profile" element={<ProfilePage/>} />
         <Route path="/logged-in-profile" element={<LoggedInProfilePage/>} />
         <Route path="/discover" element={<DiscoverEventsPage/>} />
         <Route path="/ticket-proceed" element={<TicketProceed/>} />
         <Route path="/payment" element={<PaymentConfirmation/>} />
         <Route path="/terms" element={<TermsAndConditions/>} />
         <Route path="/forgot-password" element={<ForgotPassword/>} />
         <Route path="/otp-verification" element={<OtpVerificationPage/>} />
         <Route path="/reset-password" element={<ResetPasswordPage/>} />
         <Route path="/dashboard" element={<Dashboard/>} />

         

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
