import { Activity, Brain, Shield, Zap, TrendingUp, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning ensemble methods for accurate blood disease classification",
      color: "text-red-600",
      bgColor: "bg-red-600",
      borderColor: "border-red-300"
    },
    {
      icon: Activity,
      title: "Real-time Monitoring", 
      description: "Live dashboard with WebSocket streaming for instant prediction results and analytics",
      color: "text-red-600",
      bgColor: "bg-red-600",
      borderColor: "border-red-300"
    },
    {
      icon: Shield,
      title: "Medical Grade Accuracy",
      description: "98.55%+ accuracy with confidence scoring using domain-specific medical features",
      color: "text-blue-600",
      bgColor: "bg-blue-600",
      borderColor: "border-blue-300"
    },
    {
      icon: Zap,
      title: "Instant Predictions",
      description: "Fast classification of 6 blood disease types with immediate confidence metrics",
      color: "text-blue-600",
      bgColor: "bg-blue-600",
      borderColor: "border-blue-300"
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Comprehensive metrics tracking with disease distribution and prediction trends",
      color: "text-green-600",
      bgColor: "bg-green-600",
      borderColor: "border-green-300"
    },
    {
      icon: Users,
      title: "Healthcare Impact",
      description: "Designed for resource-constrained environments to improve diagnostic accessibility",
      color: "text-green-600",
      bgColor: "bg-green-600",
      borderColor: "border-green-300"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-white border-b border-gray-200 relative overflow-hidden">
      {/* Clean, mobile-friendly background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 to-blue-50/30"></div>
        <div className="absolute top-32 left-32 w-24 h-24 bg-red-100 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-32 w-32 h-32 bg-blue-100 rounded-full blur-xl"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto">
            Comprehensive AI solution combining medical expertise with cutting-edge technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className={`group shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${feature.borderColor} bg-white hover:bg-gray-50`}
              >
                <CardContent className="p-8">
                  <div className={`w-20 h-20 ${feature.bgColor} rounded-3xl flex items-center justify-center mb-6 shadow-lg border-2 border-white group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-800 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}