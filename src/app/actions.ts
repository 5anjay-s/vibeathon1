'use server';

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'genkit';

const GetRealTimeAdviceInputSchema = z.object({
  query: z.string().describe('The user query about travel advice.'),
});

const GetRealTimeAdviceOutputSchema = z.object({
  advice: z.string().describe('The real-time travel advice.'),
});

const getRealTimeAdvicePromptConfig = {
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
};


export async function getAdviceAction(query: string, apiKey: string) {
  if (!apiKey) {
    return { advice: null, error: 'API key is required.' };
  }

  try {
    const customAi = genkit({
      plugins: [googleAI({ apiKey })],
      model: 'googleai/gemini-2.0-flash',
    });

    const prompt = customAi.definePrompt(getRealTimeAdvicePromptConfig);
    const { output } = await prompt({ query });

    return { advice: output?.advice, error: null };
  } catch (e: any) {
    console.error(e);
    if (e.message?.includes('API key not valid')) {
      return { advice: null, error: 'The provided API key is not valid. Please check your key and try again.' };
    }
    return { advice: null, error: 'Failed to get advice. An unexpected error occurred.' };
  }
}
