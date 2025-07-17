import NavigationHeader from "@/components/navigation-header";
import HeroSection from "@/components/hero-section";
import ProjectOverview from "@/components/project-overview";
import FeaturesSection from "@/components/features-section";
import TeamSection from "@/components/team-section";
import DataVisualization from "@/components/data-visualization";
import LiveDashboard from "@/components/live-dashboard";
import RealTimeMetrics from "@/components/real-time-metrics";
import MethodologySection from "@/components/methodology-section";
import DemoSection from "@/components/demo-section";
import ResultsSection from "@/components/results-section";
import Footer from "@/components/footer";

export default function Dashboard() {
  return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 via-white to-gray-50/20"></div>
        {/* Subtle dot pattern */}
        <div className="absolute inset-0" 
             style={{
               backgroundImage: `radial-gradient(circle at 2px 2px, rgba(156, 163, 175, 0.08) 1px, transparent 0)`,
               backgroundSize: '50px 50px'
             }}>
        </div>
        {/* Soft organic shapes */}
        <div className="absolute top-32 left-32 w-40 h-40 bg-gray-200/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-32 h-32 bg-gray-300/15 rounded-full blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
      
      <div className="relative z-10">
        <NavigationHeader />
        <main className="pt-20"> {/* Add padding-top for fixed navigation */}
        <HeroSection />
        <LiveDashboard />
        <RealTimeMetrics />
        <ProjectOverview />
        <FeaturesSection />
        <TeamSection />
        <DataVisualization />
        <MethodologySection />
        <DemoSection />
        <ResultsSection />
        <Footer />
        </main>
      </div>
    </div>
  );
}
