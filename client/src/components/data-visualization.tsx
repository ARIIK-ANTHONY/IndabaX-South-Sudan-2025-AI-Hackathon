import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { DISEASE_CLASSES, FEATURE_IMPORTANCE } from "@/lib/constants";
import { TrendingUp, CheckCircle, RotateCcw, Target } from "lucide-react";

export default function DataVisualization() {
  return (
    <section id="data-viz" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Data Insights & Visualizations</h2>
          <p className="text-xl text-gray-600">
            Comprehensive analysis of blood disease patterns and model performance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Class Distribution Chart */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Disease Class Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={DISEASE_CLASSES}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="percentage"
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      labelLine={false}
                    >
                      {DISEASE_CLASSES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>Dataset shows significant class imbalance with Diabetes being the most prevalent condition (60.5%)</p>
              </div>
            </CardContent>
          </Card>

          {/* Feature Importance Chart */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Top Medical Features</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={FEATURE_IMPORTANCE}>
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="importance" fill="hsl(228, 84%, 35%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>Mean Corpuscular Hemoglobin and Hematocrit emerge as the most predictive features</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Model Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-medical-green to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Training Accuracy</p>
                <p className="text-3xl font-bold">100.0%</p>
              </div>
              <TrendingUp size={32} className="text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-sudan-blue to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Validation Accuracy</p>
                <p className="text-3xl font-bold">100.0%</p>
              </div>
              <CheckCircle size={32} className="text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-sudan-yellow to-yellow-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Cross-Validation</p>
                <p className="text-3xl font-bold">5-Fold</p>
              </div>
              <RotateCcw size={32} className="text-yellow-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-sudan-red to-red-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Target Score</p>
                <p className="text-3xl font-bold">98.55%+</p>
              </div>
              <Target size={32} className="text-red-200" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
