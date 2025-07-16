import { Activity, Brain, Shield, Zap, TrendingUp, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning ensemble methods for accurate blood disease classification",
      color: "from-medical-primary to-trust-blue",
      bgColor: "bg-medical-primary"
    },
    {
      icon: Activity,
      title: "Real-time Monitoring",
      description: "Live dashboard with WebSocket streaming for instant prediction results and analytics",
      color: "from-medical-secondary to-calm-teal",
      bgColor: "bg-medical-secondary"
    },
    {
      icon: Shield,
      title: "Medical Grade Accuracy",
      description: "98.55%+ accuracy with confidence scoring using domain-specific medical features",
      color: "from-healing-green to-success-green",
      bgColor: "bg-healing-green"
    },
    {
      icon: Zap,
      title: "Instant Predictions",
      description: "Fast classification of 6 blood disease types with immediate confidence metrics",
      color: "from-info-cyan to-soft-teal",
      bgColor: "bg-info-cyan"
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Comprehensive metrics tracking with disease distribution and prediction trends",
      color: "from-warning-amber to-alert-orange",
      bgColor: "bg-warning-amber"
    },
    {
      icon: Users,
      title: "Healthcare Impact",
      description: "Designed for resource-constrained environments to improve diagnostic accessibility",
      color: "from-sudan-blue to-medical-primary",
      bgColor: "bg-sudan-blue"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-soft-teal/5 to-wellness-mint/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gradient-primary mb-4">Key Features</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive AI solution combining medical expertise with cutting-edge technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="group shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-medical-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
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