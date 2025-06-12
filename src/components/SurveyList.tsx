
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Eye, Trash2, Share, Calendar } from "lucide-react";
import { Survey } from "@/types/survey";
import SurveyResponse from "./SurveyResponse";
import SurveyAnalytics from "./SurveyAnalytics";

interface SurveyListProps {
  surveys: Survey[];
  onDeleteSurvey: (surveyId: string) => void;
}

const SurveyList = ({ surveys, onDeleteSurvey }: SurveyListProps) => {
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [viewMode, setViewMode] = useState<'respond' | 'analytics'>('respond');

  const getResponseCount = (surveyId: string) => {
    const responses = localStorage.getItem(`responses_${surveyId}`);
    return responses ? JSON.parse(responses).length : 0;
  };

  const handleShare = (survey: Survey) => {
    const url = `${window.location.origin}?survey=${survey.id}`;
    navigator.clipboard.writeText(url);
  };

  if (selectedSurvey) {
    if (viewMode === 'respond') {
      return (
        <SurveyResponse 
          survey={selectedSurvey}
          onBack={() => setSelectedSurvey(null)}
        />
      );
    } else {
      return (
        <SurveyAnalytics
          survey={selectedSurvey}
          onBack={() => setSelectedSurvey(null)}
        />
      );
    }
  }

  if (surveys.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2">No surveys yet</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Create your first survey to start collecting anonymous responses and analyzing data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Your Surveys</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {surveys.map((survey) => {
          const responseCount = getResponseCount(survey.id);
          
          return (
            <Card key={survey.id} className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 group-hover:text-blue-600 transition-colors">
                      {survey.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {survey.description || "No description provided"}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-4">
                  <Badge variant="outline" className="text-xs">
                    {survey.questions.length} questions
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {responseCount} responses
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center text-xs text-muted-foreground mb-4">
                  <Calendar className="w-3 h-3 mr-1" />
                  Created {new Date(survey.createdAt).toLocaleDateString()}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedSurvey(survey);
                      setViewMode('respond');
                    }}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedSurvey(survey);
                      setViewMode('analytics');
                    }}
                    className="flex-1"
                  >
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Analytics
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare(survey)}
                  >
                    <Share className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteSurvey(survey.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SurveyList;
