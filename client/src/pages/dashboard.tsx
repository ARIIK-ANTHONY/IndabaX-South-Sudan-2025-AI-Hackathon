import NavigationHeader from "@/components/navigation-header";
import HeroSection from "@/components/hero-section";
import ProjectOverview from "@/components/project-overview";
import TeamSection from "@/components/team-section";
import DataVisualization from "@/components/data-visualization";
import MethodologySection from "@/components/methodology-section";
import DemoSection from "@/components/demo-section";
import ResultsSection from "@/components/results-section";
import Footer from "@/components/footer";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      <HeroSection />
      <ProjectOverview />
      <TeamSection />
      <DataVisualization />
      <MethodologySection />
      <DemoSection />
      <ResultsSection />
      <Footer />
    </div>
  );
}
