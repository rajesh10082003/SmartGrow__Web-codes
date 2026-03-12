import { Link, useNavigate } from "react-router";
import { Bell, Globe, HelpCircle, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export function Settings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:5000/get-notifications/${user.id}?type=all`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const unread = data.filter((n: any) => !n.is_read).length;
            setUnreadCount(unread);
          }
        })
        .catch(console.error);
    }
  }, [user]);

  const settingsOptions = [
    {
      icon: Bell,
      title: "Notifications",
      description: "Manage alert and notification preferences",
      badge: unreadCount > 0 ? unreadCount.toString() : undefined,
      onClick: () => {
        navigate("/dashboard?tab=alerts");
        setTimeout(() => {
          const event = new CustomEvent("changeDashboardTab", { detail: "alerts" });
          window.dispatchEvent(event);
        }, 100);
      },
    },
    {
      icon: Globe,
      title: "Language & Region",
      description: "Change language and timezone",
      onClick: () => navigate("/language-region"),
    },
    {
      icon: HelpCircle,
      title: "Help & Support",
      description: "Get help and contact support",
      onClick: () => navigate("/help-support"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/profile" className="text-green-600 hover:text-green-700 text-sm mb-2 inline-block">
            ← Back to Profile
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        {/* Settings List */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 divide-y divide-gray-200">
          {settingsOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <button
                key={index}
                onClick={option.onClick}
                className="w-full px-6 py-5 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="bg-green-100 p-3 rounded-lg">
                  <Icon className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{option.title}</h3>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
                {option.badge && (
                  <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {option.badge}
                  </span>
                )}
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}