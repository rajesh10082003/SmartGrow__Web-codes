import { useState } from "react";
import { Clock, Droplets, Thermometer, Activity, Calendar, Cpu } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ref, push } from "firebase/database";
import { db } from "../../firebase";

const MOCK_DEVICES = [
    { id: "dev_1", name: "Temperature Probe" },
    { id: "dev_2", name: "pH Sensor Module" },
    { id: "dev_3", name: "TDS/EC Sensor" },
    { id: "dev_4", name: "Water Pump Controller" }
];

export function DashboardSchedule() {
    const { user } = useAuth();

    const [taskType, setTaskType] = useState("Check Temp");
    const [scheduleTime, setScheduleTime] = useState("");
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>(MOCK_DEVICES[0].id);
    const [loading, setLoading] = useState(false);

    const handleSchedule = (e: React.FormEvent) => {
        e.preventDefault();
        if (!scheduleTime || !selectedDeviceId) return;
        setLoading(true);

        const device = MOCK_DEVICES.find(d => d.id === selectedDeviceId);

        const schedules = JSON.parse(localStorage.getItem(`schedules_${user?.id}`) || "[]");
        const newSchedule = {
            id: Date.now(),
            deviceId: selectedDeviceId,
            deviceName: device?.name || "Unknown Device",
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
            description: `Scheduled for ${device?.name || "Unknown Device"} at ${new Date(scheduleTime).toLocaleString()}`,
            created_at: new Date().toISOString(),
        });
        localStorage.setItem(`mock_activity_${user?.id}`, JSON.stringify(mockActivity));

        setTimeout(() => {
            const event = new CustomEvent("changeDashboardTab", { detail: "monitoring" });
            window.dispatchEvent(event);
        }, 500);
    };

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between mb-16">
                    <div className="max-w-3xl">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Device Task Scheduling
                        </h2>
                        <p className="text-xl text-gray-600">
                            Set up automated schedules for checking temperature, monitoring pH, or running pumps via your connected IoT devices.
                        </p>
                    </div>
                </div>

                <div className="max-w-2xl bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden p-8 mx-auto">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Task Details</h2>
                        <p className="text-gray-500 mt-2">
                            Configure a new schedule for your devices.
                        </p>
                    </div>

                    <form onSubmit={handleSchedule} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-3">Select Device</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Cpu className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    value={selectedDeviceId}
                                    onChange={(e) => setSelectedDeviceId(e.target.value)}
                                    className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all appearance-none"
                                >
                                    {MOCK_DEVICES.map((device) => (
                                        <option key={device.id} value={device.id}>
                                            {device.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-3">Task Type</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { label: "Check Temp", icon: Thermometer, color: "text-red-500", bg: "bg-red-50", activeBg: "bg-red-100", border: "border-red-200" },
                                    { label: "Check pH", icon: Activity, color: "text-green-500", bg: "bg-green-50", activeBg: "bg-green-100", border: "border-green-200" },
                                    { label: "Run Pump", icon: Droplets, color: "text-blue-500", bg: "bg-blue-50", activeBg: "bg-blue-100", border: "border-blue-200" },
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
        </section>
    );
}
