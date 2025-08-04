"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Loader2, ListChecks, Sparkles } from "lucide-react";
import { getFinancialInsights } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

type Insights = {
  summary: string | null;
  tips: string[] | null;
};

export function AiInsights() {
  const [isPending, startTransition] = useTransition();
  const [insights, setInsights] = useState<Insights | null>(null);
  const { toast } = useToast();

  const handleGenerateInsights = () => {
    startTransition(async () => {
      const result = await getFinancialInsights();
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else {
        setInsights({ summary: result.summary, tips: result.tips });
      }
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-primary" />
          <span>AI Financial Insights</span>
        </CardTitle>
        <CardDescription>
          Get personalized tips to improve your financial habits.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {insights ? (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <Lightbulb className="h-5 w-5 text-yellow-400" />
                Spending Summary
              </h3>
              <p className="text-sm text-muted-foreground">{insights.summary}</p>
            </div>
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <ListChecks className="h-5 w-5 text-accent" />
                Actionable Tips
              </h3>
              <ul className="space-y-2 list-disc pl-5 text-sm text-muted-foreground">
                {insights.tips?.map((tip, index) => <li key={index}>{tip}</li>)}
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">
              Click the button to generate your financial analysis.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleGenerateInsights}
          disabled={isPending}
          className="w-full"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Insights
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
