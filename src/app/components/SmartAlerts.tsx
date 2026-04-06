import { AlertTriangle, Droplets, Wrench, Clock, Trash2, CheckCircle2, Info } from "lucide-react";
import { API_BASE_URL } from "../config";
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

const getIcon = (type: string) => {
  const t = (type || "").toLowerCase();
  if (t === 'critical' || t === 'error') return Wrench;
  if (t === 'high' || t === 'warning') return Droplets;
  if (t === 'info') return Info;
  return AlertTriangle;
};

const getColorClass = (type: string) => {
  const t = (type || "").toLowerCase();
  if (t === 'critical' || t === 'error') return "bg-red-500";
  if (t === 'high' || t === 'warning') return "bg-orange-500";
  if (t === 'medium') return "bg-yellow-500";
  return "bg-blue-500";
};

export function SmartAlerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/get-notifications/${user.id}?type=all`);
      const data = await res.json();
      let combinedAlerts: any[] = [];
      if (Array.isArray(data)) {
        combinedAlerts = data;
      }

      const schedules = JSON.parse(localStorage.getItem(`schedules_${user.id}`) || "[]");
      const localAlerts = schedules
        .filter((s: any) => new Date(s.scheduleTime) <= new Date() && !s.deleted)
        .map((s: any) => ({
          id: `local_${s.id}`,
          title: `${s.taskType} Reminder`,
          description: `It's time to ${s.taskType.toLowerCase()} for your crop: ${s.cropName}.`,
          type: "Warning",
          created_at: s.scheduleTime,
          is_read: s.is_read || false,
          is_local: true
        }));

      combinedAlerts = [...localAlerts, ...combinedAlerts].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setAlerts(combinedAlerts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    // Optional: check every minute to pop up scheduled alerts
    const interval = setInterval(fetchAlerts, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const handleDelete = async (id: number | string) => {
    if (typeof id === 'string' && id.startsWith('local_')) {
      const scheduleId = id.replace('local_', '');
      const schedules = JSON.parse(localStorage.getItem(`schedules_${user?.id}`) || "[]");
      const updated = schedules.map((s: any) => s.id.toString() === scheduleId ? { ...s, deleted: true } : s);
      localStorage.setItem(`schedules_${user?.id}`, JSON.stringify(updated));
      setAlerts(alerts.filter(a => a.id !== id));
      return;
    }
    try {
      await fetch(`${API_BASE_URL}/delete-notification/${id}`, { method: 'DELETE' });
      setAlerts(alerts.filter(a => a.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkRead = async (id: number | string) => {
    if (typeof id === 'string' && id.startsWith('local_')) {
      const scheduleId = id.replace('local_', '');
      const schedules = JSON.parse(localStorage.getItem(`schedules_${user?.id}`) || "[]");
      const updated = schedules.map((s: any) => s.id.toString() === scheduleId ? { ...s, is_read: true } : s);
      localStorage.setItem(`schedules_${user?.id}`, JSON.stringify(updated));
      setAlerts(alerts.map(a => a.id === id ? { ...a, is_read: true } : a));
      return;
    }
    try {
      await fetch(`${API_BASE_URL}/mark-read/${id}`, { method: 'PUT' });
      setAlerts(alerts.map(a => a.id === id ? { ...a, is_read: true } : a));
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Smart Notifications & Alerts
          </h2>
          <p className="text-xl text-gray-600">
            Stay informed with real-time alerts. Never miss critical events affecting your hydroponic system.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading alerts...</div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <div className="mx-auto w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">All clear!</h3>
              <p className="text-gray-500">Your hydroponic systems are running perfectly.</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const Icon = getIcon(alert.type);
              const colorBg = getColorClass(alert.type);
              const priorityLower = (alert.type || "").toLowerCase();

              let leftBorderClass = "bg-blue-400";
              if (priorityLower === 'critical' || priorityLower === 'error') leftBorderClass = 'bg-red-400';
              else if (priorityLower === 'high' || priorityLower === 'warning') leftBorderClass = 'bg-orange-400';
              else if (priorityLower === 'medium') leftBorderClass = 'bg-yellow-400';

              return (
                <div
                  key={alert.id}
                  className={`bg-white rounded-xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border flex gap-5 items-start relative transition-all ${alert.is_read ? 'opacity-70 border-gray-100' : 'border-gray-200'}`}
                >
                  {/* Priority left accent bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl ${leftBorderClass}`}></div>

                  <div className={`${colorBg} p-4 rounded-xl flex-shrink-0`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  <div className="flex-1 min-w-0 py-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`text-lg font-bold ${alert.is_read ? 'text-gray-600' : 'text-gray-900'}`}>{alert.title}</h3>
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${priorityLower === 'critical' ? 'bg-red-50 text-red-500' :
                        priorityLower === 'high' ? 'bg-orange-50 text-orange-400' :
                          priorityLower === 'medium' ? 'bg-yellow-50 text-yellow-500' :
                            'bg-blue-50 text-blue-500'
                        }`}>
                        {alert.type || 'INFO'}
                      </span>
                    </div>
                    <p className="text-[15px] text-gray-500 mb-4">{alert.message || alert.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>{timeAgo(alert.created_at)}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 opacity-0 hover:opacity-100 transition-opacity absolute right-6 bottom-4 group" style={{ opacity: 1 }}>
                        {!alert.is_read && (
                          <button
                            onClick={() => handleMarkRead(alert.id)}
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(alert.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete alert"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
