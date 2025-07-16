import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, Activity, Clock, AlertTriangle } from "lucide-react";

interface RealtimeData {
  totalPredictions: number;
  accuracyRate: number;
  diseaseBreakdown: string;
  avgConfidence: number;
  recentPredictions: any[];
  timestamp: Date;
}

export default function RealTimeMetrics() {
  const [metrics, setMetrics] = useState<RealtimeData[]>([]);

  // Fetch live metrics every 3 seconds
  const { data: currentMetrics, isLoading } = useQuery({
    queryKey: ["/api/live-metrics"],
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
  });

  // Fetch recent predictions
  const { data: recentPredictions } = useQuery({
    queryKey: ["/api/recent-predictions"],
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });

  // Fetch disease distribution
  const { data: diseaseDistribution } = useQuery({
    queryKey: ["/api/disease-distribution"],
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (currentMetrics) {
      setMetrics(prev => {
        const newMetrics = [...prev, currentMetrics];
        return newMetrics.slice(-20); // Keep last 20 data points
      });
    }
  }, [currentMetrics]);

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="realtime" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Real-Time Analytics</h2>
            <p className="text-gray-600">Live system performance and predictions</p>
          </div>
          <Badge variant="outline" className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live Updates
          </Badge>
        </div>

        {/* Real-time metrics cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Predictions</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {currentMetrics?.totalPredictions?.toLocaleString() || 0}
                  </p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Active monitoring
                  </p>
                </div>
                <div className="w-12 h-12 bg-sudan-blue rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Model Accuracy</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {((currentMetrics?.accuracyRate || 0) * 100).toFixed(2)}%
                  </p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Above target
                  </p>
                </div>
                <div className="w-12 h-12 bg-medical-green rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {((currentMetrics?.avgConfidence || 0) * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-blue-600 flex items-center mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    High confidence
                  </p>
                </div>
                <div className="w-12 h-12 bg-sudan-yellow rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Live performance chart */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Over Time</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics}>
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleString()}
                      formatter={(value: number, name: string) => [
                        `${(value * 100).toFixed(2)}%`, 
                        name === 'accuracyRate' ? 'Accuracy' : 'Confidence'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="accuracyRate" 
                      stroke="#059669" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Accuracy"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="avgConfidence" 
                      stroke="#1e40af" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Confidence"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Disease distribution */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Current Disease Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={diseaseDistribution || []}>
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} cases`, 'Count']} />
                    <Bar dataKey="value" fill="#1e40af" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent predictions table */}
        <Card className="shadow-lg mt-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Latest Predictions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Time</th>
                    <th className="px-6 py-3">Prediction</th>
                    <th className="px-6 py-3">Confidence</th>
                    <th className="px-6 py-3">Glucose</th>
                    <th className="px-6 py-3">Hemoglobin</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(recentPredictions || []).slice(0, 10).map((prediction: any, index: number) => (
                    <tr key={prediction.id || index} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {new Date(prediction.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={prediction.prediction === 'Healthy' ? 'default' : 'destructive'}>
                          {prediction.prediction}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${prediction.confidence * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{(prediction.confidence * 100).toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{prediction.glucose?.toFixed(1)} mg/dL</td>
                      <td className="px-6 py-4">{prediction.hemoglobin?.toFixed(1)} g/dL</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Processed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}