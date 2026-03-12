import { Smartphone, Download } from "lucide-react";
import { Button } from "./ui/button";

export function MobileAppPreview() {
  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm">
              📱 Mobile Application
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900">
              Monitor Your Farm From Anywhere
            </h2>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Access your hydroponic systems on the go with our mobile app. Available for iOS and Android devices.
            </p>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="bg-green-500 rounded-full p-1 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Real-time Notifications</div>
                  <div className="text-gray-600">Get instant alerts for critical events</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-green-500 rounded-full p-1 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Live Dashboard</div>
                  <div className="text-gray-600">Monitor all parameters in real-time</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-green-500 rounded-full p-1 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Remote Control</div>
                  <div className="text-gray-600">Control pumps and devices remotely</div>
                </div>
              </li>
            </ul>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 rounded-xl">
                <Download className="mr-2 h-5 w-5" />
                Download for iOS
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:bg-gray-50 px-8 py-6 rounded-xl">
                <Download className="mr-2 h-5 w-5" />
                Download for Android
              </Button>
            </div>
          </div>
          
          {/* Right Content - Mobile Mockup */}
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 opacity-10 blur-3xl rounded-full"></div>
            <div className="relative flex justify-center gap-6">
              <div className="w-64 bg-gray-900 rounded-[3rem] p-3 shadow-2xl transform -rotate-6">
                <div className="bg-white rounded-[2.5rem] overflow-hidden">
                  <div className="bg-gray-900 h-6 rounded-b-2xl mx-auto w-32"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1629697777394-e0b3103903bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9iaWxlJTIwYXBwJTIwbW9ja3VwfGVufDF8fHx8MTc3MjcyNzc4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Mobile App"
                    className="w-full h-96 object-cover"
                  />
                </div>
              </div>
              
              <div className="w-64 bg-gray-900 rounded-[3rem] p-3 shadow-2xl transform rotate-6 mt-12">
                <div className="bg-white rounded-[2.5rem] overflow-hidden">
                  <div className="bg-gray-900 h-6 rounded-b-2xl mx-auto w-32"></div>
                  <div className="p-6 space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">Dashboard</div>
                      <div className="text-sm text-gray-500">System Overview</div>
                    </div>
                    <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-200">
                      <div className="text-sm text-green-600 mb-1">pH Level</div>
                      <div className="text-3xl font-bold text-green-700">6.5</div>
                    </div>
                    <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
                      <div className="text-sm text-blue-600 mb-1">Temperature</div>
                      <div className="text-3xl font-bold text-blue-700">22°C</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
