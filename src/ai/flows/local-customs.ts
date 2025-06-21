'use server';

/**
 * @fileOverview A flow for providing information about local customs of a specific region.
 *
 * - getLocalCustoms - A function that retrieves a summary of local customs for a given region.
 * - GetLocalCustomsInput - The input type for the getLocalCustoms function.
 * - GetLocalCustomsOutput - The return type for the getLocalCustoms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetLocalCustomsInputSchema = z.object({
  region: z.string().describe('The specific region or country to get local customs for.'),
});
export type GetLocalCustomsInput = z.infer<typeof GetLocalCustomsInputSchema>;

const GetLocalCustomsOutputSchema = z.object({
  customsSummary: z.string().describe('A summary of the local customs for the specified region.'),
});
export type GetLocalCustomsOutput = z.infer<typeof GetLocalCustomsOutputSchema>;

export async function getLocalCustoms(input: GetLocalCustomsInput): Promise<GetLocalCustomsOutput> {
  return getLocalCustomsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getLocalCustomsPrompt',
  input: {schema: GetLocalCustomsInputSchema},
  output: {schema: GetLocalCustomsOutputSchema},
  prompt: `You are an expert travel assistant. A user is asking about the local customs of a specific region. Provide a helpful summary of the local customs for the specified region.

Region: {{{region}}}

Summary:`,
});

const getLocalCustomsFlow = ai.defineFlow(
  {
    name: 'getLocalCustomsFlow',
    inputSchema: GetLocalCustomsInputSchema,
    outputSchema: GetLocalCustomsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
