// A Genkit flow that generates personalized financial tips based on user's financial data.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialDataSchema = z.object({
  income: z.number().describe('Total monthly income.'),
  expenses: z.number().describe('Total monthly expenses.'),
  investments: z.number().describe('Total investments.'),
  loans: z.number().describe('Total outstanding loans.'),
  subscriptions: z.number().describe('Total monthly subscription costs.'),
});

export type FinancialDataInput = z.infer<typeof FinancialDataSchema>;

const FinancialTipsOutputSchema = z.object({
  tips: z.array(z.string()).describe('A list of personalized financial tips.'),
});

export type FinancialTipsOutput = z.infer<typeof FinancialTipsOutputSchema>;

export async function generateFinancialTips(input: FinancialDataInput): Promise<FinancialTipsOutput> {
  return generateFinancialTipsFlow(input);
}

const financialTipsPrompt = ai.definePrompt({
  name: 'financialTipsPrompt',
  input: {schema: FinancialDataSchema},
  output: {schema: FinancialTipsOutputSchema},
  prompt: `You are a personal finance advisor. Based on the following financial data, provide personalized tips to improve financial health.

Income: {{income}}
Expenses: {{expenses}}
Investments: {{investments}}
Loans: {{loans}}
Subscriptions: {{subscriptions}}

Provide specific, actionable tips.`,
});

const generateFinancialTipsFlow = ai.defineFlow(
  {
    name: 'generateFinancialTipsFlow',
    inputSchema: FinancialDataSchema,
    outputSchema: FinancialTipsOutputSchema,
  },
  async input => {
    const {output} = await financialTipsPrompt(input);
    return output!;
  }
);
