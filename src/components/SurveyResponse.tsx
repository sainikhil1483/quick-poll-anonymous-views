
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Send, CheckCircle } from "lucide-react";
import { Survey, SurveyResponse as SurveyResponseType } from "@/types/survey";
import { toast } from "@/hooks/use-toast";

interface SurveyResponseProps {
  survey: Survey;
  onBack: () => void;
}

const SurveyResponse = ({ survey, onBack }: SurveyResponseProps) => {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Check if survey exists in URL params for direct access
    const urlParams = new URLSearchParams(window.location.search);
    const surveyId = urlParams.get('survey');
    
    if (surveyId && surveyId === survey.id) {
      // This is a direct link to the survey
      console.log('Direct survey access for:', survey.title);
    }
  }, [survey.id, survey.title]);

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    // Validate required questions
    const missingRequired = survey.questions.filter(q => 
      q.required && !responses[q.id]?.trim()
    );

    if (missingRequired.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: "Please answer all required questions",
        variant: "destructive"
      });
      return;
    }

    // Save response
    const response: SurveyResponseType = {
      id: Date.now().toString(),
      surveyId: survey.id,
      responses,
      submittedAt: new Date().toISOString()
    };

    const existingResponses = localStorage.getItem(`responses_${survey.id}`);
    const allResponses = existingResponses ? JSON.parse(existingResponses) : [];
    allResponses.push(response);
    
    localStorage.setItem(`responses_${survey.id}`, JSON.stringify(allResponses));
    
    setSubmitted(true);
    toast({
      title: "Response Submitted",
      description: "Thank you for your feedback!"
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <Card className="w-full max-w-md border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h2>
            <p className="text-green-700 mb-6">Your response has been submitted successfully.</p>
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Surveys
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Survey Header */}
        <Card className="mb-8 border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {survey.title}
            </CardTitle>
            {survey.description && (
              <CardDescription className="text-lg mt-2">
                {survey.description}
              </CardDescription>
            )}
          </CardHeader>
        </Card>

        {/* Questions */}
        <div className="space-y-6 max-w-2xl mx-auto">
          {survey.questions.map((question, index) => (
            <Card key={question.id} className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  {question.question}
                  {question.required && (
                    <span className="text-red-500">*</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {question.type === 'multiple-choice' && question.options ? (
                  <RadioGroup
                    value={responses[question.id] || ''}
                    onValueChange={(value) => handleResponseChange(question.id, value)}
                  >
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                        <Label htmlFor={`${question.id}-${optionIndex}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <Textarea
                    value={responses[question.id] || ''}
                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                    placeholder="Enter your answer..."
                    className="min-h-24"
                  />
                )}
              </CardContent>
            </Card>
          ))}

          {/* Submit Button */}
          <div className="text-center pt-8">
            <Button 
              onClick={handleSubmit}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              <Send className="w-5 h-5 mr-2" />
              Submit Response
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyResponse;
