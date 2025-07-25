import { Card, CardContent } from "@/components/ui/card";
import { MEDICAL_FEATURES } from "@/lib/constants";

export default function MethodologySection() {
  const phases = [
    {
      number: 1,
      title: "Data Analysis",
      color: "bg-emerald-600",
      gradient: "bg-gradient-to-br from-emerald-600 to-teal-700",
      borderColor: "border-emerald-200",
      items: [
        "24 medical features EDA",
        "Class distribution analysis", 
        "Correlation studies"
      ]
    },
    {
      number: 2,
      title: "Feature Engineering", 
      color: "bg-teal-600",
      gradient: "bg-gradient-to-br from-teal-600 to-cyan-700",
      borderColor: "border-teal-200",
      items: [
        "13 medical domain features",
        "Blood ratio calculations",
        "StandardScaler normalization"
      ]
    },
    {
      number: 3,
      title: "Model Training",
      color: "bg-cyan-600",
      gradient: "bg-gradient-to-br from-cyan-600 to-emerald-700",
      borderColor: "border-cyan-200",
      items: [
        "Ensemble learning approach",
        "Hyperparameter optimization",
        "Cross-validation testing"
      ]
    },
    {
      number: 4,
      title: "Optimization",
      color: "bg-green-600",
      gradient: "bg-gradient-to-br from-green-600 to-emerald-700", 
      borderColor: "border-green-200",
      items: [
        "Distribution matching",
        "Confidence-based assignment",
        "Medical logic integration"
      ]
    }
  ];

  return (
    <section id="methodology" className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50/50 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/20 via-white to-gray-50/10"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Methodology</h2>
          <p className="text-xl text-gray-600">
            A comprehensive approach to blood disease detection using ensemble learning
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {phases.map((phase) => (
            <Card key={phase.number} className={`shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${phase.borderColor} bg-white hover:bg-gray-50`}>
              <CardContent className="p-8">
                <div className={`w-20 h-20 ${phase.gradient} rounded-3xl flex items-center justify-center text-white font-bold text-3xl mb-6 shadow-lg`}>
                  {phase.number}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{phase.title}</h3>
                <ul className="space-y-3 text-gray-800">
                  {phase.items.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className={`w-3 h-3 ${phase.color} rounded-full mt-1.5 flex-shrink-0`}></div>
                      <span className="text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Technical Architecture */}
        <Card className="mt-16 shadow-lg">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Solution Architecture</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Ensemble Models</h4>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900">Random Forest Classifier</h5>
                    <div className="text-sm text-gray-600 mt-2 space-y-1">
                      <p>• n_estimators: 500</p>
                      <p>• max_depth: 20</p>
                      <p>• bootstrap: True</p>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900">Gradient Boosting Classifier</h5>
                    <div className="text-sm text-gray-600 mt-2 space-y-1">
                      <p>• n_estimators: 300</p>
                      <p>• learning_rate: 0.05</p>
                      <p>• max_depth: 8</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Medical Features Created</h4>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  {MEDICAL_FEATURES.map((feature, index) => (
                    <div key={index} className="bg-gray-50 rounded p-2">{feature}</div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
