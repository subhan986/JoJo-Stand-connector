'use server';
/**
 * @fileOverview Rates the bizarreness of a connection between a user input and a JoJo's Bizarre Adventure reference.
 *
 * - rateConnectionBizarreness - A function that rates the connection bizarreness.
 * - RateConnectionBizarrenessInput - The input type for the rateConnectionBizarreness function.
 * - RateConnectionBizarrenessOutput - The return type for the rateConnectionBizarreness function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RateConnectionBizarrenessInputSchema = z.object({
  connectionExplanation: z
    .string()
    .describe(
      'A detailed explanation of the connection between the user input and JoJo reference.'
    ),
});
export type RateConnectionBizarrenessInput = z.infer<typeof RateConnectionBizarrenessInputSchema>;

const RateConnectionBizarrenessOutputSchema = z.object({
  bizarrenessRating: z
    .number()
    .min(1)
    .max(5)
    .describe(
      'A rating from 1 to 5 indicating the strength/tenuousness of the connection, where 1 is a direct reference and 5 is an absurdly bizarre stretch.'
    ),
  ratingExplanation: z
    .string()
    .describe('Explanation of why the connection was given the bizarreness rating.'),
});
export type RateConnectionBizarrenessOutput = z.infer<typeof RateConnectionBizarrenessOutputSchema>;

export async function rateConnectionBizarreness(
  input: RateConnectionBizarrenessInput
): Promise<RateConnectionBizarrenessOutput> {
  return rateConnectionBizarrenessFlow(input);
}

const rateConnectionBizarrenessPrompt = ai.definePrompt({
  name: 'rateConnectionBizarrenessPrompt',
  input: {schema: RateConnectionBizarrenessInputSchema},
  output: {schema: RateConnectionBizarrenessOutputSchema},
  prompt: `You are an expert in analyzing connections to JoJo's Bizarre Adventure.

  Given the following explanation of a connection, rate the strength/tenuousness of the connection on a scale of 1 to 5, where 1 is a direct reference and 5 is an absurdly bizarre stretch.

  Explain your rating.

  Connection Explanation: {{{connectionExplanation}}}

  Your rating:`,
});

const rateConnectionBizarrenessFlow = ai.defineFlow(
  {
    name: 'rateConnectionBizarrenessFlow',
    inputSchema: RateConnectionBizarrenessInputSchema,
    outputSchema: RateConnectionBizarrenessOutputSchema,
  },
  async input => {
    const {output} = await rateConnectionBizarrenessPrompt(input);
    return output!;
  }
);
