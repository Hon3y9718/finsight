'use server';
/**
 * @fileOverview Summarizes user spending habits using AI.
 *
 * - summarizeSpendingHabits - A function that takes spending data and returns a summary of spending habits.
 * - SummarizeSpendingHabitsInput - The input type for the summarizeSpendingHabits function.
 * - SummarizeSpendingHabitsOutput - The return type for the summarizeSpendingHabits function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSpendingHabitsInputSchema = z.object({
  expenses: z.string().describe('A JSON string containing a list of expenses. Each expense should have a category and amount.'),
  income: z.string().describe('A JSON string containing the total income of the user.'),
});
export type SummarizeSpendingHabitsInput = z.infer<typeof SummarizeSpendingHabitsInputSchema>;

const SummarizeSpendingHabitsOutputSchema = z.object({
  summary: z.string().describe('A summary of the user\'s spending habits, including areas where they can save money.'),
});
export type SummarizeSpendingHabitsOutput = z.infer<typeof SummarizeSpendingHabitsOutputSchema>;

export async function summarizeSpendingHabits(input: SummarizeSpendingHabitsInput): Promise<SummarizeSpendingHabitsOutput> {
  return summarizeSpendingHabitsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSpendingHabitsPrompt',
  input: {schema: SummarizeSpendingHabitsInputSchema},
  output: {schema: SummarizeSpendingHabitsOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user\'s spending habits based on their expenses and income and give advice on areas where they can save money.

Expenses: {{{expenses}}}
Income: {{{income}}}

Provide a concise summary.`,
});

const summarizeSpendingHabitsFlow = ai.defineFlow(
  {
    name: 'summarizeSpendingHabitsFlow',
    inputSchema: SummarizeSpendingHabitsInputSchema,
    outputSchema: SummarizeSpendingHabitsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
