import { useState, useEffect } from "react";
import { DashboardPreview } from "../components/DashboardPreview";
import { SmartAlerts } from "../components/SmartAlerts";
import { DeviceManagement } from "../components/DeviceManagement";
import { DashboardSchedule } from "../components/DashboardSchedule";
import { Activity, Bell, Radio, Calendar } from "lucide-react";

export function Dashboard() {

  const [activeTab, setActiveTab] = useState("monitoring");

  // Tab switching
  useEffect(() => {
    const handleTabChange = (e: CustomEvent) => {
      setActiveTab(e.detail);
    };
    window.addEventListener("changeDashboardTab", handleTabChange);
    return () => window.removeEventListener("changeDashboardTab", handleTabChange);
  }, []);

  const tabs = [
    { id: "monitoring", label: "Live Monitoring", icon: Activity },
    { id: "schedule", label: "Task Scheduling", icon: Calendar },
    { id: "alerts", label: "Smart Alerts", icon: Bell },
    { id: "devices", label: "Device Management", icon: Radio },
  ];

  return (
    <div className="pt-20">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-green-50">Monitor and manage your hydroponic systems</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="container mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-green-500 text-green-600 font-semibold"
                      : "border-transparent text-gray-600"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === "monitoring" && <DashboardPreview />}
        {activeTab === "schedule" && <DashboardSchedule />}
        {activeTab === "alerts" && <SmartAlerts />}
        {activeTab === "devices" && <DeviceManagement />}
      </div>

    </div>
  );
}