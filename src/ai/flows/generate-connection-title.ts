'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating catchy and thematic titles for connections found between a user input and JoJo's Bizarre Adventure.
 *
 * - generateConnectionTitle - A function that generates a connection title.
 * - GenerateConnectionTitleInput - The input type for the generateConnectionTitle function.
 * - GenerateConnectionTitleOutput - The return type for the generateConnectionTitle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateConnectionTitleInputSchema = z.object({
  input: z.string().describe('The user input to generate a connection title for.'),
  connectionSummary: z.string().describe('A summary of the connection found between the input and JoJo\u0027s Bizarre Adventure.'),
});
export type GenerateConnectionTitleInput = z.infer<typeof GenerateConnectionTitleInputSchema>;

const GenerateConnectionTitleOutputSchema = z.object({
  title: z.string().describe('A catchy and thematic title for the connection.'),
});
export type GenerateConnectionTitleOutput = z.infer<typeof GenerateConnectionTitleOutputSchema>;

export async function generateConnectionTitle(input: GenerateConnectionTitleInput): Promise<GenerateConnectionTitleOutput> {
  return generateConnectionTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateConnectionTitlePrompt',
  input: {schema: GenerateConnectionTitleInputSchema},
  output: {schema: GenerateConnectionTitleOutputSchema},
  prompt: `You are an expert in JoJo's Bizarre Adventure and a master of creating catchy and thematic titles.

  Generate a title that reflects the bizarre and unique nature of JoJo's Bizarre Adventure, based on the following user input and connection summary.

  User Input: {{{input}}}
  Connection Summary: {{{connectionSummary}}}

  The title should be engaging, shareable, and capture the essence of the connection in a creative way.`,
});

const generateConnectionTitleFlow = ai.defineFlow(
  {
    name: 'generateConnectionTitleFlow',
    inputSchema: GenerateConnectionTitleInputSchema,
    outputSchema: GenerateConnectionTitleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
