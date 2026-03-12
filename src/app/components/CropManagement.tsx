import { Calendar, TrendingUp, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Progress } from "./ui/progress";
import { useAuth } from "../context/AuthContext";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1676410408633-79228457cec4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

export function CropManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [crops, setCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:5000/get-crops/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const mappedCrops = data.map((c: any) => {
              const today = new Date();
              const planted = new Date(c.planting_date);
              const harvest = new Date(c.estimated_harvest);

              const daysGrowing = Math.floor((today.getTime() - planted.getTime()) / (1000 * 3600 * 24));
              const harvestDays = Math.floor((harvest.getTime() - today.getTime()) / (1000 * 3600 * 24));

              const totalDays = Math.floor((harvest.getTime() - planted.getTime()) / (1000 * 3600 * 24));
              const rawProgress = totalDays > 0 ? (daysGrowing / totalDays) * 100 : 0;
              const growthProgress = Math.min(Math.max(Math.round(rawProgress), 0), 100);

              return {
                id: c.id,
                name: c.crop_name,
                image: DEFAULT_IMAGE,
                growthProgress,
                daysGrowing: Math.max(0, daysGrowing),
                harvestDays: Math.max(0, harvestDays),
                status: harvestDays <= 0 ? "Ready to Harvest" : "Growing",
              };
            });
            setCrops(mappedCrops.reverse()); // Show newest first
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-16">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Intelligent Crop Management
            </h2>
            <p className="text-xl text-gray-600">
              Track your plants from seedling to harvest. Monitor growth progress, health status, and optimal harvest times.
            </p>
          </div>
          <button
            onClick={() => navigate("/add-crop")}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <Plus className="h-5 w-5" />
            Add Crop
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading crops...</div>
        ) : crops.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No crops planted yet</h3>
            <p className="text-gray-500 mb-6">Start your first hydroponic crop cycle today.</p>
            <button
              onClick={() => navigate("/add-crop")}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add First Crop
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {crops.map((crop, index) => (
              <div
                key={index}
                onClick={() => navigate(`/schedule-crop/${crop.id}`)}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={crop.image}
                    alt={crop.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-green-600">
                    {crop.status}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">{crop.name}</h3>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Growth Progress</span>
                      <span className="font-semibold text-gray-900">{crop.growthProgress}%</span>
                    </div>
                    <Progress value={crop.growthProgress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-xs text-gray-500">Days Growing</div>
                        <div className="font-semibold text-gray-900">{crop.daysGrowing} days</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="text-xs text-gray-500">Harvest In</div>
                        <div className="font-semibold text-gray-900">{crop.harvestDays} days</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}