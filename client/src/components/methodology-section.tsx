import { Card, CardContent } from "@/components/ui/card";
import { MEDICAL_FEATURES } from "@/lib/constants";

export default function MethodologySection() {
  const phases = [
    {
      number: 1,
      title: "Data Analysis",
      color: "bg-medical-primary",
      gradient: "bg-gradient-to-br from-medical-primary to-trust-blue",
      items: [
        "24 medical features EDA",
        "Class distribution analysis", 
        "Correlation studies"
      ]
    },
    {
      number: 2,
      title: "Feature Engineering",
      color: "bg-medical-secondary",
      gradient: "bg-gradient-to-br from-medical-secondary to-calm-teal",
      items: [
        "13 medical domain features",
        "Blood ratio calculations",
        "StandardScaler normalization"
      ]
    },
    {
      number: 3,
      title: "Model Training",
      color: "bg-healing-green",
      gradient: "bg-gradient-to-br from-healing-green to-success-green",
      items: [
        "Ensemble learning approach",
        "Hyperparameter optimization",
        "Cross-validation testing"
      ]
    },
    {
      number: 4,
      title: "Optimization",
      color: "bg-info-cyan",
      gradient: "bg-gradient-to-br from-info-cyan to-soft-teal",
      items: [
        "Distribution matching",
        "Confidence-based assignment",
        "Medical logic integration"
      ]
    }
  ];

  return (
    <section id="methodology" className="py-20 bg-gradient-to-br from-wellness-mint/10 to-soft-teal/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gradient-primary mb-4">Technical Methodology</h2>
          <p className="text-xl text-gray-600">
            Four-phase approach combining domain expertise with advanced machine learning
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {phases.map((phase) => (
            <Card key={phase.number} className="shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className={`w-16 h-16 ${phase.gradient} rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-6 shadow-lg`}>
                  {phase.number}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{phase.title}</h3>
                <ul className="space-y-3 text-gray-600">
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
