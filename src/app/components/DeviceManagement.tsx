import { Cpu, Wifi, Bluetooth, Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const demoDevices = [
  {
    id: "demo1",
    name: "pH Sensor Module (Demo)",
    type: "ESP32-DevKit",
    connection: "WiFi",
    status: "online",
    lastSeen: "Active now",
    battery: "95%"
  },
  {
    id: "demo2",
    name: "Temperature Probe (Demo)",
    type: "ESP32-S2",
    connection: "Bluetooth",
    status: "online",
    lastSeen: "Active now",
    battery: "82%"
  }
];

export function DeviceManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [realDevices, setRealDevices] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      try {
        const stored = JSON.parse(localStorage.getItem(`user_devices_${user.id}`) || "[]");
        setRealDevices(stored);
      } catch (e) {}
    }
  }, [user]);

  const allDevices = [...realDevices, ...demoDevices];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            IoT Device Management
          </h2>
          <p className="text-xl text-gray-600">
            Connect and manage all your IoT sensors and controllers. Powered by ESP32 microcontrollers with WiFi and Bluetooth connectivity.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {allDevices.map((device, index) => (
            <div 
              key={device.id || index}
              className={`bg-white rounded-2xl p-6 border-2 ${
                device.status === 'online' ? 'border-green-200' : 'border-gray-200'
              } shadow-sm hover:shadow-lg transition-shadow`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gray-100 p-3 rounded-xl">
                  <Cpu className="h-6 w-6 text-gray-700" />
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  device.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`}></div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-1">{device.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{device.type}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {device.connection === 'WiFi' ? (
                    <Wifi className="h-4 w-4 text-blue-500" />
                  ) : (
                    <Bluetooth className="h-4 w-4 text-blue-500" />
                  )}
                  <span className="text-gray-600">{device.connection}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className={`font-medium ${
                    device.status === 'online' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {device.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Battery:</span>
                  <span className={`font-medium ${
                    parseInt(device.battery) < 20 ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {device.battery}
                  </span>
                </div>
                
                <div className="text-xs text-gray-500 pt-2 border-t">
                  {device.lastSeen}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={() => navigate("/add-device")}
            size="lg" 
            variant="outline" 
            className="border-2 border-dashed border-green-300 hover:bg-green-50 hover:border-green-400 text-green-600 px-8 py-6 rounded-xl"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add New Device
          </Button>
        </div>
        
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-green-700 mb-2">ESP32</div>
            <div className="text-sm text-green-600">Microcontroller Platform</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-700 mb-2">WiFi + BLE</div>
            <div className="text-sm text-blue-600">Dual Connectivity</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-700 mb-2">Cloud Sync</div>
            <div className="text-sm text-purple-600">Real-time Data Transfer</div>
          </div>
        </div>
      </div>
    </section>
  );
}