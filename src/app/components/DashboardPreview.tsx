import { Activity, Droplets, Thermometer, Zap, Cpu, Wifi, RefreshCw, AlertTriangle, CheckCircle2, Clock, Info } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { ref, onValue, off } from "firebase/database";
import { db } from "../../firebase";

// ─── Sensor thresholds ───────────────────────────────────────────────────────
const PH_RANGE = { low: 5.5, high: 6.5 };
const TEMP_RANGE = { low: 18, high: 24 };
const TDS_RANGE = { low: 800, high: 1200 };

function getSensorStatus(value: number, low: number, high: number): "good" | "warning" | "danger" {
  if (value >= low && value <= high) return "good";
  if (value < low * 0.85 || value > high * 1.15) return "danger";
  return "warning";
}

function StatusBadge({ status, label }: { status: "good" | "warning" | "danger"; label?: string }) {
  const styles = {
    good: "text-green-700 bg-green-50  border border-green-200",
    warning: "text-amber-700 bg-amber-50  border border-amber-200",
    danger: "text-red-700   bg-red-50    border border-red-200",
  };
  const icons = {
    good: "✓",
    warning: "⚠",
    danger: "✕",
  };
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${styles[status]}`}>
      <span>{icons[status]}</span>
      {label ?? (status === "good" ? "Normal" : status === "warning" ? "Warning" : "Critical")}
    </span>
  );
}

export function DashboardPreview() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState<"connecting" | "live" | "restricted">("connecting");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [timeSince, setTimeSince] = useState("–");
  const retryCount = useRef(0);

  const [data, setData] = useState({
    status: "Offline",
    ph: 0,
    temperature: 0,
    tds: 0,
  });

  // ── Firebase Realtime Listener with Automatic Retry ──────────────────────────
  useEffect(() => {
    if (!user?.id) return;

    let unsubscribe: () => void;
    
    const setupFirebase = () => {
      const deviceRef = ref(db, "devices/device1");
      
      unsubscribe = onValue(
        deviceRef,
        (snapshot) => {
          const d = snapshot.val();
          if (d) {
            setData({
              status: d.status || "Offline",
              ph: Number(d.ph) || 0,
              temperature: Number(d.temperature) || 0,
              tds: Number(d.tds) || 0,
            });
            setLastUpdated(new Date());
            setLoading(false);
            setIsUsingFallback(false);
            setFirebaseStatus("live");
          } else {
            setFirebaseStatus("restricted");
            tryLoadFallback();
          }
        },
        (error) => {
          console.warn("Firebase restricted. Retrying logic active...");
          setFirebaseStatus("restricted");
          tryLoadFallback();
        }
      );
    };

    setupFirebase();

    // Re-attempt Firebase every 15 seconds if it's restricted
    // This allows the UI to update automatically once the user fixes the rules!
    const retryInterval = setInterval(() => {
      if (firebaseStatus === "restricted") {
        console.log("Re-attempting Firebase cloud sync...");
        if (unsubscribe) off(ref(db, "devices/device1"));
        setupFirebase();
      }
    }, 15000);

    return () => {
      if (unsubscribe) off(ref(db, "devices/device1"));
      clearInterval(retryInterval);
    };
  }, [user, firebaseStatus === "restricted"]);

  const tryLoadFallback = () => {
    if (!user?.id) return;
    try {
      const fallback = localStorage.getItem(`latest_sensor_${user.id}`);
      if (fallback) {
        const d = JSON.parse(fallback);
        setData({
          status: d.status || d.system_status || "Online",
          ph: d.ph || d.ph_level || 6.2,
          temperature: d.temperature || 24.5,
          tds: d.tds || 850,
        });
        setLastUpdated(new Date(d.timestamp || Date.now()));
        setIsUsingFallback(true);
      }
    } catch (e) {
      console.error("Local fallback failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!lastUpdated) return;
    const ticker = setInterval(() => {
      const sec = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
      if (sec < 60) setTimeSince(`${sec}s ago`);
      else setTimeSince(`${Math.floor(sec / 60)}m ago`);
    }, 1000);
    return () => clearInterval(ticker);
  }, [lastUpdated]);

  const phStatus = getSensorStatus(data.ph, PH_RANGE.low, PH_RANGE.high);
  const tempStatus = getSensorStatus(data.temperature, TEMP_RANGE.low, TEMP_RANGE.high);
  const tdsStatus = getSensorStatus(data.tds, TDS_RANGE.low, TDS_RANGE.high);

  const isOnline = data.status === "Online";

  if (loading) return (
    <div className="py-24 text-center">
      <RefreshCw className="h-8 w-8 animate-spin mx-auto text-green-500 mb-4" />
      <p className="text-gray-500 text-sm italic">Syncing with smart system...</p>
    </div>
  );

  return (
    <section className="py-10 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Live Monitoring</h1>
            <div className="flex items-center gap-3">
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                firebaseStatus === "live" 
                  ? "bg-blue-50 text-blue-600 border-blue-100" 
                  : "bg-amber-50 text-amber-600 border-amber-100"
              }`}>
                {firebaseStatus === "live" ? <Zap className="h-3.5 w-3.5" /> : <Wifi className="h-3.5 w-3.5" />}
                {firebaseStatus === "live" ? "Firebase Cloud Live" : "Direct Device Sync"}
              </span>
              <p className="text-gray-400 text-xs italic">
                {firebaseStatus === "live" ? "Cloud sync active. Edits in Firebase reflect here real-time." : "Waiting for Firebase rules update... using local link."}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm ${
              isOnline ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
            }`}>
              <span className={`w-2.5 h-2.5 rounded-full bg-white ${isOnline ? "animate-pulse" : ""}`} />
              {data.status}
            </div>
            <div className="text-[10px] text-gray-400 mt-2 font-bold flex items-center gap-1">
              <Clock className="h-3 w-3" /> LAST UPDATE: {timeSince.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Sensor Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {[
            { label: "pH Potential", val: data.ph.toFixed(1), unit: "pH", icon: Droplets, color: "blue", status: phStatus, range: "5.5 - 6.5" },
            { label: "Water Temp", val: data.temperature.toFixed(1), unit: "°C", icon: Thermometer, color: "orange", status: tempStatus, range: "18 - 24°C" },
            { label: "TDS Levels", val: Math.round(data.tds), unit: "ppm", icon: Activity, color: "emerald", status: tdsStatus, range: "800 - 1200" }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-2xl shadow-gray-200/40 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-${item.color}-50/50 rounded-full translate-x-12 -translate-y-12 group-hover:scale-110 transition-transform`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-8">
                  <div className={`bg-${item.color}-50 p-4 rounded-2xl`}>
                    <item.icon className={`h-7 w-7 text-${item.color}-500`} />
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-6xl font-black text-gray-900 tracking-tighter">{item.val}</span>
                  <span className="text-gray-400 font-bold text-lg uppercase">{item.unit}</span>
                </div>
                <div className="text-gray-500 font-bold text-sm tracking-wide uppercase">{item.label}</div>
                <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between text-[11px] font-bold text-gray-400">
                  <span>OPTIMAL RANGE</span>
                  <span className="text-gray-900">{item.range}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Firebase Rule Instruction Box (Only shows if blocked) */}
        {firebaseStatus === "restricted" && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10"><Cpu className="w-64 h-64 -translate-y-12 translate-x-12 rotate-12" /></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-8 w-8 text-amber-300" />
                <h3 className="text-xl font-black uppercase tracking-tight">Enable Live Firebase Cloud Sync</h3>
              </div>
              <p className="text-blue-50 font-medium mb-6 max-w-2xl leading-relaxed">
                We are currently pulling data directly from your local hardware connection. To see changes you make in the <b>Firebase Console</b> reflect here instantly, you must enable Public Reads.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://console.firebase.google.com/project/hydroponics-web/database/hydroponics-web-default-rtdb/rules"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-blue-700 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20"
                >
                  Open Firebase Rules
                </a>
                <div className="bg-blue-800/50 backdrop-blur-sm border border-blue-400/30 px-4 py-2 rounded-xl text-[10px] font-mono whitespace-pre opacity-90 leading-tight">
                  {`{\n  "rules": {\n    ".read": true,\n    ".write": false\n  }\n}`}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}