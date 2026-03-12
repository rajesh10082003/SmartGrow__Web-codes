import { ArrowLeft, MapPin, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const deviceTypes = [
  "pH Sensor",
  "Temperature Sensor",
  "TDS/EC Sensor",
  "Water Level Sensor",
  "Humidity Sensor",
  "Light Sensor",
  "Water Pump Controller",
  "Nutrient Doser",
];

const connectionTypes = ["WiFi", "Bluetooth"];

const mockNearbyDevices = [
  { id: "1", name: "ESP32-pH-01", type: "pH Sensor", signal: -45 },
  { id: "2", name: "ESP32-Temp-02", type: "Temperature Sensor", signal: -52 },
  { id: "3", name: "ESP32-TDS-03", type: "TDS/EC Sensor", signal: -38 },
  { id: "4", name: "ESP32-Pump-04", type: "Water Pump", signal: -60 },
];

export function AddDevice() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    deviceName: "",
    deviceType: "",
    connection: "WiFi",
    selectedDevice: "",
  });

  const [showDeviceTypeDropdown, setShowDeviceTypeDropdown] = useState(false);
  const [showConnectionDropdown, setShowConnectionDropdown] = useState(false);
  const [showSurroundingDropdown, setShowSurroundingDropdown] = useState(false);

  useEffect(() => {
    // Simulate searching for devices
    const timer = setTimeout(() => {
      setIsSearching(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [formData.connection]);

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    // Reset searching when connection changes
    if (field === "connection") {
      setIsSearching(true);
      setFormData({
        ...formData,
        connection: value,
        selectedDevice: "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      setError("Please sign in to add a device");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/add-device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          device_name: formData.deviceName,
          qr_code: formData.selectedDevice, // Using the simulated selected sensor as mock QR identifier
        }),
      });

      if (response.ok) {
        navigate("/dashboard");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to add device");
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
            <h1 className="text-3xl font-bold text-gray-900">Add Device</h1>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Searching Status */}
          {isSearching && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
              <MapPin className="h-5 w-5 text-green-600" />
              <span className="text-green-700 font-medium">
                Searching for {formData.connection} devices near you
              </span>
              <div className="ml-auto">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-600 border-t-transparent"></div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="space-y-6">
              {/* Device Name */}
              <div>
                <label htmlFor="deviceName" className="block text-sm font-semibold text-gray-900 mb-3">
                  Device Name
                </label>
                <input
                  id="deviceName"
                  name="deviceName"
                  type="text"
                  required
                  value={formData.deviceName}
                  onChange={(e) => handleChange("deviceName", e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g. My PH Sensor"
                />
              </div>

              {/* Device Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Device Type
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowDeviceTypeDropdown(!showDeviceTypeDropdown)}
                    className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-left text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all flex items-center justify-between"
                  >
                    <span className={formData.deviceType ? "text-gray-900" : "text-gray-400"}>
                      {formData.deviceType || "pH Sensor"}
                    </span>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </button>

                  {showDeviceTypeDropdown && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {deviceTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            handleChange("deviceType", type);
                            setShowDeviceTypeDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-900"
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Choose Connection */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Choose Connection
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowConnectionDropdown(!showConnectionDropdown)}
                    className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-left text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all flex items-center justify-between"
                  >
                    <span>{formData.connection}</span>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </button>

                  {showConnectionDropdown && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg">
                      {connectionTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            handleChange("connection", type);
                            setShowConnectionDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-900"
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Surrounding Devices */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Surrounding Devices
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowSurroundingDropdown(!showSurroundingDropdown)}
                    disabled={isSearching}
                    className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-left focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className={formData.selectedDevice ? "text-gray-900" : "text-gray-400"}>
                      {formData.selectedDevice || "Tap to select device"}
                    </span>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </button>

                  {showSurroundingDropdown && !isSearching && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {mockNearbyDevices.map((device) => (
                        <button
                          key={device.id}
                          type="button"
                          onClick={() => {
                            handleChange("selectedDevice", device.name);
                            setShowSurroundingDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-gray-900 font-medium">{device.name}</div>
                              <div className="text-sm text-gray-500">{device.type}</div>
                            </div>
                            <div className="text-xs text-gray-500">{device.signal} dBm</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSearching || !formData.selectedDevice || loading}
              className="w-full mt-8 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Pairing & Connecting..." : "Pair & Connect"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}