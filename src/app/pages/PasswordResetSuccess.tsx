import { Link } from "react-router";
import { Leaf, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";

export function PasswordResetSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50 flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="bg-green-500 p-3 rounded-xl">
              <Leaf className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Password Reset Successful!</h1>
          <p className="text-gray-600 mb-8">
            Your password has been successfully reset. You can now sign in with your new password.
          </p>

          <Link to="/signin">
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg text-lg">
              Go to Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
