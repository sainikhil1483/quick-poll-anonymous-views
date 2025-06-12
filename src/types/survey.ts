
export interface Question {
  id: string;
  type: 'multiple-choice' | 'short-answer';
  question: string;
  options?: string[];
  required: boolean;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: string;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  responses: Record<string, string>;
  submittedAt: string;
}
