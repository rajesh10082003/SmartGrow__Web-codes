import { Wifi, Bluetooth, Loader2, Info, Lock, X } from "lucide-react";
import { API_BASE_URL } from "../config";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const fallbackWifiDevices = [
  { id: "1", name: "Farm-Router-5G", type: "Saved", signal: "strong", secured: true },
  { id: "2", name: "ESP32-pH-01", type: "New", signal: "strong", secured: true },
  { id: "guest", name: "Guest_Network", type: "Open", signal: "weak", secured: false }
];

const mockBluetoothDevices = [
  { id: "5", name: "Hydro-Pump-BLE", type: "New", signal: "strong", secured: false },
  { id: "6", name: "Nutri-Doser-BLE", type: "New", signal: "medium", secured: false },
  { id: "7", name: "Smart-Grow-Light", type: "New", signal: "weak", secured: false },
];

const WindowsSignalIcon = ({ strength, secured }: { strength: string, secured?: boolean }) => {
  const bars = strength === "strong" ? 4 : strength === "medium" ? 3 : 2;
  return (
    <div className="relative flex items-end justify-center w-6 h-6">
      <div className="flex gap-[2px] items-end h-4 pb-0.5">
        <div className={`w-1 rounded-[1px] ${bars >= 1 ? 'bg-gray-800' : 'bg-gray-300'} h-1.5`} />
        <div className={`w-1 rounded-[1px] ${bars >= 2 ? 'bg-gray-800' : 'bg-gray-300'} h-2.5`} />
        <div className={`w-1 rounded-[1px] ${bars >= 3 ? 'bg-gray-800' : 'bg-gray-300'} h-3.5`} />
        <div className={`w-1 rounded-[1px] ${bars >= 4 ? 'bg-gray-800' : 'bg-gray-300'} h-4.5`} />
      </div>
      {secured && (
        <div className="absolute -top-1 -right-2 bg-white rounded-full p-[1px]">
          <Lock className="h-[10px] w-[10px] text-gray-700" />
        </div>
      )}
    </div>
  );
};

