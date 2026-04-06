import { useState, useRef } from "react";
import { API_BASE_URL } from "../config";
import { Link, useNavigate, useLocation } from "react-router";
import { Leaf, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";

export function VerifyOTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/verify-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/reset-password", { state: { email } });
      } else {
        setError(data.error || "Invalid OTP");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();

    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("OTP has been resent to " + email);
      } else {
        alert("Failed to resend OTP: " + (data.error || "Unknown error"));
      }
    } catch {
      alert("Network error. Failed to resend OTP.");
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Enter OTP</h1>
          <p className="text-gray-600 mt-2">
            We've sent a 6-digit code to
            <br />
            <span className="font-semibold text-gray-900">{email}</span>
          </p>
        </div>

        {/* OTP Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Enter 6-digit OTP
              </label>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg text-lg flex items-center justify-center gap-2"
            >
              Verify OTP
              <ArrowRight className="h-5 w-5" />
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-green-600 hover:text-green-700 font-semibold"
                >
                  Resend OTP
                </button>
              </p>
            </div>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back
          </Link>
        </div>
      </div>
    </div>
  );
}
