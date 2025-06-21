import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const plugins = [];
// Only configure the Google AI plugin if an API key is provided.
if (process.env.GEMINI_API_KEY) {
  plugins.push(googleAI({apiKey: process.env.GEMINI_API_KEY}));
}

export const ai = genkit({
  plugins,
  model: 'googleai/gemini-2.0-flash',
});
