import { useQuery } from "@tanstack/react-query";
import { Play, Microscope } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  return (
    <section className="bg-gradient-to-br from-sudan-blue to-blue-800 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Blood Disease Classification
            <span className="block sudan-yellow mt-2">AI Solution</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto">
            Advanced machine learning solution for automated blood disease diagnosis using ensemble methods and medical domain expertise
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
              <div className="text-3xl font-bold sudan-yellow">{stats?.targetAccuracy || 98.55}%+</div>
              <div className="text-sm text-blue-200">Target Accuracy</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
              <div className="text-3xl font-bold sudan-yellow">{stats?.medicalFeatures || 24}</div>
              <div className="text-sm text-blue-200">Medical Parameters</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
              <div className="text-3xl font-bold sudan-yellow">{stats?.diseaseClasses || 6}</div>
              <div className="text-sm text-blue-200">Disease Types</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
              <div className="text-3xl font-bold sudan-yellow">{stats?.totalSamples || 2351}</div>
              <div className="text-sm text-blue-200">Training Samples</div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              asChild
              className="bg-sudan-yellow text-sudan-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              <a href="#demo">
                <Play className="mr-2" size={16} />
                Try Demo
              </a>
            </Button>
            <Button 
              variant="outline"
              asChild
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-sudan-blue transition-colors"
            >
              <a href="#methodology">
                <Microscope className="mr-2" size={16} />
                View Methodology
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
