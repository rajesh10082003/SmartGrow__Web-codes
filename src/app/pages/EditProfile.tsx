import { useState } from "react";
import { API_BASE_URL } from "../config";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Phone, Save } from "lucide-react";
import { Button } from "../components/ui/button";

export function EditProfile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "+1 234 567 8900",
    bio: user?.bio || "Passionate about sustainable agriculture and hydroponics technology.",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError("");

    if (!user || !user.id) {
      setError("User context not established. Please sign in again.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/edit-profile/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        updateUser(data.updated_user);
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      } else {
        setError(data.error || "Failed to update profile.");
      }
    } catch (err) {
      setError("Network error. Could not connect to the backend server.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/profile" className="text-green-600 hover:text-green-700 text-sm mb-2 inline-block">
            ← Back to Profile
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600 mt-2">Update your personal information</p>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center text-sm">
              <span className="text-red-700">{error}</span>
              {(!user || !user.id) && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    logout();
                    navigate("/signin");
                  }}
                  className="whitespace-nowrap bg-red-600 hover:bg-red-700 text-white"
                >
                  Sign In Again
                </Button>
              )}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
              Profile updated successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {formData.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <Button type="button" variant="outline" className="mb-2">
                  Change Photo
                </Button>
                <p className="text-xs text-gray-500">JPG, PNG or GIF. Max size 2MB</p>
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <Save className="h-5 w-5" />
                Save Changes
              </Button>
              <Link to="/profile" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full py-3 rounded-lg"
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}