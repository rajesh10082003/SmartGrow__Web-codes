import { ArrowLeft } from "lucide-react";
import { API_BASE_URL } from "../config";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export function AddCrop() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cropName: "",
    variety: "",
    plantingDate: "",
    estimatedHarvest: "",
    notes: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      setError("Please sign in to add a crop");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/add-crop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          crop_name: formData.cropName,
          variety: formData.variety,
          planting_date: formData.plantingDate,
          estimated_harvest: formData.estimatedHarvest,
          notes: formData.notes
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Navigate to crop management after adding
        navigate("/dashboard?tab=crops");
        setTimeout(() => {
          const event = new CustomEvent("changeDashboardTab", { detail: "crops" });
          window.dispatchEvent(event);
        }, 100);
      } else {
        setError(data.error || "Failed to add crop");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">New Crop</h1>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="space-y-6">
              {/* Crop Name */}
              <div>
                <label htmlFor="cropName" className="block text-sm font-semibold text-gray-900 mb-3">
                  Crop Name
                </label>
                <input
                  id="cropName"
                  name="cropName"
                  type="text"
                  required
                  value={formData.cropName}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all"
                  placeholder="e.g. Spinach"
                />
              </div>

              {/* Variety */}
              <div>
                <label htmlFor="variety" className="block text-sm font-semibold text-gray-900 mb-3">
                  Variety
                </label>
                <input
                  id="variety"
                  name="variety"
                  type="text"
                  value={formData.variety}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all"
                  placeholder="e.g. Bloomsdale"
                />
              </div>

              {/* Planting Date and Est. Harvest */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="plantingDate" className="block text-sm font-semibold text-gray-900 mb-3">
                    Planting Date
                  </label>
                  <div className="relative">
                    <input
                      id="plantingDate"
                      name="plantingDate"
                      type="date"
                      required
                      value={formData.plantingDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="estimatedHarvest" className="block text-sm font-semibold text-gray-900 mb-3">
                    Est. Harvest
                  </label>
                  <div className="relative">
                    <input
                      id="estimatedHarvest"
                      name="estimatedHarvest"
                      type="date"
                      value={formData.estimatedHarvest}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-semibold text-gray-900 mb-3">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3.5 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:bg-white outline-none resize-none transition-all"
                  placeholder="Optional notes..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-xl transition-colors shadow-sm disabled:bg-green-300"
            >
              {loading ? "Adding Crop..." : "Start Growing"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
