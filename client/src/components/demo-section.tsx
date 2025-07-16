import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PredictionForm {
  glucose: number;
  hemoglobin: number;
  platelets: number;
  cholesterol: number;
  whiteBloodCells: number;
  hematocrit: number;
}

interface PredictionResult {
  prediction: string;
  confidence: number;
}

export default function DemoSection() {
  const [formData, setFormData] = useState<PredictionForm>({
    glucose: 0,
    hemoglobin: 0,
    platelets: 0,
    cholesterol: 0,
    whiteBloodCells: 0,
    hematocrit: 0,
  });
  const [result, setResult] = useState<PredictionResult | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const predictMutation = useMutation({
    mutationFn: async (data: PredictionForm) => {
      const response = await apiRequest("POST", "/api/predictions", data);
      return response.json();
    },
    onSuccess: (data) => {
      setResult({
        prediction: data.prediction,
        confidence: data.confidence,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/predictions"] });
      toast({
        title: "Prediction Complete",
        description: "Blood disease classification has been generated.",
      });
    },
    onError: () => {
      toast({
        title: "Prediction Failed",
        description: "Please check your input values and try again.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof PredictionForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(e.target.value) || 0
    }));
  };

  const handlePredict = () => {
    // Validate inputs
    const values = Object.values(formData);
    if (values.some(v => v <= 0)) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid positive values for all medical parameters.",
        variant: "destructive",
      });
      return;
    }

    predictMutation.mutate(formData);
  };

  return (
    <section id="demo" className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-primary/3 to-medical-green/3"></div>
      <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-success/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-primary/10 rounded-full border border-primary/20 mb-6">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-primary">Live AI Demo</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black text-neutral-900 mb-6">
            Test Our <span className="text-gradient">AI Model</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto font-medium leading-relaxed">
            Experience real-time blood disease classification. Enter medical parameters and get instant AI predictions with confidence scoring.
          </p>
        </div>

        <Card className="glass-card rounded-3xl border-0 max-w-6xl mx-auto floating-shadow-lg">
          <CardContent className="p-12">
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-neutral-900 mb-4">Medical Parameters Input</h3>
              <p className="text-lg text-neutral-600 mb-8">Enter patient blood work values to receive AI-powered disease classification</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <div className="slide-in-left">
                <Label htmlFor="glucose" className="text-lg font-bold text-neutral-800 mb-4 block">
                  🩸 Glucose <span className="text-neutral-500 font-medium">(mg/dL)</span>
                </Label>
                <Input
                  id="glucose"
                  type="number"
                  placeholder="70 - 200"
                  value={formData.glucose || ""}
                  onChange={handleInputChange("glucose")}
                  className="h-14 text-lg border-2 border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/20 rounded-2xl bg-white/80 transition-all duration-200"
                />
              </div>
              
              <div className="slide-in-left" style={{ animationDelay: '0.1s' }}>
                <Label htmlFor="hemoglobin" className="text-lg font-bold text-neutral-800 mb-4 block">
                  🔴 Hemoglobin <span className="text-neutral-500 font-medium">(g/dL)</span>
                </Label>
                <Input
                  id="hemoglobin"
                  type="number"
                  placeholder="8.0 - 18.0"
                  value={formData.hemoglobin || ""}
                  onChange={handleInputChange("hemoglobin")}
                  className="h-14 text-lg border-2 border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/20 rounded-2xl bg-white/80 transition-all duration-200"
                />
              </div>
              
              <div className="slide-in-left" style={{ animationDelay: '0.2s' }}>
                <Label htmlFor="platelets" className="text-lg font-bold text-neutral-800 mb-4 block">
                  🟡 Platelets <span className="text-neutral-500 font-medium">(×10³/μL)</span>
                </Label>
                <Input
                  id="platelets"
                  type="number"
                  placeholder="150 - 450"
                  value={formData.platelets || ""}
                  onChange={handleInputChange("platelets")}
                  className="h-14 text-lg border-2 border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/20 rounded-2xl bg-white/80 transition-all duration-200"
                />
              </div>
              
              <div className="slide-in-right">
                <Label htmlFor="cholesterol" className="text-lg font-bold text-neutral-800 mb-4 block">
                  💛 Cholesterol <span className="text-neutral-500 font-medium">(mg/dL)</span>
                </Label>
                <Input
                  id="cholesterol"
                  type="number"
                  placeholder="100 - 300"
                  value={formData.cholesterol || ""}
                  onChange={handleInputChange("cholesterol")}
                  className="h-14 text-lg border-2 border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/20 rounded-2xl bg-white/80 transition-all duration-200"
                />
              </div>
              
              <div className="slide-in-right" style={{ animationDelay: '0.1s' }}>
                <Label htmlFor="whiteBloodCells" className="text-lg font-bold text-neutral-800 mb-4 block">
                  ⚪ White Blood Cells <span className="text-neutral-500 font-medium">(×10³/μL)</span>
                </Label>
                <Input
                  id="whiteBloodCells"
                  type="number"
                  placeholder="4.0 - 11.0"
                  value={formData.whiteBloodCells || ""}
                  onChange={handleInputChange("whiteBloodCells")}
                  className="h-14 text-lg border-2 border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/20 rounded-2xl bg-white/80 transition-all duration-200"
                />
              </div>
              
              <div className="slide-in-right" style={{ animationDelay: '0.2s' }}>
                <Label htmlFor="hematocrit" className="text-lg font-bold text-neutral-800 mb-4 block">
                  🔵 Hematocrit <span className="text-neutral-500 font-medium">(%)</span>
                </Label>
                <Input
                  id="hematocrit"
                  type="number"
                  placeholder="35 - 50"
                  value={formData.hematocrit || ""}
                  onChange={handleInputChange("hematocrit")}
                  className="h-14 text-lg border-2 border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/20 rounded-2xl bg-white/80 transition-all duration-200"
                />
              </div>
            </div>

            <div className="text-center mb-12">
              <Button
                onClick={handlePredict}
                disabled={predictMutation.isPending}
                className="bg-gradient-primary text-white px-16 py-6 rounded-2xl text-xl font-bold button-hover floating-shadow-lg border-0 disabled:opacity-50 disabled:cursor-not-allowed bounce-in"
              >
                {predictMutation.isPending ? (
                  <div className="flex items-center gap-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Analyzing Blood Work...
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Brain className="w-6 h-6" />
                    Get AI Diagnosis
                  </div>
                )}
              </Button>
            </div>

            {result && (
              <div className="border-0 rounded-2xl p-8 bg-gradient-to-br from-blue-50 to-green-50 shadow-xl slide-up">
                <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  🔬 AI Prediction Results
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Predicted Condition</p>
                    <p className="text-3xl font-bold text-gradient">{result.prediction}</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Confidence Score</p>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 bg-gray-200 rounded-full h-6">
                        <div 
                          className="bg-gradient-sudan h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2" 
                          style={{ width: `${result.confidence * 100}%` }}
                        >
                          <span className="text-white text-xs font-bold">
                            {result.confidence > 0.3 ? `${(result.confidence * 100).toFixed(1)}%` : ''}
                          </span>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-gray-900">
                        {(result.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-6 bg-white/70 backdrop-blur-sm rounded-xl border-l-4 border-l-sudan-yellow">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <strong className="text-sudan-blue">⚠️ Medical Disclaimer:</strong> This is an AI demonstration for educational purposes only. Always consult qualified healthcare professionals for medical diagnosis and treatment decisions.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
