import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Github, Play } from "lucide-react";

export default function ResultsSection() {
  return (
    <section id="results" className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Results & Achievements</h2>
          <p className="text-xl text-gray-600">
            Championship-level performance with medical domain excellence
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Competition Results */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Competition Performance</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-medical-green to-green-600 rounded-lg text-white">
                  <div>
                    <p className="text-green-100">Expected Score</p>
                    <p className="text-3xl font-bold">98.55%+</p>
                  </div>
                  <Trophy size={32} className="text-green-200" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">100%</p>
                    <p className="text-sm text-gray-600">Training Accuracy</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">100%</p>
                    <p className="text-sm text-gray-600">Validation Accuracy</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Key Innovations</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-medical-green rounded-full mt-2"></div>
                      <span>Perfect distribution matching algorithm</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-medical-green rounded-full mt-2"></div>
                      <span>Medical domain-specific feature engineering</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-medical-green rounded-full mt-2"></div>
                      <span>Confidence-based prediction assignment</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Achievements */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Technical Excellence</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Model Architecture</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-700">Random Forest</span>
                      <span className="bg-sudan-blue text-white px-3 py-1 rounded-full text-sm">500 trees</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-700">Gradient Boosting</span>
                      <span className="bg-sudan-yellow text-white px-3 py-1 rounded-full text-sm">300 trees</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-700">Ensemble Method</span>
                      <span className="bg-medical-green text-white px-3 py-1 rounded-full text-sm">Soft Voting</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Feature Engineering</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-xl font-bold text-gray-900">24</p>
                      <p className="text-sm text-gray-600">Original Features</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-xl font-bold text-gray-900">13</p>
                      <p className="text-sm text-gray-600">Engineered Features</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Validation Strategy</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-sudan-blue rounded-full"></div>
                      <span className="text-gray-700">5-Fold Stratified Cross-Validation</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-sudan-blue to-blue-800 rounded-2xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Explore Our Solution</h3>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Dive deep into our codebase, methodology, and technical implementation. 
              All code and documentation available on GitHub.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                asChild
                className="bg-white text-sudan-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <a 
                  href="https://github.com/ARIIK-ANTHONY/IndabaX-South-Sudan-2025-AI-Hackathon"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2" size={16} />
                  View GitHub Repository
                </a>
              </Button>
              <Button 
                variant="outline"
                asChild
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-sudan-blue transition-colors"
              >
                <a href="#demo">
                  <Play className="mr-2" size={16} />
                  Try Interactive Demo
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
