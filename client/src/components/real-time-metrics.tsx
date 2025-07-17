import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, Activity, Clock, AlertTriangle, Zap, Users, Target } from "lucide-react";
import { motion } from "framer-motion";

interface RealtimeData {
  totalPredictions: number;
  accuracyRate: number;
  diseaseBreakdown: string;
  avgConfidence: number;
  recentPredictions: any[];
  timestamp: Date;
}

interface LiveMetricsData {
  totalPredictions: number;
  accuracyRate: number;
  diseaseBreakdown: string;
  avgConfidence: number;
  recentPredictions: any[];
  timestamp: string | Date;
}

interface DiseaseDistribution {
  name: string;
  value: number;
  percentage: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 120
    }
  }
};

export default function RealTimeMetrics() {
  const [metrics, setMetrics] = useState<RealtimeData[]>([]);

  // Fetch live metrics every 3 seconds
  const { data: currentMetrics, isLoading } = useQuery<LiveMetricsData>({
    queryKey: ["/api/live-metrics"],
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
  });

  // Fetch recent predictions
  const { data: recentPredictions } = useQuery<any[]>({
    queryKey: ["/api/recent-predictions"],
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });

  // Fetch disease distribution
  const { data: diseaseDistribution } = useQuery<DiseaseDistribution[]>({
    queryKey: ["/api/disease-distribution"],
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (currentMetrics) {
      setMetrics(prev => {
        const newMetric: RealtimeData = {
          ...currentMetrics,
          timestamp: new Date(currentMetrics.timestamp)
        };
        const newMetrics = [...prev, newMetric];
        return newMetrics.slice(-20); // Keep last 20 data points
      });
    }
  }, [currentMetrics]);

  if (isLoading) {
    return (
            <section className="py-16 bg-gradient-to-br from-emerald-50 to-teal-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-xl w-1/3 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="realtime" className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50/50 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 via-white to-gray-50/20"></div>
        {/* Subtle dot pattern */}
        <div className="absolute inset-0" 
             style={{
               backgroundImage: `radial-gradient(circle at 1px 1px, rgba(156, 163, 175, 0.08) 1px, transparent 0)`,
               backgroundSize: '30px 30px'
             }}>
        </div>
        {/* Soft geometric shapes */}
        <div className="absolute top-20 left-20 w-24 h-24 bg-gray-200/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-gray-300/15 rounded-full blur-lg animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <Badge 
              variant="outline" 
              className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border-emerald-200 text-emerald-700 px-6 py-3 text-sm font-semibold rounded-full"
            >
              <div className="relative">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <div className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
              </div>
              Real-Time Analytics
            </Badge>
          </motion.div>
          
          <motion.h2 
            variants={itemVariants}
            className="text-5xl md:text-6xl font-black mb-6 text-gray-900"
          >
            Live System Performance
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Monitor AI predictions and system performance in real-time
          </motion.p>
        </motion.div>

        {/* Modern metrics cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            {
              title: "Total Predictions",
              value: currentMetrics?.totalPredictions?.toLocaleString() || 0,
              subtitle: "Active monitoring",
              icon: Users,
              gradient: "from-emerald-400 to-teal-500",
              bgGradient: "from-emerald-50 to-teal-50"
            },
            {
              title: "Model Accuracy",
              value: `${((currentMetrics?.accuracyRate || 0) * 100).toFixed(2)}%`,
              subtitle: "Above target",
              icon: Target,
              gradient: "from-teal-500 to-cyan-500",
              bgGradient: "from-teal-50 to-cyan-50"
            },
            {
              title: "Avg Confidence",
              value: `${((currentMetrics?.avgConfidence || 0) * 100).toFixed(1)}%`,
              subtitle: "High precision",
              icon: Zap,
              gradient: "from-cyan-500 to-emerald-500",
              bgGradient: "from-cyan-50 to-emerald-50"
            }
          ].map((metric, index) => (
            <motion.div
              key={metric.title}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className={`absolute inset-0 bg-gradient-to-br ${metric.bgGradient} opacity-50`}></div>
                <CardContent className="relative p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                        {metric.title}
                      </p>
                      <p className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
                        {metric.value}
                      </p>
                      <div className="flex items-center text-sm text-gray-600">
                        <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                        {metric.subtitle}
                      </div>
                    </div>
                    <div className={`relative p-4 rounded-2xl bg-gradient-to-r ${metric.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <metric.icon className="w-8 h-8 text-white" />
                      <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                  
                  {/* Animated progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div 
                      className={`h-full bg-gradient-to-r ${metric.gradient} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      transition={{ delay: index * 0.2, duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

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
                      formatter={(value: number, name: string, props: any) => [
                        `${(value * 100).toFixed(2)}%`, 
                        props.dataKey === 'accuracyRate' ? 'Accuracy' : 'Confidence'
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
                          <div className="flex-1 bg-emerald-100 rounded-full h-2.5">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2.5 rounded-full transition-all duration-300" 
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