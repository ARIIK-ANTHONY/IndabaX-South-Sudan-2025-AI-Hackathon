import { useQuery } from "@tanstack/react-query";
import { Play, Microscope } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  return (
    <section className="relative bg-gradient-to-br from-sudan-blue via-blue-700 to-medical-blue text-white py-24 overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center slide-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Blood Disease Classification
            <span className="block text-gradient bg-gradient-to-r from-sudan-yellow to-yellow-300 bg-clip-text text-transparent mt-4">
              AI Solution
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-5xl mx-auto leading-relaxed">
            Advanced machine learning solution for automated blood disease diagnosis using ensemble methods and medical domain expertise with real-time monitoring
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 card-hover border border-white/20">
              <div className="text-4xl font-bold text-sudan-yellow mb-2">{stats?.targetAccuracy || 98.55}%+</div>
              <div className="text-sm text-blue-200 font-medium">Target Accuracy</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 card-hover border border-white/20">
              <div className="text-4xl font-bold text-sudan-yellow mb-2">{stats?.medicalFeatures || 24}</div>
              <div className="text-sm text-blue-200 font-medium">Medical Parameters</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 card-hover border border-white/20">
              <div className="text-4xl font-bold text-sudan-yellow mb-2">{stats?.diseaseClasses || 6}</div>
              <div className="text-sm text-blue-200 font-medium">Disease Types</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 card-hover border border-white/20">
              <div className="text-4xl font-bold text-sudan-yellow mb-2">{stats?.totalSamples || 2351}</div>
              <div className="text-sm text-blue-200 font-medium">Training Samples</div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            <Button 
              asChild
              className="bg-sudan-yellow text-sudan-black px-10 py-4 rounded-xl text-lg font-bold hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              <a href="#demo">
                <Play className="mr-3" size={20} />
                Try Live Demo
              </a>
            </Button>
            <Button 
              variant="outline"
              asChild
              className="border-2 border-white text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-white hover:text-sudan-blue transition-all duration-300 transform hover:scale-105 backdrop-blur-sm bg-white/10"
            >
              <a href="#live-dashboard">
                <Microscope className="mr-3" size={20} />
                View Dashboard
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
