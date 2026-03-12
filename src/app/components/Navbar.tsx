import { Leaf, Menu, User, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Don't show navbar on signin and register pages
  if (location.pathname === "/signin" || location.pathname === "/register") {
    return null;
  }

  // Don't show navbar on auth-related pages
  const authPages = [
    "/signin",
    "/register",
    "/forgot-password",
    "/verify-otp",
    "/reset-password",
    "/password-reset-success"
  ];
  if (authPages.includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-green-500 p-2 rounded-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Hydroponics SmartGrow</span>
          </Link>
          
          {/* Desktop Navigation */}
          {isAuthenticated ? (
            // Authenticated Navigation
            <div className="hidden md:flex items-center gap-8">
              <Link 
                to="/" 
                className={`transition-colors ${
                  isActive("/") 
                    ? "text-green-600 font-semibold" 
                    : "text-gray-700 hover:text-green-600"
                }`}
              >
                Home
              </Link>
              <Link 
                to="/dashboard" 
                className={`transition-colors ${
                  isActive("/dashboard") 
                    ? "text-green-600 font-semibold" 
                    : "text-gray-700 hover:text-green-600"
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/profile" 
                className={`transition-colors ${
                  isActive("/profile") 
                    ? "text-green-600 font-semibold" 
                    : "text-gray-700 hover:text-green-600"
                }`}
              >
                Profile
              </Link>
            </div>
          ) : (
            // Public Navigation - Empty for home page
            <div className="hidden md:flex items-center gap-8">
              {/* No links on public pages */}
            </div>
          )}
          
          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <User className="h-4 w-4" />
                  <span>{user?.name}</span>
                </div>
                <Button 
                  onClick={handleLogout}
                  variant="ghost" 
                  className="text-gray-700 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/signin">
                  <Button variant="ghost" className="text-gray-700 hover:text-green-600">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-green-500 hover:bg-green-600 text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </div>
    </nav>
  );
}