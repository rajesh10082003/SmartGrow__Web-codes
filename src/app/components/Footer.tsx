import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-green-500 p-2 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Hydroponics SmartGrow</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Leading IoT platform for smart hydroponic farming. Monitor, control, and optimize your crops with cutting-edge technology.
            </p>
            <div className="flex gap-4">
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-green-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-green-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-green-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-green-500 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-4">Products</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-green-500 transition-colors">IoT Sensors</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Dashboard Platform</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Mobile App</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">ESP32 Controllers</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Pricing Plans</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-green-500 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Community Forum</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Contact Support</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">123 AgriTech Boulevard<br />Silicon Valley, CA 94025</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">support@smartgrow.io</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2026 Hydroponics SmartGrow. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-green-500 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-green-500 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-green-500 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
