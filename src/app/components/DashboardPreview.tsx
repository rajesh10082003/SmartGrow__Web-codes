import { Activity, Droplets, Thermometer, Zap, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function timeAgo(dateString: string) {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `Just now`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
}

export function DashboardPreview() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [data, setData] = useState({
    system_status: "Offline",
    updated_minutes_ago: 0,
    ph_level: 6.5,
    temperature: 22,
    tds: 855,
  });

  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:5000/live-monitor/${user.id}`)
        .then((res) => res.json())
        .then((val) => {
          if (!val.error) {
            setData({
              system_status: val.system_status || "Offline",
              updated_minutes_ago: val.updated_minutes_ago || 0,
              ph_level: val.ph_level ?? 6.5,
              temperature: val.temperature ?? 22,
              tds: val.tds ?? 855,
            });
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));

      fetch(`http://localhost:5000/sensor-history/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          let combinedHistory: any[] = [];
          if (Array.isArray(data)) {
            combinedHistory = data;
          }
          const mockActivity = JSON.parse(localStorage.getItem(`mock_activity_${user.id}`) || "[]");
          combinedHistory = [...mockActivity, ...combinedHistory].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setHistory(combinedHistory);
        })
        .catch(console.error);
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Live Monitoring Dashboard
          </h2>
          <p className="text-xl text-gray-600">
            Real-time analytics and insights at your fingertips.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Droplets className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Normal</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{data.ph_level.toFixed(1)}</div>
            <div className="text-sm text-gray-600">pH Level</div>
            <div className="text-xs text-gray-500 mt-2">Optimal range: 5.5-6.5</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-100 p-3 rounded-xl">
                <Thermometer className="h-6 w-6 text-red-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Optimal</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{data.temperature}°C</div>
            <div className="text-sm text-gray-600">Water Temperature</div>
            <div className="text-xs text-gray-500 mt-2">Target: 18-24°C</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Good</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{data.tds}</div>
            <div className="text-sm text-gray-600">TDS / EC (ppm)</div>
            <div className="text-xs text-gray-500 mt-2">Range: 800-1200 ppm</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${data.system_status === 'Online' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                {data.system_status === 'Online' ? '● Online' : '○ Offline'}
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{data.system_status === 'Online' ? 'Active' : 'Offline'}</div>
            <div className="text-sm text-gray-600">System Status</div>
            <div className="text-xs text-gray-500 mt-2">
              {loading ? "Loading status..." : `Last updated ${data.updated_minutes_ago} min ago`}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12 bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="text-gray-500 py-4">No recent activity found.</div>
            ) : (
              history.map((record, idx) => (
                <div key={record.id || idx} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                    <Activity className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {record.type === "Schedule created" ? record.title : "Sensor Reading Logged"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {record.type === "Schedule created"
                        ? record.description
                        : `pH: ${record.ph_level} | Temp: ${record.temperature}°C | TDS: ${record.tds} ppm`}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {timeAgo(record.created_at)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}