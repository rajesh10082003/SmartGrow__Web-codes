import React from "react";
import { API_BASE_URL } from "../config";
import { Sprout, Calendar, Cpu, TrendingUp, Settings, Edit, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";

export function UserProfile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = React.useState({ systems: 8, plants: 156, days: 45, successRate: "94%" });

  // Load stats and fresh user object data globally right upon mounting the View
  React.useEffect(() => {
    if (user?.id) {
      fetch(`${API_BASE_URL}/profile-stats/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            // Fresh syncing
            updateUser({ bio: data.bio, email: data.email, name: data.name });
            setStats(prev => ({
              ...prev,
              systems: data.systems || prev.systems,
              plants: data.plants || prev.plants,
              days: data.days || prev.days,
            }));
          }
        })
        .catch(console.error);
    }
  }, [user?.id, updateUser]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    logout();
    navigate("/");
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Profile Dashboard
          </h2>
          <p className="text-xl text-gray-600">
            Complete overview of your hydroponic farming operations and system performance.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-green-200">
                  {user?.name?.charAt(0).toUpperCase() || "S"}
                </div>
                <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{user?.name || "Sarah Johnson"}</h3>
                <p className="text-gray-600 mb-2">{user?.bio || "Passionate about sustainable agriculture and hydroponics technology."}</p>
                <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                  <span className="text-sm text-gray-500">✉️ {user?.email || "sarah.j@hydroponics.com"}</span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">Premium Plan</span>
                </div>
              </div>

              {/* Profile Actions */}
              <div className="flex flex-col gap-3">
                <Link to="/settings">
                  <Button variant="outline" className="w-full flex items-center gap-2 justify-start">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                </Link>
                <Link to="/edit-profile">
                  <Button variant="outline" className="w-full flex items-center gap-2 justify-start">
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-xl">
                  <Sprout className="h-6 w-6 text-green-600" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.plants}</div>
              <div className="text-sm text-gray-600">Total Plants</div>
              <div className="text-xs text-green-600 mt-2">+12% this month</div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.days}</div>
              <div className="text-sm text-gray-600">Days of Growth</div>
              <div className="text-xs text-gray-500 mt-2">Average cycle time</div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Cpu className="h-6 w-6 text-purple-600" />
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.systems}</div>
              <div className="text-sm text-gray-600">Systems Connected</div>
              <div className="text-xs text-green-600 mt-2">All systems online</div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.successRate}</div>
              <div className="text-sm text-gray-600">Success Rate</div>
              <div className="text-xs text-green-600 mt-2">Above target</div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                  <Sprout className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">New crop planted</div>
                  <div className="text-sm text-gray-600">Added 24 Butterhead Lettuce seedlings to System A</div>
                  <div className="text-xs text-gray-500 mt-1">2 hours ago</div>
                </div>
              </div>

              <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Harvest completed</div>
                  <div className="text-sm text-gray-600">Harvested 18 Fresh Basil plants from System C</div>
                  <div className="text-xs text-gray-500 mt-1">Yesterday</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                  <Cpu className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Device connected</div>
                  <div className="text-sm text-gray-600">New pH sensor added to System B</div>
                  <div className="text-xs text-gray-500 mt-1">3 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}