import { ArrowLeft, Globe, Clock, Check } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

const languages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
];

const timezones = [
  "UTC-12:00 Baker Island",
  "UTC-11:00 American Samoa",
  "UTC-10:00 Hawaii",
  "UTC-09:00 Alaska",
  "UTC-08:00 Pacific Time (US & Canada)",
  "UTC-07:00 Mountain Time (US & Canada)",
  "UTC-06:00 Central Time (US & Canada)",
  "UTC-05:00 Eastern Time (US & Canada)",
  "UTC-04:00 Atlantic Time (Canada)",
  "UTC-03:00 Buenos Aires",
  "UTC-02:00 Mid-Atlantic",
  "UTC-01:00 Azores",
  "UTC+00:00 London, Dublin",
  "UTC+01:00 Paris, Berlin",
  "UTC+02:00 Cairo, Athens",
  "UTC+03:00 Moscow, Istanbul",
  "UTC+04:00 Dubai",
  "UTC+05:00 Islamabad, Karachi",
  "UTC+05:30 Mumbai, New Delhi",
  "UTC+06:00 Dhaka",
  "UTC+07:00 Bangkok, Jakarta",
  "UTC+08:00 Singapore, Hong Kong",
  "UTC+09:00 Tokyo, Seoul",
  "UTC+10:00 Sydney",
  "UTC+11:00 Solomon Islands",
  "UTC+12:00 Auckland",
];

export function LanguageRegion() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedTimezone, setSelectedTimezone] = useState("UTC+05:30 Mumbai, New Delhi");

  const handleSave = () => {
    // Save preferences logic here
    navigate("/settings");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/settings")}
            className="text-green-600 hover:text-green-700 text-sm mb-2 inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Settings
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Language & Region</h1>
          <p className="text-gray-600 mt-2">Choose your language and timezone preferences</p>
        </div>

        {/* Language Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-2 rounded-lg">
              <Globe className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Language</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">Select your preferred language</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => setSelectedLanguage(language.code)}
                className={`p-4 border-2 rounded-xl text-left transition-all ${
                  selectedLanguage === language.code
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{language.name}</div>
                    <div className="text-sm text-gray-600">{language.nativeName}</div>
                  </div>
                  {selectedLanguage === language.code && (
                    <Check className="h-5 w-5 text-green-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Timezone Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Timezone</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">Select your timezone</p>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {timezones.map((timezone) => (
              <button
                key={timezone}
                onClick={() => setSelectedTimezone(timezone)}
                className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                  selectedTimezone === timezone
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-gray-900">{timezone}</div>
                  {selectedTimezone === timezone && (
                    <Check className="h-5 w-5 text-green-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
