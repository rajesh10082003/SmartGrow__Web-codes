import { Outlet, useLocation } from "react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function Layout() {
  const location = useLocation();
  const showFooter = location.pathname === "/";
  const authPages = [
    "/signin",
    "/register",
    "/forgot-password",
    "/verify-otp",
    "/reset-password",
    "/password-reset-success"
  ];
  const isAuthPage = authPages.includes(location.pathname);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className={isAuthPage ? "" : ""}>
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  );
}