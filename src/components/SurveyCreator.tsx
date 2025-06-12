
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ArrowLeft, Save } from "lucide-react";
import { Survey, Question } from "@/types/survey";
import { toast } from "@/hooks/use-toast";

interface SurveyCreatorProps {
  onSave: (survey: Survey) => void;
  onCancel: () => void;
}

const SurveyCreator = ({ onSave, onCancel }: SurveyCreatorProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'multiple-choice',
      question: '',
      options: ['Option 1', 'Option 2'],
      required: false
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, ...updates } : q
    ));
  };

  const deleteQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const addOption = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options) {
      updateQuestion(questionId, {
        options: [...question.options, `Option ${question.options.length + 1}`]
      });
    }
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options) {
      const newOptions = [...question.options];
      newOptions[optionIndex] = value;
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options && question.options.length > 2) {
      const newOptions = question.options.filter((_, index) => index !== optionIndex);
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a survey title",
        variant: "destructive"
      });
      return;
    }

    if (questions.length === 0) {
      toast({
        title: "Error", 
        description: "Please add at least one question",
        variant: "destructive"
      });
      return;
    }

    const survey: Survey = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      questions,
      createdAt: new Date().toISOString()
    };

    onSave(survey);
    toast({
      title: "Success",
      description: "Survey created successfully!"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="hover:bg-white/80"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create Survey
            </h1>
          </div>
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Survey
          </Button>
        </div>

        {/* Survey Details */}
        <Card className="mb-8 border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Survey Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Survey Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter survey title..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your survey..."
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((question, index) => (
            <Card key={question.id} className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteQuestion(question.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Question Text</Label>
                  <Input
                    value={question.question}
                    onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                    placeholder="Enter your question..."
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Question Type</Label>
                    <Select
                      value={question.type}
                      onValueChange={(value) => updateQuestion(question.id, { 
                        type: value as 'multiple-choice' | 'short-answer',
                        options: value === 'short-answer' ? undefined : question.options
                      })}
                    >
                      <SelectTrigger className="w-48 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                        <SelectItem value="short-answer">Short Answer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`required-${question.id}`}
                      checked={question.required}
                      onCheckedChange={(checked) => updateQuestion(question.id, { required: checked })}
                    />
                    <Label htmlFor={`required-${question.id}`}>Required</Label>
                  </div>
                </div>

                {question.type === 'multiple-choice' && question.options && (
                  <div>
                    <Label>Options</Label>
                    <div className="space-y-2 mt-1">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <Input
                            value={option}
                            onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                            placeholder={`Option ${optionIndex + 1}`}
                          />
                          {question.options && question.options.length > 2 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeOption(question.id, optionIndex)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addOption(question.id)}
                        className="mt-2"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Option
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          <Card className="border-2 border-dashed border-gray-300 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300">
            <CardContent className="flex items-center justify-center py-12">
              <Button
                onClick={addQuestion}
                variant="outline"
                className="text-lg px-8 py-4 h-auto"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Question
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SurveyCreator;
