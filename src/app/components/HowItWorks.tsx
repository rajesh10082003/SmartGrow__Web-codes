import { Radio, Cloud, Monitor } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Radio,
    title: "Connect Sensors to the Hydroponic System",
    description: "Install ESP32-powered IoT sensors to measure pH, temperature, TDS/EC levels in your hydroponic setup. Easy plug-and-play installation.",
    color: "bg-blue-500"
  },
  {
    number: "02",
    icon: Cloud,
    title: "Send Data to the Cloud",
    description: "Sensors automatically transmit real-time data to our secure cloud platform via WiFi or Bluetooth. No configuration required.",
    color: "bg-green-500"
  },
  {
    number: "03",
    icon: Monitor,
    title: "Monitor Plants from the Dashboard",
    description: "Access comprehensive analytics, receive smart alerts, and control your system remotely from web or mobile dashboard.",
    color: "bg-purple-500"
  }
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600">
            Get started in three simple steps. From sensor installation to real-time monitoring.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 opacity-20"></div>
            
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-green-200 hover:shadow-xl transition-all duration-300">
                    <div className={`${step.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto relative z-10`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <div className="text-center mb-4">
                      <div className="text-sm font-bold text-gray-400 mb-2">STEP {step.number}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {step.title}
                      </h3>
                    </div>
                    
                    <p className="text-gray-600 text-center leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 max-w-4xl mx-auto text-white">
            <h3 className="text-2xl font-bold mb-3">Ready to Transform Your Hydroponic Farm?</h3>
            <p className="text-green-50 mb-6">Join thousands of smart farmers using IoT technology to optimize their yields.</p>
            <button className="bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors">
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
