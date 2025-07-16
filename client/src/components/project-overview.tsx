import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ProjectOverview() {
  return (
    <section id="overview" className="py-20 bg-gradient-to-br from-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Project Overview</h2>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto">
            Tackling the critical healthcare challenge of automated blood disease diagnosis using state-of-the-art AI techniques
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Problem Statement</h3>
            <p className="text-gray-900 mb-6 leading-relaxed">
              Develop an AI model to classify blood diseases based on medical laboratory test results, 
              enabling faster and more accurate diagnosis in healthcare settings. Our solution addresses 
              the critical need for automated diagnostic tools in resource-constrained environments.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                  <Check className="text-white" size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Medical Domain Expertise</h4>
                  <p className="text-gray-800">Custom health indicators and blood ratios used by medical professionals</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                  <Check className="text-white" size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Ensemble Learning</h4>
                  <p className="text-gray-800">Random Forest + Gradient Boosting with soft voting for robust predictions</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                  <Check className="text-white" size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Strategic Optimization</h4>
                  <p className="text-gray-800">Distribution matching and confidence-based assignment for competition excellence</p>
                </div>
              </div>
            </div>
          </div>

          <Card className="shadow-xl border-0 bg-white">
            <CardContent className="p-8">
              <h4 className="text-xl font-bold text-gray-900 mb-6">Dataset Overview</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-700">Training Samples</span>
                  <span className="font-semibold text-gray-900">2,351</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-700">Test Samples</span>
                  <span className="font-semibold text-gray-900">486</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-700">Medical Features</span>
                  <span className="font-semibold text-gray-900">24</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-700">Engineered Features</span>
                  <span className="font-semibold text-gray-900">13</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-700">Disease Classes</span>
                  <span className="font-semibold text-gray-900">6</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
