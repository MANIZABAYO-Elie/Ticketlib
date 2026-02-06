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
import OrganizerDashboard from "../pages/OrganizerDashboard";
import SuperAdminDashboard from "../pages/SuperAdminDashboard";
import ModeratorDashboard from "../pages/ModeratorDashboard";
import AdminApprovalPage from "../pages/AdminApprovalPage";
import TicketBookingSystem from "../pages/TicketBookingSystem";
import EventDetails from "../pages/EventDetails";
import CheckoutPage from "../pages/CheckoutPage";
import PaymentSuccess from "../pages/PaymentSuccess";
import MyTickets from "../pages/MyTickets";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
         <Route path="/contact" element={<ContactPage />} />
         <Route path="/signup" element={<SignupPage/>} />
         <Route path="/signIn" element={<LoginPage/>} />
         <Route path="/profile" element={<ProfilePage/>} />
         <Route path="/logged-in-profile" element={<ProtectedRoute><LoggedInProfilePage/></ProtectedRoute>} />
         <Route path="/discover" element={<DiscoverEventsPage/>} />
         <Route path="/ticket-proceed" element={<TicketProceed/>} />
         <Route path="/payment" element={<ProtectedRoute><PaymentConfirmation/></ProtectedRoute>} />
         <Route path="/terms" element={<TermsAndConditions/>} />
         <Route path="/forgot-password" element={<ForgotPassword/>} />
         <Route path="/otp-verification" element={<OtpVerificationPage/>} />
         <Route path="/reset-password" element={<ResetPasswordPage/>} />
         <Route path="/organizer-dashboard" element={<ProtectedRoute requiredRole="organizer"><OrganizerDashboard/></ProtectedRoute>} />
         <Route path="/moderator-dashboard" element={<ProtectedRoute requiredRole="moderator"><ModeratorDashboard/></ProtectedRoute>} />
         <Route path="/admin/approvals" element={<ProtectedRoute requiredRole="admin"><AdminApprovalPage/></ProtectedRoute>} />
         <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole="admin"><SuperAdminDashboard/></ProtectedRoute>} />
         <Route path="/events/:eventId" element={<EventDetails/>} />
         <Route path="/terms-conditions" element={<TermsAndConditions/>} />
         <Route path="/ticket-booking" element={<TicketBookingSystem/>} />
         <Route path="/checkout" element={<ProtectedRoute><CheckoutPage/></ProtectedRoute>} />
         <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess/></ProtectedRoute>} />
         <Route path="/my-tickets" element={<ProtectedRoute><MyTickets/></ProtectedRoute>} />
         <Route path="/book-tickets" element={<ProtectedRoute><TicketBookingSystem/></ProtectedRoute>} />
         <Route path="/book-tickets/:eventId" element={<ProtectedRoute><TicketBookingSystem/></ProtectedRoute>} />
         <Route path="/seat-selection" element={<ProtectedRoute><TicketBookingSystem/></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
