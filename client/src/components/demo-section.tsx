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
    <section id="demo" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Interactive Prediction Demo</h2>
          <p className="text-xl text-gray-600">
            Experience our blood disease classification model in action
          </p>
        </div>

        <Card className="shadow-xl max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                  className="focus:ring-2 focus:ring-sudan-blue focus:border-transparent"
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
                  className="focus:ring-2 focus:ring-sudan-blue focus:border-transparent"
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
                  className="focus:ring-2 focus:ring-sudan-blue focus:border-transparent"
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
                  className="focus:ring-2 focus:ring-sudan-blue focus:border-transparent"
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
                  className="focus:ring-2 focus:ring-sudan-blue focus:border-transparent"
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
                  className="focus:ring-2 focus:ring-sudan-blue focus:border-transparent"
                />
              </div>
            </div>

            <div className="text-center mb-8">
              <Button
                onClick={handlePredict}
                disabled={predictMutation.isPending}
                className="bg-sudan-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Brain className="mr-2" size={16} />
                {predictMutation.isPending ? "Predicting..." : "Predict Disease"}
              </Button>
            </div>

            {result && (
              <div className="border-2 border-sudan-blue rounded-lg p-6 bg-blue-50">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Prediction Results</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Predicted Condition</p>
                    <p className="text-2xl font-bold sudan-blue">{result.prediction}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Confidence Score</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-sudan-blue h-4 rounded-full transition-all duration-300" 
                          style={{ width: `${result.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-lg font-semibold text-gray-900">
                        {(result.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-white rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Note:</strong> This is a demonstration. Always consult healthcare professionals for medical diagnosis.
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
