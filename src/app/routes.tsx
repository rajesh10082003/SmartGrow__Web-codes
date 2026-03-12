import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { Profile } from "./pages/Profile";
import { SignIn } from "./pages/SignIn";
import { Register } from "./pages/Register";
import { ForgotPassword } from "./pages/ForgotPassword";
import { VerifyOTP } from "./pages/VerifyOTP";
import { ResetPassword } from "./pages/ResetPassword";
import { PasswordResetSuccess } from "./pages/PasswordResetSuccess";
import { Settings } from "./pages/Settings";
import { EditProfile } from "./pages/EditProfile";
import { AddCrop } from "./pages/AddCrop";
import { CropSchedule } from "./pages/CropSchedule";
import { AddDevice } from "./pages/AddDevice";
import { LanguageRegion } from "./pages/LanguageRegion";
import { HelpSupport } from "./pages/HelpSupport";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "signin", Component: SignIn },
      { path: "register", Component: Register },
      { path: "forgot-password", Component: ForgotPassword },
      { path: "verify-otp", Component: VerifyOTP },
      { path: "reset-password", Component: ResetPassword },
      { path: "password-reset-success", Component: PasswordResetSuccess },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "add-crop",
        element: (
          <ProtectedRoute>
            <AddCrop />
          </ProtectedRoute>
        ),
      },
      {
        path: "schedule-crop/:id",
        element: (
          <ProtectedRoute>
            <CropSchedule />
          </ProtectedRoute>
        ),
      },
      {
        path: "add-device",
        element: (
          <ProtectedRoute>
            <AddDevice />
          </ProtectedRoute>
        ),
      },
      {
        path: "language-region",
        element: (
          <ProtectedRoute>
            <LanguageRegion />
          </ProtectedRoute>
        ),
      },
      {
        path: "help-support",
        element: (
          <ProtectedRoute>
            <HelpSupport />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: "edit-profile",
        element: (
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);