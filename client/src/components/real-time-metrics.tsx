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
    <section id="realtime" className="py-16 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div className="slide-up">
            <h2 className="text-4xl font-bold text-gradient mb-3">Real-Time Analytics</h2>
            <p className="text-lg text-gray-600">Live system performance and AI predictions</p>
          </div>
          <Badge variant="outline" className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-green-200 text-green-700 px-4 py-2">
            <div className="w-3 h-3 bg-green-500 rounded-full pulse-ring"></div>
            Live Updates
          </Badge>
        </div>

        {/* Real-time metrics cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="card-hover border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Total Predictions</p>
                  <p className="text-4xl font-bold text-gray-900 mb-2">
                    {currentMetrics?.totalPredictions?.toLocaleString() || 0}
                  </p>
                  <p className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Active monitoring
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-sudan rounded-2xl flex items-center justify-center shadow-lg">
                  <Activity className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Model Accuracy</p>
                  <p className="text-4xl font-bold text-gray-900 mb-2">
                    {((currentMetrics?.accuracyRate || 0) * 100).toFixed(2)}%
                  </p>
                  <p className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Above target
                  </p>
                </div>
                <div className="w-16 h-16 bg-medical-green rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Avg Confidence</p>
                  <p className="text-4xl font-bold text-gray-900 mb-2">
                    {((currentMetrics?.avgConfidence || 0) * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-blue-600 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    High confidence
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-medical rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Live performance chart */}
          <Card className="card-hover border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Performance Over Time</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-medical-green rounded-full"></div>
                    <span className="text-sm font-medium text-gray-600">Accuracy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-sudan-blue rounded-full"></div>
                    <span className="text-sm font-medium text-gray-600">Confidence</span>
                  </div>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleString()}
                      formatter={(value: number, name: string) => [
                        `${(value * 100).toFixed(2)}%`, 
                        name === 'accuracyRate' ? 'Accuracy' : 'Confidence'
                      ]}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="accuracyRate" 
                      stroke="hsl(142, 76%, 36%)" 
                      strokeWidth={3}
                      dot={{ r: 5, fill: 'hsl(142, 76%, 36%)', strokeWidth: 2 }}
                      activeDot={{ r: 7, fill: 'hsl(142, 76%, 36%)' }}
                      name="Accuracy"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="avgConfidence" 
                      stroke="hsl(217, 91%, 60%)" 
                      strokeWidth={3}
                      dot={{ r: 5, fill: 'hsl(217, 91%, 60%)', strokeWidth: 2 }}
                      activeDot={{ r: 7, fill: 'hsl(217, 91%, 60%)' }}
                      name="Confidence"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Disease distribution */}
          <Card className="card-hover border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Disease Distribution</h3>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Real-time
                </Badge>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={diseaseDistribution || []} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={80}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} cases`, 'Count']}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="hsl(217, 91%, 60%)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent predictions table */}
        <Card className="card-hover border-0 shadow-xl bg-white/90 backdrop-blur-sm mt-12">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Latest Predictions</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full pulse-ring"></div>
                <span className="text-sm font-medium text-gray-600">Live Feed</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wide">Time</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wide">Prediction</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wide">Confidence</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wide">Glucose</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wide">Hemoglobin</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(recentPredictions || []).slice(0, 8).map((prediction: any, index: number) => (
                    <tr key={prediction.id || index} className="hover:bg-gray-50/50 transition-colors duration-150">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {new Date(prediction.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant={prediction.prediction === 'Healthy' ? 'default' : 'destructive'}
                          className="font-medium"
                        >
                          {prediction.prediction}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-300" 
                              style={{ width: `${prediction.confidence * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium min-w-[45px]">
                            {(prediction.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium">{prediction.glucose?.toFixed(1)} <span className="text-gray-500">mg/dL</span></td>
                      <td className="px-6 py-4 font-medium">{prediction.hemoglobin?.toFixed(1)} <span className="text-gray-500">g/dL</span></td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                          ✓ Processed
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