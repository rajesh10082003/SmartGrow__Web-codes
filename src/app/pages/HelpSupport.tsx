import { ArrowLeft, MessageCircle, Mail, Phone, BookOpen, Video, FileText, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";

export function HelpSupport() {
  const navigate = useNavigate();

  const supportOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team",
      color: "bg-green-100 text-green-600",
      action: () => {},
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "support@hydroponicssmartgrow.com",
      color: "bg-blue-100 text-blue-600",
      action: () => window.open("mailto:support@hydroponicssmartgrow.com"),
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "+1 (555) 123-4567",
      color: "bg-purple-100 text-purple-600",
      action: () => window.open("tel:+15551234567"),
    },
  ];

  const resourceOptions = [
    {
      icon: BookOpen,
      title: "Knowledge Base",
      description: "Browse articles and guides",
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Watch how-to videos",
    },
    {
      icon: FileText,
      title: "Documentation",
      description: "Technical documentation",
    },
  ];

  const faqs = [
    {
      question: "How do I set up my first hydroponic system?",
      answer: "Start by connecting your sensors via WiFi or Bluetooth, then add your crops through the dashboard.",
    },
    {
      question: "What do I do if a sensor goes offline?",
      answer: "Check the battery level and WiFi connection. Try restarting the device or re-pairing it.",
    },
    {
      question: "How often should I calibrate my pH sensor?",
      answer: "We recommend calibrating your pH sensor every 2-4 weeks for optimal accuracy.",
    },
    {
      question: "Can I monitor multiple systems?",
      answer: "Yes! You can add multiple hydroponic systems and switch between them in the dashboard.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/settings")}
            className="text-green-600 hover:text-green-700 text-sm mb-2 inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Settings
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-600 mt-2">Get help with your hydroponic system</p>
        </div>

        {/* Contact Support */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {supportOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <button
                  key={index}
                  onClick={option.action}
                  className="p-4 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-gray-50 transition-all text-left"
                >
                  <div className={`${option.color} p-3 rounded-lg inline-flex mb-3`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{option.title}</h3>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Help Resources */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Help Resources</h2>
          <div className="divide-y divide-gray-200">
            {resourceOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <button
                  key={index}
                  className="w-full py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <Icon className="h-5 w-5 text-gray-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{option.title}</h3>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-sm text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div className="mt-6 bg-gray-100 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-600">
            Hydroponics SmartGrow v2.1.0 | © 2026 All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
