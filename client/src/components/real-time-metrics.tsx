import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, Activity, Clock, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";

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
    <section id="realtime" className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-primary/5 to-medical-green/5"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-success/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-success/10 rounded-full border border-medical-green/20 mb-6">
            <div className="w-2 h-2 bg-medical-green rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-medical-green">Live System Analytics</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black text-neutral-900 mb-6">
            Real-Time <span className="text-gradient">Performance</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto font-medium">
            Monitor AI predictions and system performance with live data streaming and advanced analytics
          </p>
        </div>

        {/* Enhanced metrics cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <MetricCard
            title="Total Predictions"
            value={currentMetrics?.totalPredictions?.toLocaleString() || '0'}
            change="+12%"
            trend="up"
            icon={<Activity className="w-8 h-8" />}
            color="primary"
            delay="0.1s"
          />
          <MetricCard
            title="Accuracy Rate"
            value={`${((currentMetrics?.accuracyRate || 0) * 100).toFixed(1)}%`}
            change="+0.2%"
            trend="up"
            icon={<TrendingUp className="w-8 h-8" />}
            color="success"
            delay="0.2s"
          />
          <MetricCard
            title="Avg Confidence"
            value={`${((currentMetrics?.avgConfidence || 0) * 100).toFixed(1)}%`}
            change="+1.5%"
            trend="up"
            icon={<AlertTriangle className="w-8 h-8" />}
            color="warning"
            delay="0.3s"
          />
        </div>

        {/* Recent predictions table */}
        <Card className="glass-card rounded-3xl border-0 mt-16 overflow-hidden slide-up">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-neutral-900">Latest AI Predictions</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-neutral-600">Live Feed</span>
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

function MetricCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon, 
  color, 
  delay 
}: { 
  title: string, 
  value: string, 
  change: string, 
  trend: 'up' | 'down', 
  icon: React.ReactNode, 
  color: 'primary' | 'success' | 'warning' | 'purple',
  delay: string 
}) {
  const colorClasses = {
    primary: {
      bg: 'from-primary/10 to-primary/5',
      border: 'border-primary/20',
      text: 'text-primary',
      icon: 'bg-gradient-primary'
    },
    success: {
      bg: 'from-medical-green/10 to-medical-green/5',
      border: 'border-medical-green/20', 
      text: 'text-medical-green',
      icon: 'bg-gradient-success'
    },
    warning: {
      bg: 'from-sudan-yellow/10 to-sudan-yellow/5',
      border: 'border-sudan-yellow/20',
      text: 'text-sudan-yellow',
      icon: 'bg-gradient-warning'
    },
    purple: {
      bg: 'from-accent-purple/10 to-accent-purple/5',
      border: 'border-accent-purple/20',
      text: 'text-accent-purple',
      icon: 'bg-accent-purple'
    }
  };

  const classes = colorClasses[color];

  return (
    <Card 
      className={`glass-card rounded-3xl border ${classes.border} card-hover scale-in overflow-hidden`}
      style={{ animationDelay: delay }}
    >
      <CardContent className="p-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-3">
              {title}
            </p>
            <p className="text-4xl font-black mb-4 text-neutral-900">
              {value}
            </p>
            <div className="flex items-center gap-2">
              {trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4 text-green-600" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                {change}
              </span>
              <span className="text-sm text-neutral-500">vs last hour</span>
            </div>
          </div>
          <div className={`w-16 h-16 ${classes.icon} rounded-2xl flex items-center justify-center text-white floating-shadow`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}