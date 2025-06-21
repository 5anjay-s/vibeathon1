import { NextRequest, NextResponse } from 'next/server';
import { getRealTimeAdvice } from '@/ai/flows/real-time-advice';
import twilio from 'twilio';

export async function POST(req: NextRequest) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !twilioPhoneNumber) {
    console.error('Twilio environment variables not set');
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message('The application is not configured for SMS. Please contact the administrator.');
    return new NextResponse(twiml.toString(), {
      headers: { 'Content-Type': 'text/xml' },
      status: 500
    });
  }

  try {
    const body = await req.text();
    const params = new URLSearchParams(body);
    const query = params.get('Body');
    const from = params.get('From');

    if (!query || !from) {
      return new NextResponse('Missing message body or sender number.', { status: 400 });
    }

    const { advice } = await getRealTimeAdvice({ query });

    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(advice);

    return new NextResponse(twiml.toString(), {
      headers: { 'Content-Type': 'text/xml' },
    });

  } catch (error) {
    console.error('Error processing SMS:', error);
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message('Sorry, I was unable to process your request. Please try again later.');
    return new NextResponse(twiml.toString(), {
      headers: { 'Content-Type': 'text/xml' },
      status: 500,
    });
  }
}
