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
    'Diabetes': '#1e40af',
    'Anemia': '#eab308', 
    'Thalassemia': '#dc2626',
    'Heart Disease': '#059669',
    'Thrombocytopenia': '#7c3aed',
    'Healthy': '#6b7280'
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sudan-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Connecting to live data stream...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="live-dashboard" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Real-Time AI Dashboard</h2>
            <p className="text-gray-600">Live monitoring of blood disease classification system</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
            <Badge variant="outline" className="ml-2">
              <Activity className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-l-4 border-l-sudan-blue">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Predictions</p>
                  <p className="text-3xl font-bold text-gray-900">{liveMetrics.totalPredictions.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-sudan-blue rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-l-4 border-l-medical-green">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Model Accuracy</p>
                  <p className="text-3xl font-bold text-gray-900">{(liveMetrics.accuracyRate * 100).toFixed(2)}%</p>
                </div>
                <div className="w-12 h-12 bg-medical-green rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-l-4 border-l-sudan-yellow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Confidence</p>
                  <p className="text-3xl font-bold text-gray-900">{(liveMetrics.avgConfidence * 100).toFixed(1)}%</p>
                </div>
                <div className="w-12 h-12 bg-sudan-yellow rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-l-4 border-l-sudan-red">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Cases</p>
                  <p className="text-3xl font-bold text-gray-900">{Object.values(liveMetrics.diseaseStats).reduce((sum, count) => sum + count, 0)}</p>
                </div>
                <div className="w-12 h-12 bg-sudan-red rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
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