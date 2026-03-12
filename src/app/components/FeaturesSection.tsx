import { Droplets, Thermometer, Activity, Wifi, Sprout, Bell } from "lucide-react";

const features = [
  {
    icon: Droplets,
    title: "Real-time pH Monitoring",
    description: "Track pH levels continuously with precise IoT sensors and get instant alerts when values go out of range.",
    color: "bg-blue-500"
  },
  {
    icon: Thermometer,
    title: "Water Temperature Tracking",
    description: "Monitor water temperature 24/7 to ensure optimal growing conditions for your hydroponic crops.",
    color: "bg-red-500"
  },
  {
    icon: Activity,
    title: "TDS / EC Nutrient Monitoring",
    description: "Measure total dissolved solids and electrical conductivity to maintain perfect nutrient balance.",
    color: "bg-green-500"
  },
  {
    icon: Wifi,
    title: "Device Pairing with WiFi or Bluetooth",
    description: "Seamlessly connect your IoT sensors via WiFi or Bluetooth for instant data synchronization.",
    color: "bg-purple-500"
  },
  {
    icon: Sprout,
    title: "Crop Management System",
    description: "Manage multiple crops, track growth stages, and plan harvests with our intelligent crop management tools.",
    color: "bg-green-600"
  },
  {
    icon: Bell,
    title: "Smart Notifications & Alerts",
    description: "Receive real-time notifications for critical events, maintenance reminders, and system updates.",
    color: "bg-yellow-500"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Smart Farming
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to monitor and optimize your hydroponic farming system in one intelligent platform.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-6`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
