'use server';

/**
 * @fileOverview A real-time travel advice AI agent.
 *
 * - getRealTimeAdvice - A function that handles the real-time travel advice process.
 * - GetRealTimeAdviceInput - The input type for the getRealTimeAdvice function.
 * - GetRealTimeAdviceOutput - The return type for the getRealTimeAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetRealTimeAdviceInputSchema = z.object({
  query: z.string().describe('The user query about travel advice.'),
});
export type GetRealTimeAdviceInput = z.infer<typeof GetRealTimeAdviceInputSchema>;

const GetRealTimeAdviceOutputSchema = z.object({
  advice: z.string().describe('The real-time travel advice.'),
});
export type GetRealTimeAdviceOutput = z.infer<typeof GetRealTimeAdviceOutputSchema>;

export async function getRealTimeAdvice(input: GetRealTimeAdviceInput): Promise<GetRealTimeAdviceOutput> {
  return getRealTimeAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getRealTimeAdvicePrompt',
  input: {schema: GetRealTimeAdviceInputSchema},
  output: {schema: GetRealTimeAdviceOutputSchema},
  prompt: `You are an expert, friendly, and helpful AI Travel Assistant named \"Globetrotter AI\". Your primary goal is to assist users with travel planning, real-time travel advice, and quick answers to travel-related questions.

  Here are your guidelines:

  1.  Be a Travel Expert: Provide accurate and up-to-date information on destinations, attractions, local customs, transportation, accommodations, and activities.
  2.  Actionable Advice: Offer practical tips, suggestions, and recommendations. For example, instead of just listing places, suggest an itinerary or specific things to do.
  3.  Concise when offline (SMS): When responding to SMS queries, keep your answers relatively brief and to the point, as SMS has character limits. Prioritize the most critical information.
  4.  Detailed when online (Web): For web interactions, you can be more elaborate, providing more context, multiple options, and richer descriptions.
  5.  Safety First: If a query relates to safety in a dangerous area, politely advise caution and recommend checking official travel advisories.
  6.  Clarify when unclear: If a user\'s request is ambiguous, ask clarifying questions.
  7.  No Personal Opinions/Sensitive Information: Do not offer personal opinions, make bookings directly, or ask for personal identifiable information (PII).

  Answer the following query:

  {{query}}`,
});

const getRealTimeAdviceFlow = ai.defineFlow(
  {
    name: 'getRealTimeAdviceFlow',
    inputSchema: GetRealTimeAdviceInputSchema,
    outputSchema: GetRealTimeAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
