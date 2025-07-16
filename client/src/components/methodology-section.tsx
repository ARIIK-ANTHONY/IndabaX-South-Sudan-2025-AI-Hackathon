import { Card, CardContent } from "@/components/ui/card";
import { MEDICAL_FEATURES } from "@/lib/constants";

export default function MethodologySection() {
  const phases = [
    {
      number: 1,
      title: "Data Analysis",
      color: "bg-sudan-blue",
      items: [
        "24 medical features EDA",
        "Class distribution analysis", 
        "Correlation studies"
      ]
    },
    {
      number: 2,
      title: "Feature Engineering",
      color: "bg-sudan-yellow",
      items: [
        "13 medical domain features",
        "Blood ratio calculations",
        "StandardScaler normalization"
      ]
    },
    {
      number: 3,
      title: "Model Training",
      color: "bg-sudan-red",
      items: [
        "Ensemble learning approach",
        "Hyperparameter optimization",
        "Cross-validation testing"
      ]
    },
    {
      number: 4,
      title: "Optimization",
      color: "bg-medical-green",
      items: [
        "Distribution matching",
        "Confidence-based assignment",
        "Medical logic integration"
      ]
    }
  ];

  return (
    <section id="methodology" className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Technical Methodology</h2>
          <p className="text-xl text-gray-600">
            Four-phase approach combining domain expertise with advanced machine learning
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {phases.map((phase) => (
            <Card key={phase.number} className="shadow-lg">
              <CardContent className="p-8">
                <div className={`w-12 h-12 ${phase.color} rounded-full flex items-center justify-center text-white font-bold text-xl mb-6`}>
                  {phase.number}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{phase.title}</h3>
                <ul className="space-y-2 text-gray-600">
                  {phase.items.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className={`w-2 h-2 ${phase.color} rounded-full mt-2 flex-shrink-0`}></div>
                      <span>{item}</span>
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