export function AddDevice() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<"wifi" | "bluetooth">("wifi");
  const [isPowerOn, setIsPowerOn] = useState({ wifi: true, bluetooth: false });
  const [isScanning, setIsScanning] = useState(true);
  
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [connectingStatus, setConnectingStatus] = useState("Verifying password...");
  const [connectedId, setConnectedId] = useState<string | null>(null);
  const [registeringError, setRegisteringError] = useState<string | null>(null);
  const [wrongPassword, setWrongPassword] = useState(false);

  const [realWifiDevices, setRealWifiDevices] = useState<any[]>(fallbackWifiDevices);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    
    if (isPowerOn[activeTab]) {
      setIsScanning(true);
      
      if (activeTab === "wifi") {
        fetch(`${API_BASE_URL}/system/wifi/scan`)
          .then(res => res.json())
          .then(data => {
            if (data.status === "success" && data.networks && data.networks.length > 0) {
              setRealWifiDevices(data.networks);
            }
          })
          .catch(err => console.log("Falling back to mock networks:", err))
          .finally(() => {
            setIsScanning(false);
          });
      } else {
        timer = setTimeout(() => {
          setIsScanning(false);
        }, 1500);
      }
    } else {
      setIsScanning(false);
    }
    
    return () => { if (timer) clearTimeout(timer) };
  }, [activeTab, isPowerOn]);

  const togglePower = () => {
    setIsPowerOn(prev => ({
      ...prev,
      [activeTab]: !prev[activeTab]
    }));
    if (isPowerOn[activeTab]) {
      setConnectingId(null);
      setConnectedId(null);
      setExpandedId(null);
      setRegisteringError(null);
      setWrongPassword(false);
    }
  };

  const handleExpand = (deviceId: string) => {
    if (connectingId || connectedId === deviceId) return;
    setExpandedId(prev => prev === deviceId ? null : deviceId);
    setPassword("");
    setWrongPassword(false);
  };

  const handleConnect = async (device: any) => {
    if (connectingId || connectedId === device.id) return;
    
    if (device.secured && !password && activeTab === 'wifi') {
      setWrongPassword(false);
      setRegisteringError("Please enter the network security key.");
      return;
    }

    setExpandedId(null);
    setRegisteringError(null);
    setWrongPassword(false);
    setConnectingStatus(device.secured ? "Verifying password..." : "Connecting...");
    setConnectingId(device.id);

    try {
      // ✅ Step 1: Call backend to actually connect to WiFi with real password verification
      if (activeTab === 'wifi') {
          // AbortController times out the fetch after 25s (backend needs up to 15-18s)
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 25000);

          let wifiRes: Response;
          try {
            wifiRes = await fetch(`${API_BASE_URL}/system/wifi/connect`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ssid: device.name,
                password: password,
                secured: device.secured ?? true,
              }),
              signal: controller.signal,
            });
          } finally {
            clearTimeout(timeoutId);
          }

          let wifiData: any = {};
          try { wifiData = await wifiRes!.json(); } catch { wifiData = {}; }

          if (!wifiRes!.ok || wifiData.status !== "success") {
            setConnectingId(null);
            setExpandedId(device.id);
            setWrongPassword(true);
            setRegisteringError(wifiData.message || "Incorrect password. Please try again.");
            return;
          }
        }

      // ✅ Step 2: WiFi connected — now register device in backend
      setConnectingStatus("Registering device...");
      setConnectedId(device.id);
      setConnectingId(null);

      if (!user?.id) {
        setRegisteringError("User not authenticated. Please sign in.");
        setConnectedId(null);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/add-device`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            device_name: device.name,
            qr_code: device.id,
          }),
        });

        const initialSensor = { ph_level: 6.2, temperature: 24.5, tds: 850 };

        if (response.ok || (await response.json()).error === "A device with this QR code already exists") {
          // Push initial sensor data
          try {
            await fetch(`${API_BASE_URL}/add-sensor-data`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ user_id: user.id, ...initialSensor }),
            });
          } catch (e) {
            console.error("Failed to inject initial sensor data", e);
          }

          // Store snapshot for dashboard
          localStorage.setItem(`latest_sensor_${user.id}`, JSON.stringify({
            system_status: "Online",
            ...initialSensor,
            updated_minutes_ago: 0,
            timestamp: Date.now(),
          }));

          // Save device to local list
          try {
            const userDevices = JSON.parse(localStorage.getItem(`user_devices_${user.id}`) || "[]");
            if (!userDevices.find((d: any) => d.id === device.id)) {
              userDevices.push({
                id: device.id,
                name: device.name,
                connection: activeTab === 'wifi' ? 'WiFi' : 'Bluetooth',
                status: "online",
                lastSeen: "Active now",
                battery: "100%",
              });
              localStorage.setItem(`user_devices_${user.id}`, JSON.stringify(userDevices));
            }
          } catch(e) {}

          // ✅ Navigate to dashboard after 1.5s
          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);

        } else {
          const data = await response.json();
          setRegisteringError(data.error || "Failed to sync device.");
          setConnectedId(null);
        }
      } catch (err) {
        setRegisteringError(`Network error. Make sure your Python backend is running on ${API_BASE_URL}.`);
        setConnectedId(null);
      }

    } catch (err) {
      // Backend not running — simulate connection for WiFi is not possible
      setConnectingId(null);
      setRegisteringError(`Cannot reach backend. Make sure Python Flask server is running on ${API_BASE_URL}.`);
    }
  };

  const handleDisconnect = () => {
    setConnectedId(null);
    setRegisteringError(null);
    setWrongPassword(false);
  };

  const currentDevices = activeTab === "wifi" ? realWifiDevices : mockBluetoothDevices;

  const sortedDevices = [...currentDevices].sort((a, b) => {
    if (connectedId === a.id) return -1;
    if (connectedId === b.id) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1617064364239-2a953e5eaf88?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center flex items-center justify-center font-sans">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      
      {/* Laptop System Menu Container - Windows 11 Style */}
      <div className="relative w-[380px] bg-[#fbfbfb]/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-xl overflow-hidden shadow-black/30">
        
        {/* Header Tabs (Simulating bottom taskbar/quick settings integration) */}
        <div className="flex bg-gray-100/50 p-2 gap-2 border-b border-gray-200">
           <button
             onClick={() => navigate(-1)}
             className="p-2 hover:bg-gray-200/60 rounded-md transition-colors mr-1"
             title="Close"
           >
             <X className="h-4 w-4 text-gray-700" />
           </button>
           <button
             onClick={() => setActiveTab("wifi")}
             className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${
               activeTab === "wifi" ? "bg-white shadow-sm text-gray-900 border border-gray-200/60" : "text-gray-600 hover:bg-gray-200/50"
             }`}
           >
             <Wifi className="h-4 w-4" />
             Wi-Fi
           </button>
           <button
             onClick={() => setActiveTab("bluetooth")}
             className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${
               activeTab === "bluetooth" ? "bg-white shadow-sm text-gray-900 border border-gray-200/60" : "text-gray-600 hover:bg-gray-200/50"
             }`}
           >
             <Bluetooth className="h-4 w-4" />
             Bluetooth
           </button>
        </div>

        {registeringError && (
          <div className="bg-red-50 border-b border-red-100 text-red-700 px-4 py-3 text-xs flex items-center gap-2">
            <Info className="h-4 w-4 flex-shrink-0" />
            <span>{registeringError}</span>
          </div>
        )}

        {/* Main Panel Header */}
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-900 font-semibold">
            {activeTab === "wifi" ? "Wi-Fi" : "Bluetooth"}
          </div>
          
          {/* Native-style Toggle Switch */}
          <button 
            onClick={togglePower}
            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${
              isPowerOn[activeTab] ? 'bg-[#005fb8]' : 'bg-gray-400'
            }`}
          >
            <span 
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                isPowerOn[activeTab] ? 'translate-x-[22px]' : 'translate-x-[4px]'
              }`}
            />
          </button>
        </div>

        {/* Network / Device List */}
        <div className="flex flex-col h-[400px] overflow-y-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300">
          {!isPowerOn[activeTab] ? (
            <div className="flex-1 flex flex-col items-center justify-center px-8 text-center pt-10">
              {activeTab === "wifi" ? <Wifi className="h-10 w-10 text-gray-400 mb-3" /> : <Bluetooth className="h-10 w-10 text-gray-400 mb-3" />}
              <p className="text-gray-800 font-medium text-sm">
                {activeTab === "wifi" ? "Wi-Fi is turned off" : "Bluetooth is turned off"}
              </p>
              <p className="text-gray-500 text-xs mt-1 mb-6">
                Turn it on to connect to available devices.
              </p>
              
              {activeTab === "wifi" && (
                <button 
                  onClick={() => window.location.href="ms-settings:network-wifi"} 
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-md border border-gray-300 transition-colors"
                >
                  Open Laptop Wi-Fi Settings
                </button>
              )}
            </div>
          ) : isScanning ? (
            <div className="px-5 pt-2">
              <div className="h-1 w-full bg-blue-100 overflow-hidden rounded-full mb-3">
                <div className="h-full bg-[#005fb8] w-1/3 animate-[pulse_1.5s_ease-in-out_infinite]" style={{ transformOrigin: 'left', animation: 'indeterminate 1.5s infinite linear' }} />
              </div>
              <p className="text-xs text-blue-800 font-medium">Scanning nearby {activeTab}...</p>
              <style>{`
                @keyframes indeterminate {
                  0% { transform: translateX(-100%) scaleX(0.2); }
                  50% { transform: translateX(0%) scaleX(0.5); }
                  100% { transform: translateX(300%) scaleX(0.2); }
                }
              `}</style>
            </div>
          ) : (
            <div className="px-3 space-y-0.5 mt-2">
              {sortedDevices.length === 0 && (
                <div className="p-4 text-center text-xs text-gray-500">No networks found from your laptop adapter.</div>
              )}
              {sortedDevices.map((device) => {
                const isConnecting = connectingId === device.id;
                const isConnected = connectedId === device.id;
                const isExpanded = expandedId === device.id;

                return (
                  <div key={device.id} className={`rounded-md transition-colors overflow-hidden ${isExpanded ? 'bg-black/5' : 'hover:bg-black/5'}`}>
                    <div 
                      onClick={() => handleExpand(device.id)}
                      className={`w-full flex items-center px-3 py-2.5 cursor-default select-none ${isConnecting ? "opacity-70" : ""}`}
                    >
                      <div className="flex-shrink-0 w-8 flex items-center justify-center mr-3">
                        {activeTab === "wifi" ? (
                          <WindowsSignalIcon strength={device.signal} secured={device.secured} />
                        ) : (
                          <Bluetooth className="h-5 w-5 text-gray-700" />
                        )}
                      </div>
                      
                      <div className="flex-1 text-left min-w-0">
                        <p className={`text-[13px] truncate ${isConnected ? 'font-semibold text-gray-900' : 'font-medium text-[#1c1c1c]'}`}>
                          {device.name}
                        </p>
                        {(isConnected || isConnecting || (activeTab === "wifi" && device.secured)) && (
                          <p className={`text-[11px] mt-[1px] ${isConnected ? 'text-[#005fb8] font-medium' : 'text-gray-500'}`}>
                            {isConnected 
                              ? activeTab === "wifi" ? "Connected, secured" : "Connected" 
                              : isConnecting 
                                ? connectingStatus
                                : activeTab === "wifi" && device.secured ? "Secured" : ""}
                          </p>
                        )}
                      </div>

                      <div className="flex-shrink-0 ml-3">
                        {isConnecting && <Loader2 className="h-4 w-4 text-[#005fb8] animate-spin" />}
                      </div>
                    </div>

                    {/* Window's Expanded Area */}
                    {isExpanded && !isConnected && !isConnecting && (
                      <div className="px-3 pb-3 pt-1">
                        {activeTab === "wifi" && device.secured ? (
                          <div className="px-[44px]">
                            <input 
                              type="password" 
                              placeholder="Enter the network security key" 
                              value={password}
                              onChange={(e) => { setPassword(e.target.value); setWrongPassword(false); }}
                              onClick={(e) => e.stopPropagation()}
                              className={`w-full px-2.5 py-1.5 text-[13px] border rounded shadow-sm focus:outline-none bg-white ${
                                wrongPassword
                                  ? "border-red-500 focus:border-red-500 border-b-2"
                                  : "border-gray-300 focus:border-[#005fb8] focus:border-b-2"
                              }`}
                              autoFocus
                            />
                            {wrongPassword && (
                              <p className="text-[11px] text-red-600 mt-1 font-medium">
                                ✕ Incorrect password. Please check and try again.
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2.5 mb-3">
                              <input type="checkbox" id={`auto-${device.id}`} className="rounded-sm border-gray-400 text-[#005fb8] focus:ring-[#005fb8] h-3.5 w-3.5" defaultChecked />
                              <label htmlFor={`auto-${device.id}`} className="text-[12px] text-gray-800 select-none">Connect automatically</label>
                            </div>
                          </div>
                        ) : (
                          <div className="px-[44px] mb-3">
                            <p className="text-[12px] text-gray-600">
                              {activeTab === "wifi" ? "Information sent over this network might be visible to others." : "Make sure the device is turned on and discoverable."}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-end gap-1.5 px-[44px]">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleConnect(device); }}
                            className="px-6 py-1 text-[13px] bg-[#005fb8] hover:bg-[#005fb8]/90 rounded text-white font-medium border border-transparent"
                          >
                            {activeTab === "wifi" ? "Connect" : "Pair"}
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setExpandedId(null); }}
                            className="px-6 py-1 text-[13px] bg-gray-100 hover:bg-gray-200 rounded text-gray-800 font-medium border border-gray-300/60"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Connected State Options */}
                    {isConnected && (
                      <div className="px-[44px] pb-3 pt-1 flex gap-1.5">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDisconnect(); }}
                          className="px-4 py-1 flex-1 text-[13px] bg-gray-100 hover:bg-gray-200 rounded text-gray-800 font-medium border border-gray-300/60"
                        >
                          Disconnect
                        </button>
                        <button className="px-4 py-1 flex-1 text-[13px] bg-gray-100 hover:bg-gray-200 rounded text-gray-800 font-medium border border-gray-300/60">
                          Properties
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Footer info acting as OS quick settings bottom bar */}
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-2.5 flex items-center justify-between">
          <div className="text-[11px] text-gray-500 font-medium">
            SmartGrow Syncing Enabled
          </div>
          <button onClick={() => window.location.href="ms-settings:network-wifi"} className="text-[#005fb8] text-[11px] hover:underline cursor-pointer font-medium">
            Network & internet settings
          </button>
        </div>
      </div>
    </div>
  );
}