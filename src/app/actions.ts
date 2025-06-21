'use server';

import { getRealTimeAdvice } from '@/ai/flows/real-time-advice';

export async function getAdviceAction(query: string) {
  try {
    const { advice } = await getRealTimeAdvice({ query });
    return { advice, error: null };
  } catch (e) {
    console.error(e);
    return { advice: null, error: 'Failed to get advice. Please try again.' };
  }
}
