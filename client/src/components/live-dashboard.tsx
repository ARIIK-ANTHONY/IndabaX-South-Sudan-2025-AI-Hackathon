import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area } from "recharts";
import { Activity, TrendingUp, Users, Brain, AlertCircle, Zap } from "lucide-react";
import { format } from "date-fns";

interface LiveMetrics {
  totalPredictions: number;
  accuracyRate: number;
  diseaseStats: { [key: string]: number };
  avgConfidence: number;
  recentPredictions: any[];
  timestamp: Date;
}

interface HistoricalData {
  timestamp: string;
  predictions: number;
  accuracy: number;
  confidence: number;
}

export default function LiveDashboard() {
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to WebSocket for real-time updates
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const connectWebSocket = () => {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'live-update') {
            const newMetrics = message.data;
            setLiveMetrics(newMetrics);
            
            // Add to historical data
            const historicalPoint: HistoricalData = {
              timestamp: format(new Date(newMetrics.timestamp), 'HH:mm:ss'),
              predictions: newMetrics.totalPredictions,
              accuracy: newMetrics.accuracyRate * 100,
              confidence: newMetrics.avgConfidence * 100
            };
            
            setHistoricalData(prev => {
              const updated = [...prev, historicalPoint];
              return updated.slice(-20); // Keep last 20 data points
            });
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        // Attempt to reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const diseaseColors = {
    'Diabetes': 'hsl(210, 70%, 30%)',
    'Anemia': 'hsl(35, 85%, 60%)', 
    'Thalassemia': 'hsl(0, 70%, 55%)',
    'Heart Disease': 'hsl(150, 60%, 45%)',
    'Thrombocytopenia': 'hsl(262, 83%, 58%)',
    'Healthy': 'hsl(180, 60%, 45%)'
  };

  const diseaseDistributionData = liveMetrics?.diseaseStats 
    ? Object.entries(liveMetrics.diseaseStats).map(([disease, count]) => ({
        name: disease,
        value: count,
        color: diseaseColors[disease as keyof typeof diseaseColors] || '#6b7280'
      }))
    : [];

  if (!liveMetrics) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Connecting to live data stream...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="live-dashboard" className="py-20 bg-gradient-to-br from-wellness-mint/5 via-white to-soft-teal/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12 slide-up">
          <div>
            <h2 className="text-5xl font-bold text-gradient-primary mb-4">Real-Time AI Dashboard</h2>
            <p className="text-xl text-gray-600 leading-relaxed">Live monitoring of blood disease classification system</p>
          </div>
          <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
            <div className={`w-4 h-4 rounded-full ${isConnected ? 'bg-green-500 pulse-ring' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium text-gray-700">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
              <Activity className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 fade-in">
          <Card className="card-hover border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Total Predictions</p>
                  <p className="text-4xl font-bold text-gray-900 mb-1">{liveMetrics.totalPredictions.toLocaleString()}</p>
                  <p className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Live tracking
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-sudan rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Model Accuracy</p>
                  <p className="text-4xl font-bold text-gray-900 mb-1">{(liveMetrics.accuracyRate * 100).toFixed(2)}%</p>
                  <p className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Above target
                  </p>
                </div>
                <div className="w-14 h-14 bg-medical-green rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Avg Confidence</p>
                  <p className="text-4xl font-bold text-gray-900 mb-1">{(liveMetrics.avgConfidence * 100).toFixed(1)}%</p>
                  <p className="text-sm text-blue-600 flex items-center">
                    <Zap className="w-3 h-3 mr-1" />
                    High precision
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-medical rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Active Cases</p>
                  <p className="text-4xl font-bold text-gray-900 mb-1">{Object.values(liveMetrics.diseaseStats).reduce((sum, count) => sum + count, 0)}</p>
                  <p className="text-sm text-purple-600 flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    Real-time
                  </p>
                </div>
                <div className="w-14 h-14 bg-accent-purple rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Real-time Disease Distribution */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Live Disease Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={diseaseDistributionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                      labelLine={false}
                    >
                      {diseaseDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Historical Performance Chart */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Trends</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData}>
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="#1e40af" 
                      fill="#1e40af" 
                      fillOpacity={0.1}
                      name="Accuracy %"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="confidence" 
                      stroke="#059669" 
                      fill="#059669" 
                      fillOpacity={0.1}
                      name="Confidence %"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Predictions Feed */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Predictions</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {liveMetrics.recentPredictions.map((prediction, index) => (
                <div key={prediction.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: diseaseColors[prediction.prediction as keyof typeof diseaseColors] || '#6b7280' }}></div>
                    <div>
                      <p className="font-semibold text-gray-900">{prediction.prediction}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(prediction.createdAt), 'MMM dd, HH:mm:ss')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{(prediction.confidence * 100).toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">Confidence</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>System operational • Last update: {format(new Date(liveMetrics.timestamp), 'HH:mm:ss')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}