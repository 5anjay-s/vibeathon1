'use server';

import { getRealTimeAdvice } from '@/ai/flows/real-time-advice';

export async function getAdviceAction(query: string) {
  if (!process.env.GEMINI_API_KEY) {
    return { advice: null, error: 'The Gemini API key is not configured. Please add `GEMINI_API_KEY=YOUR_KEY` to the .env file.' };
  }

  try {
    const { advice } = await getRealTimeAdvice({ query });
    return { advice, error: null };
  } catch (e: any) {
    console.error(e);
    if (e.message?.includes('API key not valid') || e.message?.includes('invalid api key')) {
      return { advice: null, error: 'The provided Gemini API key is not valid. Please check your .env file.' };
    }
    if (e.message?.includes('model')) {
        return { advice: null, error: 'Failed to get advice. The AI model may be unavailable or misconfigured.'}
    }
    return { advice: null, error: 'Failed to get advice. An unexpected error occurred.' };
  }
}
