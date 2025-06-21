'use server';

import { getRealTimeAdvice } from '@/ai/flows/real-time-advice';
import twilio from 'twilio';

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

export async function sendSmsAction(formData: FormData) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
  const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER;

  if (!accountSid || !authToken || !twilioPhoneNumber || !adminPhoneNumber) {
    return { success: false, error: 'Twilio and Offline AI phone number environment variables are not fully configured.' };
  }

  const message = formData.get('message') as string;

  if (!message) {
    return { success: false, error: 'Message is required.' };
  }
  
  try {
    const client = twilio(accountSid, authToken);
    await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: adminPhoneNumber
    });
    return { success: true };
  } catch (error: any) {
    console.error('Error sending SMS:', error);
    if (error.code === 21211) { // Invalid 'To' Phone Number
        return { success: false, error: 'The Offline AI phone number configured in the environment is not valid.' };
    }
    return { success: false, error: 'Failed to send SMS. An unexpected error occurred.' };
  }
}
