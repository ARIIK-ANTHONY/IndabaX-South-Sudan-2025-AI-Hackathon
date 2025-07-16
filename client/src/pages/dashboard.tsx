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
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
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
    </div>
  );
}
