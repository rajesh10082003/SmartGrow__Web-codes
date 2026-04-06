import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Clock, Droplets, Thermometer, Activity, Calendar } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function CropSchedule() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [taskType, setTaskType] = useState("Watering");
    const [scheduleTime, setScheduleTime] = useState("");
    const [crop, setCrop] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.id) {
            fetch(`${API_BASE_URL}/get-crops/${user.id}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        const found = data.find((c: any) => c.id.toString() === id);
                        setCrop(found);
                    }
                })
                .catch(console.error);
        }
    }, [id, user]);

    const handleSchedule = (e: React.FormEvent) => {
        e.preventDefault();
        if (!scheduleTime) return;
        setLoading(true);

        const schedules = JSON.parse(localStorage.getItem(`schedules_${user?.id}`) || "[]");
        const newSchedule = {
            id: Date.now(),
            cropId: id,
            cropName: crop?.crop_name || "Unknown Crop",
            taskType,
            scheduleTime, // ISO string from local datetime-local input
            isCompleted: false,
            notified: false
        };
        schedules.push(newSchedule);
        localStorage.setItem(`schedules_${user?.id}`, JSON.stringify(schedules));

        const mockActivity = JSON.parse(localStorage.getItem(`mock_activity_${user?.id}`) || "[]");
        mockActivity.push({
            id: Date.now() + 1,
            type: "Schedule created",
            title: `${taskType} Scheduled`,
            description: `Scheduled for ${crop?.crop_name || "Unknown Crop"} at ${new Date(scheduleTime).toLocaleString()}`,
            created_at: new Date().toISOString(),
        });
        localStorage.setItem(`mock_activity_${user?.id}`, JSON.stringify(mockActivity));

        setTimeout(() => {
            navigate("/dashboard");
            setTimeout(() => {
                const event = new CustomEvent("changeDashboardTab", { detail: "monitoring" });
                window.dispatchEvent(event);
            }, 100);
        }, 500);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-6 py-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="h-6 w-6 text-gray-700" />
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Schedule Task</h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                <div className="max-w-xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden p-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Task Details</h2>
                            <p className="text-gray-500 mt-2">
                                Set up a schedule for {crop ? <span className="font-semibold text-green-600">{crop.crop_name}</span> : "your crop"}
                            </p>
                        </div>

                        <form onSubmit={handleSchedule} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-3">Task Type</label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {[
                                        { label: "Watering", icon: Droplets, color: "text-blue-500", bg: "bg-blue-50", activeBg: "bg-blue-100", border: "border-blue-200" },
                                        { label: "Check pH", icon: Activity, color: "text-green-500", bg: "bg-green-50", activeBg: "bg-green-100", border: "border-green-200" },
                                        { label: "Check Temp", icon: Thermometer, color: "text-red-500", bg: "bg-red-50", activeBg: "bg-red-100", border: "border-red-200" },
                                    ].map((task) => (
                                        <button
                                            key={task.label}
                                            type="button"
                                            onClick={() => setTaskType(task.label)}
                                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${taskType === task.label
                                                    ? `${task.border} ${task.activeBg}`
                                                    : "border-gray-100 hover:border-gray-200 hover:bg-gray-50 bg-white"
                                                }`}
                                        >
                                            <task.icon className={`h-6 w-6 mb-2 ${task.color}`} />
                                            <span className={`text-sm font-medium ${taskType === task.label ? "text-gray-900" : "text-gray-600"}`}>
                                                {task.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="scheduleTime" className="block text-sm font-semibold text-gray-900 mb-3">
                                    Date & Time
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="scheduleTime"
                                        type="datetime-local"
                                        required
                                        value={scheduleTime}
                                        onChange={(e) => setScheduleTime(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold flex items-center justify-center gap-2 py-4 rounded-xl transition-colors shadow-sm disabled:bg-green-300"
                            >
                                <Clock className="w-5 h-5" />
                                {loading ? "Scheduling..." : "Confirm Schedule"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
