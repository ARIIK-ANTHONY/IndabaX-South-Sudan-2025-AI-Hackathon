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
    <section id="demo" className="py-24 bg-gradient-to-br from-wellness-mint/20 to-soft-teal/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 slide-up">
          <h2 className="text-5xl font-bold text-gradient-primary mb-6">Interactive Prediction Demo</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience our advanced blood disease classification model in real-time with live AI predictions
          </p>
        </div>

        <Card className="card-hover border-0 shadow-2xl max-w-5xl mx-auto bg-white/90 backdrop-blur-sm">
          <CardContent className="p-10">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Medical Parameters Input</h3>
              <p className="text-gray-600 mb-6">Enter the patient's medical test results below for AI analysis</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              <div>
                <Label htmlFor="glucose" className="block text-sm font-semibold text-gray-700 mb-2">
                  Glucose (mg/dL)
                </Label>
                <Input
                  id="glucose"
                  type="number"
                  placeholder="85-180"
                  value={formData.glucose || ""}
                  onChange={handleInputChange("glucose")}
                  className="focus:ring-2 focus:ring-medical-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <Label htmlFor="hemoglobin" className="block text-sm font-semibold text-gray-700 mb-2">
                  Hemoglobin (g/dL)
                </Label>
                <Input
                  id="hemoglobin"
                  type="number"
                  placeholder="12-16"
                  value={formData.hemoglobin || ""}
                  onChange={handleInputChange("hemoglobin")}
                  className="focus:ring-2 focus:ring-medical-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <Label htmlFor="platelets" className="block text-sm font-semibold text-gray-700 mb-2">
                  Platelets (×10³/μL)
                </Label>
                <Input
                  id="platelets"
                  type="number"
                  placeholder="150-450"
                  value={formData.platelets || ""}
                  onChange={handleInputChange("platelets")}
                  className="focus:ring-2 focus:ring-medical-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <Label htmlFor="cholesterol" className="block text-sm font-semibold text-gray-700 mb-2">
                  Cholesterol (mg/dL)
                </Label>
                <Input
                  id="cholesterol"
                  type="number"
                  placeholder="150-250"
                  value={formData.cholesterol || ""}
                  onChange={handleInputChange("cholesterol")}
                  className="focus:ring-2 focus:ring-medical-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <Label htmlFor="whiteBloodCells" className="block text-sm font-semibold text-gray-700 mb-2">
                  White Blood Cells (×10³/μL)
                </Label>
                <Input
                  id="whiteBloodCells"
                  type="number"
                  placeholder="4-11"
                  value={formData.whiteBloodCells || ""}
                  onChange={handleInputChange("whiteBloodCells")}
                  className="focus:ring-2 focus:ring-medical-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <Label htmlFor="hematocrit" className="block text-sm font-semibold text-gray-700 mb-2">
                  Hematocrit (%)
                </Label>
                <Input
                  id="hematocrit"
                  type="number"
                  placeholder="35-45"
                  value={formData.hematocrit || ""}
                  onChange={handleInputChange("hematocrit")}
                  className="focus:ring-2 focus:ring-medical-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="text-center mb-10">
              <Button
                onClick={handlePredict}
                disabled={predictMutation.isPending}
                className="bg-gradient-primary hover:opacity-90 text-white px-12 py-4 rounded-xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                {predictMutation.isPending ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Brain className="w-6 h-6" />
                    Predict Disease
                  </div>
                )}
              </Button>
            </div>

            {result && (
              <div className="border-0 rounded-2xl p-8 bg-gradient-to-br from-wellness-mint/30 to-soft-teal/30 shadow-xl slide-up">
                <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  🔬 AI Prediction Results
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Predicted Condition</p>
                    <p className="text-3xl font-bold text-gradient-primary">{result.prediction}</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Confidence Score</p>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 bg-gray-200 rounded-full h-6">
                        <div 
                          className="bg-gradient-healing h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2" 
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
                <div className="mt-6 p-6 bg-white/70 backdrop-blur-sm rounded-xl border-l-4 border-l-warning-amber">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <strong className="text-medical-primary">⚠️ Medical Disclaimer:</strong> This is an AI demonstration for educational purposes only. Always consult qualified healthcare professionals for medical diagnosis and treatment decisions.
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
