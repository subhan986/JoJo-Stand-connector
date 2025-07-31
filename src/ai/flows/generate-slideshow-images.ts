'use server';

/**
 * @fileOverview A Genkit flow for generating a set of slideshow images from prompts.
 *
 * - generateSlideshowImages - A function that generates images from a list of prompts.
 * - GenerateSlideshowImagesInput - The input type for the generateSlideshowImages function.
 * - GenerateSlideshowImagesOutput - The return type for the generateSlideshowImages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSlideshowImagesInputSchema = z.object({
  prompts: z.array(z.string()).describe("An array of detailed prompts for image generation."),
});

export type GenerateSlideshowImagesInput = z.infer<typeof GenerateSlideshowImagesInputSchema>;

const GenerateSlideshowImagesOutputSchema = z.object({
  imageUrls: z.array(z.string()).describe('An array of data URIs for the generated images.'),
});

export type GenerateSlideshowImagesOutput = z.infer<typeof GenerateSlideshowImagesOutputSchema>;

export async function generateSlideshowImages(input: GenerateSlideshowImagesInput): Promise<GenerateSlideshowImagesOutput> {
  return generateSlideshowImagesFlow(input);
}

// Note: We don't use ai.defineFlow here for a specific reason.
// We want to run multiple image generation requests in parallel.
// A standard flow wraps a single logical operation. By creating a regular async function,
// we have more control over the execution logic, allowing us to use Promise.all
// to speed up the process significantly. This is a powerful pattern for orchestrating
// multiple AI (or other async) calls efficiently.

const generateSlideshowImagesFlow = async (input: GenerateSlideshowImagesInput): Promise<GenerateSlideshowImagesOutput> => {
    const imagePromises = input.prompts.map(prompt => 
        ai.generate({
            model: 'googleai/gemini-2.0-flash-preview-image-generation',
            prompt: `${prompt}, in a chibi (cute) style. The background should be simple, transparent, and not distracting.`,
            config: {
                responseModalities: ['TEXT', 'IMAGE'],
            },
        })
    );
    
    const results = await Promise.all(imagePromises);
    
    const imageUrls = results.map(result => {
        if (!result.media) {
            console.error("Image generation failed for one of the prompts.");
            // Return a placeholder or throw an error
            return "https://placehold.co/512x512.png";
        }
        return result.media.url;
    });

    return { imageUrls };
};
