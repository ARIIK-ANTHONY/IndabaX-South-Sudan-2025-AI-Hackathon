import { useQuery } from "@tanstack/react-query";
import { Play, Microscope } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-medical-green/5"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-success/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-warning/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-primary/10 rounded-full border border-primary/20 mb-8">
              <div className="w-2 h-2 bg-gradient-success rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-primary">IndabaX South Sudan 2025 • AI Hackathon</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9]">
              <span className="block text-neutral-900">Blood Disease</span>
              <span className="block text-gradient text-6xl md:text-7xl mt-2">
                Classification AI
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-16 text-neutral-600 max-w-4xl mx-auto leading-relaxed font-medium">
              Advanced machine learning solution for automated blood disease diagnosis using 
              <span className="text-primary font-bold"> ensemble methods</span> and 
              <span className="text-medical-green font-bold"> medical domain expertise</span> with real-time monitoring
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-6xl mx-auto fade-in-delayed">
            <StatCard 
              value={`${stats?.targetAccuracy || 98.55}%+`}
              label="Target Accuracy"
              color="primary"
              delay="0.1s"
            />
            <StatCard 
              value={stats?.medicalFeatures || 24}
              label="Medical Parameters"
              color="success"
              delay="0.2s"
            />
            <StatCard 
              value={stats?.diseaseClasses || 6}
              label="Disease Types"
              color="warning"
              delay="0.3s"
            />
            <StatCard 
              value={stats?.totalSamples || 2351}
              label="Training Samples"
              color="purple"
              delay="0.4s"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 bounce-in">
            <Button 
              asChild
              className="bg-gradient-primary text-white px-12 py-6 rounded-2xl text-lg font-bold button-hover floating-shadow-lg border-0"
            >
              <a href="#demo" className="inline-flex items-center gap-3">
                <Play className="w-6 h-6" />
                Try Live Demo
              </a>
            </Button>
            <Button 
              variant="outline"
              asChild
              className="border-2 border-primary/30 text-primary px-12 py-6 rounded-2xl text-lg font-bold button-hover glass-card"
            >
              <a href="#live-dashboard" className="inline-flex items-center gap-3">
                <Microscope className="w-6 h-6" />
                View Dashboard
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, label, color, delay }: { 
  value: string | number, 
  label: string, 
  color: 'primary' | 'success' | 'warning' | 'purple',
  delay: string 
}) {
  const colorClasses = {
    primary: 'from-primary/10 to-primary/5 border-primary/20 text-primary',
    success: 'from-medical-green/10 to-medical-green/5 border-medical-green/20 text-medical-green',
    warning: 'from-sudan-yellow/10 to-sudan-yellow/5 border-sudan-yellow/20 text-sudan-yellow',
    purple: 'from-accent-purple/10 to-accent-purple/5 border-accent-purple/20 text-accent-purple'
  };

  return (
    <div 
      className={`glass-card rounded-3xl p-8 card-hover border ${colorClasses[color]} scale-in`}
      style={{ animationDelay: delay }}
    >
      <div className="text-5xl font-black mb-3">{value}</div>
      <div className="text-sm font-semibold text-neutral-600 uppercase tracking-wider">{label}</div>
    </div>
  );
}
