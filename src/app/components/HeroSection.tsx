import { ArrowRight, PlayCircle } from "lucide-react";
import { Link } from "react-router";
import { Button } from "./ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white to-green-50 pt-20 pb-32">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm">
              🌱 Smart Agriculture Technology
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              Smart Hydroponics Monitoring System
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Monitor pH level, water temperature, and TDS/EC levels in real time using IoT sensors and mobile technology. 
              Optimize your hydroponic farming with intelligent automation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 text-lg rounded-xl w-full">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:bg-gray-50 px-8 py-6 text-lg rounded-xl w-full">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  View Dashboard
                </Button>
              </Link>
            </div>
            
            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Monitoring</div>
              </div>
            </div>
          </div>
          
          {/* Right Content - Dashboard Preview */}
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 opacity-10 blur-3xl rounded-full"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1575388902449-6bca946ad549?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkYXNoYm9hcmQlMjBhbmFseXRpY3MlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzcyNzI3NzgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Dashboard Preview"
                className="rounded-xl w-full"
              />
              <div className="absolute top-12 right-12 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
                <div className="text-xs">System Status</div>
                <div className="text-lg font-bold">● Online</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}