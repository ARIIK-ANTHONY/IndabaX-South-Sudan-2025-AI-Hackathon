import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';

interface TrainingStats {
  summary: {
    totalTrainingExamples: number;
    totalIntents: number;
    totalDiseases: number;
    avgConfidence: string;
    validationScore: string;
  };
  details: {
    intents: string[];
    diseases: string[];
    symptomMappings: number;
  };
  recommendations: Array<{
    type: string;
    message: string;
    priority: string;
  }>;
}

interface DemoData {
  conversations: Array<{
    title: string;
    conversation: Array<{
      role: string;
      message: string;
    }>;
  }>;
  examples: Array<{
    id: string;
    userInput: string;
    expectedOutput: string;
    confidence: number;
    intent: string;
    disease: string;
  }>;
}

interface TestResult {
  input: string;
  output: string;
  timestamp: string;
}

export default function ChatbotTrainingInterface() {
  const [testInput, setTestInput] = useState('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [selectedExample, setSelectedExample] = useState<string>('');

  // Fetch training statistics
  const { data: trainingStats, isLoading: statsLoading } = useQuery<TrainingStats>({
    queryKey: ['/api/training/stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch demo data
  const { data: demoData, isLoading: demoLoading } = useQuery<DemoData>({
    queryKey: ['/api/training/demo'],
  });

  // Test single input
  const testSingleInput = async () => {
    if (!testInput.trim()) return;

    setIsRunningTest(true);
    try {
      const response = await fetch('/api/training/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testInputs: [testInput] }),
      });

      if (response.ok) {
        const data = await response.json();
        setTestResults(prev => [...data.results, ...prev]);
        setTestInput('');
      }
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setIsRunningTest(false);
    }
  };

  // Test multiple examples
  const testMultipleExamples = async () => {
    if (!demoData?.examples) return;

    setIsRunningTest(true);
    try {
      const testInputs = demoData.examples.map(ex => ex.userInput);
      const response = await fetch('/api/training/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testInputs }),
      });

      if (response.ok) {
        const data = await response.json();
        setTestResults(data.results);
      }
    } catch (error) {
      console.error('Batch test failed:', error);
    } finally {
      setIsRunningTest(false);
    }
  };

  // Test specific example
  const testExample = async (example: any) => {
    setIsRunningTest(true);
    try {
      const response = await fetch('/api/training/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testInputs: [example.userInput] }),
      });

      if (response.ok) {
        const data = await response.json();
        setTestResults(prev => [...data.results, ...prev]);
      }
    } catch (error) {
      console.error('Example test failed:', error);
    } finally {
      setIsRunningTest(false);
    }
  };

  if (statsLoading || demoLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading training interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Medical Chatbot Training Interface
        </h1>
        <p className="text-gray-600">
          Test and validate the medical chatbot's training with real medical scenarios
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="test">Test Bot</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Training Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {trainingStats?.summary.totalTrainingExamples || 0}
                </div>
                <p className="text-xs text-gray-600 mt-1">Medical scenarios</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Intent Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {trainingStats?.summary.totalIntents || 0}
                </div>
                <p className="text-xs text-gray-600 mt-1">Response types</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Disease Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {trainingStats?.summary.totalDiseases || 0}
                </div>
                <p className="text-xs text-gray-600 mt-1">Conditions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {trainingStats?.summary.avgConfidence || '0'}
                </div>
                <p className="text-xs text-gray-600 mt-1">Training quality</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Training Quality</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Validation Score</span>
                    <span className="text-sm text-gray-600">
                      {trainingStats?.summary.validationScore || '0'}%
                    </span>
                  </div>
                  <Progress 
                    value={parseFloat(trainingStats?.summary.validationScore || '0')} 
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Confidence Level</span>
                    <span className="text-sm text-gray-600">
                      {(parseFloat(trainingStats?.summary.avgConfidence || '0') * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={parseFloat(trainingStats?.summary.avgConfidence || '0') * 100} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Training Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trainingStats?.recommendations.map((rec, index) => (
                    <Alert key={index} className={
                      rec.priority === 'high' ? 'border-red-200 bg-red-50' :
                      rec.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                      'border-blue-200 bg-blue-50'
                    }>
                      <AlertDescription className="text-sm">
                        <Badge variant={
                          rec.priority === 'high' ? 'destructive' :
                          rec.priority === 'medium' ? 'secondary' :
                          'default'
                        } className="mr-2">
                          {rec.priority}
                        </Badge>
                        {rec.message}
                      </AlertDescription>
                    </Alert>
                  ))}
                  {(!trainingStats?.recommendations || trainingStats.recommendations.length === 0) && (
                    <Alert className="border-green-200 bg-green-50">
                      <AlertDescription className="text-sm">
                        <Badge variant="outline" className="mr-2 border-green-500 text-green-700">
                          Good
                        </Badge>
                        Training quality is excellent. No recommendations at this time.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Chatbot Responses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter a medical question or symptom..."
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && testSingleInput()}
                  className="flex-1"
                />
                <Button 
                  onClick={testSingleInput}
                  disabled={!testInput.trim() || isRunningTest}
                >
                  {isRunningTest ? 'Testing...' : 'Test'}
                </Button>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={testMultipleExamples}
                  disabled={isRunningTest || !demoData?.examples}
                  variant="outline"
                >
                  Test All Examples
                </Button>
                <Button 
                  onClick={() => setTestResults([])}
                  variant="outline"
                >
                  Clear Results
                </Button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="text-sm font-medium text-gray-700">
                      <span className="text-blue-600">Input:</span> {result.input}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="text-green-600">Response:</span> {result.output}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(result.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Training Examples</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {demoData?.examples.map((example) => (
                  <div key={example.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-700 mb-1">
                          Input: {example.userInput}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          Expected: {example.expectedOutput}
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline">{example.intent}</Badge>
                          <Badge variant="secondary">{example.disease}</Badge>
                          <Badge variant="outline">{(example.confidence * 100).toFixed(0)}%</Badge>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => testExample(example)}
                        disabled={isRunningTest}
                      >
                        Test
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversations" className="space-y-6">
          {demoData?.conversations.map((conv, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{conv.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conv.conversation.map((turn, turnIndex) => (
                    <div key={turnIndex} className={`p-3 rounded-lg ${
                      turn.role === 'user' 
                        ? 'bg-blue-50 ml-8' 
                        : 'bg-gray-50 mr-8'
                    }`}>
                      <div className="text-sm font-medium mb-1">
                        {turn.role === 'user' ? 'Patient' : 'Dr. AI'}
                      </div>
                      <div className="text-sm text-gray-700">
                        {turn.message}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="validation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Training Data Validation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {trainingStats?.summary.validationScore || '0'}%
                    </div>
                    <div className="text-sm text-gray-600">Validation Score</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {trainingStats?.summary.totalTrainingExamples || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total Examples</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {trainingStats?.details.symptomMappings || 0}
                    </div>
                    <div className="text-sm text-gray-600">Symptom Mappings</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Covered Intents</h4>
                    <div className="space-y-2">
                      {trainingStats?.details.intents.map((intent, index) => (
                        <Badge key={index} variant="outline" className="mr-2 mb-2">
                          {intent.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Covered Diseases</h4>
                    <div className="space-y-2">
                      {trainingStats?.details.diseases.map((disease, index) => (
                        <Badge key={index} variant="secondary" className="mr-2 mb-2">
                          {disease}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
