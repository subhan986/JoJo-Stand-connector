'use server';

/**
 * @fileOverview A Genkit flow for generating an image of a random JoJo's Bizarre Adventure character.
 *
 * - generateJoJoImage - A function that generates an image.
 * - GenerateJoJoImageOutput - The return type for the generateJoJoImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateJoJoImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});

export type GenerateJoJoImageOutput = z.infer<typeof GenerateJoJoImageOutputSchema>;

export async function generateJoJoImage(): Promise<GenerateJoJoImageOutput> {
  return generateJoJoImageFlow();
}

const generateJoJoImageFlow = ai.defineFlow(
  {
    name: 'generateJoJoImageFlow',
    inputSchema: z.void(),
    outputSchema: GenerateJoJoImageOutputSchema,
  },
  async () => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: 'Generate an image of a random JoJo\'s Bizarre Adventure character, in a chibi (cute) style, dancing. The background should be simple, transparent, and not distracting.',
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media) {
      throw new Error('Image generation failed.');
    }

    return { imageUrl: media.url };
  }
);
