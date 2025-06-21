// src/ai/flows/travel-suggestions.ts
'use server';
/**
 * @fileOverview A travel suggestion AI agent.
 *
 * - getTravelSuggestions - A function that handles the travel suggestion process.
 * - TravelSuggestionsInput - The input type for the getTravelSuggestions function.
 * - TravelSuggestionsOutput - The return type for the getTravelSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TravelSuggestionsInputSchema = z.object({
  destination: z.string().describe('The desired travel destination.'),
  duration: z.string().describe('The duration of the trip (e.g., "3 days", "1 week").'),
});
export type TravelSuggestionsInput = z.infer<typeof TravelSuggestionsInputSchema>;

const TravelSuggestionsOutputSchema = z.object({
  itinerary: z.string().describe('A suggested itinerary for the trip.'),
});
export type TravelSuggestionsOutput = z.infer<typeof TravelSuggestionsOutputSchema>;

export async function getTravelSuggestions(input: TravelSuggestionsInput): Promise<TravelSuggestionsOutput> {
  return travelSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'travelSuggestionsPrompt',
  input: {schema: TravelSuggestionsInputSchema},
  output: {schema: TravelSuggestionsOutputSchema},
  prompt: `You are an expert travel assistant. A user wants to travel to {{destination}} for {{duration}}. Provide a detailed itinerary. Focus on providing actionable advice and specific suggestions for activities and attractions. Do not ask for PII or any other personal questions. Keep the answer concise.`, 
});

const travelSuggestionsFlow = ai.defineFlow(
  {
    name: 'travelSuggestionsFlow',
    inputSchema: TravelSuggestionsInputSchema,
    outputSchema: TravelSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
