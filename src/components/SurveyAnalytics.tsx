
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, BarChart3, Download } from "lucide-react";
import { Survey, SurveyResponse } from "@/types/survey";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface SurveyAnalyticsProps {
  survey: Survey;
  onBack: () => void;
}

const SurveyAnalytics = ({ survey, onBack }: SurveyAnalyticsProps) => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);

  useEffect(() => {
    const savedResponses = localStorage.getItem(`responses_${survey.id}`);
    if (savedResponses) {
      setResponses(JSON.parse(savedResponses));
    }
  }, [survey.id]);

  const getMultipleChoiceData = (questionId: string, options: string[]) => {
    const counts = options.reduce((acc, option) => {
      acc[option] = 0;
      return acc;
    }, {} as Record<string, number>);

    responses.forEach(response => {
      const answer = response.responses[questionId];
      if (answer && counts.hasOwnProperty(answer)) {
        counts[answer]++;
      }
    });

    return Object.entries(counts).map(([option, count]) => ({
      option,
      count,
      percentage: responses.length > 0 ? Math.round((count / responses.length) * 100) : 0
    }));
  };

  const getShortAnswerResponses = (questionId: string) => {
    return responses
      .map(response => response.responses[questionId])
      .filter(Boolean)
      .map((answer, index) => ({ id: index + 1, answer }));
  };

  const exportData = () => {
    const csvData = [
      ['Response ID', 'Submitted At', ...survey.questions.map(q => q.question)],
      ...responses.map(response => [
        response.id,
        new Date(response.submittedAt).toLocaleString(),
        ...survey.questions.map(q => response.responses[q.id] || '')
      ])
    ];

    const csvContent = csvData.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${survey.title}_responses.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#14B8A6', '#F97316'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Analytics: {survey.title}
            </h1>
          </div>
          {responses.length > 0 && (
            <Button onClick={exportData} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          )}
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{responses.length}</div>
              <p className="text-xs text-muted-foreground">Anonymous submissions</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Questions</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{survey.questions.length}</div>
              <p className="text-xs text-muted-foreground">Total questions</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {responses.length > 0 ? Math.round(
                  (responses.filter(r => 
                    survey.questions.every(q => r.responses[q.id])
                  ).length / responses.length) * 100
                ) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Fully completed</p>
            </CardContent>
          </Card>
        </div>

        {responses.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">No responses yet</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Share your survey to start collecting responses and see analytics here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {survey.questions.map((question, index) => (
              <Card key={question.id} className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">Question {index + 1}</Badge>
                    <Badge variant={question.type === 'multiple-choice' ? 'default' : 'secondary'}>
                      {question.type === 'multiple-choice' ? 'Multiple Choice' : 'Short Answer'}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{question.question}</CardTitle>
                  <CardDescription>
                    {responses.filter(r => r.responses[question.id]).length} of {responses.length} responses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {question.type === 'multiple-choice' && question.options ? (
                    <div className="space-y-6">
                      {/* Bar Chart */}
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={getMultipleChoiceData(question.id, question.options)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="option" 
                              angle={-45}
                              textAnchor="end"
                              height={80}
                            />
                            <YAxis />
                            <Tooltip 
                              formatter={(value, name) => [
                                `${value} responses (${getMultipleChoiceData(question.id, question.options).find(d => d.count === value)?.percentage}%)`,
                                'Count'
                              ]}
                            />
                            <Bar dataKey="count" fill="#3B82F6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Pie Chart */}
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={getMultipleChoiceData(question.id, question.options)}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ option, percentage }) => `${option}: ${percentage}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="count"
                            >
                              {getMultipleChoiceData(question.id, question.options).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {getShortAnswerResponses(question.id).map((response) => (
                        <Card key={response.id} className="bg-gray-50 border-gray-200">
                          <CardContent className="p-3">
                            <p className="text-sm">{response.answer}</p>
                          </CardContent>
                        </Card>
                      ))}
                      {getShortAnswerResponses(question.id).length === 0 && (
                        <p className="text-muted-foreground text-center py-4">No responses yet</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyAnalytics;
