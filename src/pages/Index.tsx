
import { useState, useEffect } from "react";
import { Plus, BarChart3, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SurveyCreator from "@/components/SurveyCreator";
import SurveyList from "@/components/SurveyList";
import { Survey } from "@/types/survey";

const Index = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [showCreator, setShowCreator] = useState(false);

  useEffect(() => {
    const savedSurveys = localStorage.getItem('surveys');
    if (savedSurveys) {
      setSurveys(JSON.parse(savedSurveys));
    }
  }, []);

  const handleSaveSurvey = (survey: Survey) => {
    const updatedSurveys = [...surveys, survey];
    setSurveys(updatedSurveys);
    localStorage.setItem('surveys', JSON.stringify(updatedSurveys));
    setShowCreator(false);
  };

  const handleDeleteSurvey = (surveyId: string) => {
    const updatedSurveys = surveys.filter(s => s.id !== surveyId);
    setSurveys(updatedSurveys);
    localStorage.setItem('surveys', JSON.stringify(updatedSurveys));
    
    // Also clean up responses
    localStorage.removeItem(`responses_${surveyId}`);
  };

  const totalResponses = surveys.reduce((total, survey) => {
    const responses = localStorage.getItem(`responses_${survey.id}`);
    return total + (responses ? JSON.parse(responses).length : 0);
  }, 0);

  if (showCreator) {
    return (
      <SurveyCreator 
        onSave={handleSaveSurvey}
        onCancel={() => setShowCreator(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Survey Creator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create beautiful surveys, collect anonymous responses, and analyze results with powerful analytics.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Surveys</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{surveys.length}</div>
              <p className="text-xs text-muted-foreground">Active surveys</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{totalResponses}</div>
              <p className="text-xs text-muted-foreground">Anonymous submissions</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {surveys.length > 0 ? Math.round(totalResponses / surveys.length) : 0}
              </div>
              <p className="text-xs text-muted-foreground">Responses per survey</p>
            </CardContent>
          </Card>
        </div>

        {/* Create Survey Button */}
        <div className="text-center mb-8">
          <Button 
            onClick={() => setShowCreator(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Survey
          </Button>
        </div>

        {/* Surveys List */}
        <SurveyList 
          surveys={surveys} 
          onDeleteSurvey={handleDeleteSurvey}
        />
      </div>
    </div>
  );
};

export default Index;
