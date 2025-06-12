
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SurveyResponse from "./components/SurveyResponse";
import { Survey } from "./types/survey";

const queryClient = new QueryClient();

const App = () => {
  const [directSurvey, setDirectSurvey] = useState<Survey | null>(null);

  useEffect(() => {
    // Check for direct survey access via URL params
    const urlParams = new URLSearchParams(window.location.search);
    const surveyId = urlParams.get('survey');
    
    if (surveyId) {
      const savedSurveys = localStorage.getItem('surveys');
      if (savedSurveys) {
        const surveys: Survey[] = JSON.parse(savedSurveys);
        const survey = surveys.find(s => s.id === surveyId);
        if (survey) {
          setDirectSurvey(survey);
        }
      }
    }
  }, []);

  if (directSurvey) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <SurveyResponse 
            survey={directSurvey}
            onBack={() => {
              setDirectSurvey(null);
              window.history.replaceState({}, '', window.location.pathname);
            }}
          />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
