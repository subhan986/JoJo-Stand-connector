'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing user inputs and finding connections to JoJo's Bizarre Adventure.
 *
 * - analyzeJoJoConnection - The main function to analyze the input and find JoJo connections.
 * - AnalyzeJoJoConnectionInput - The input type for the analyzeJoJoConnection function.
 * - AnalyzeJoJoConnectionOutput - The return type for the analyzeJoJoConnection function.
 */

import {ai} from '@/ai/genkit';
import {getYouTubeTranscriptTool} from '@/ai/tools/youtube';
import {fetchImageAsDataUri} from '@/services/image-fetcher';
import {z} from 'genkit';

const AnalyzeJoJoConnectionInputSchema = z.union([
  z.object({type: z.literal('text'), text: z.string().describe('The text to analyze.')}),
  z.object({type: z.literal('url'), url: z.string().describe('The URL to analyze. Can be a webpage or a direct link to an image.')}),
  z.object({type: z.literal('file'), file: z.string().describe('The file to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.')}),
]);

export type AnalyzeJoJoConnectionInput = z.infer<typeof AnalyzeJoJoConnectionInputSchema>;

const ConnectionStepSchema = z.object({
  explanation: z.string().describe("A step in the connection breakdown, explaining the logical link."),
  imagePrompt: z.string().describe("A detailed DALL-E 3 style prompt to generate an image that visually represents this step. The style should be vibrant, absurd, and thematically similar to JoJo's Bizarre Adventure. For example: 'A highly-detailed, vibrant anime-style image of the Mona Lisa striking a classic JoJo pose, with menacing Japanese characters floating in the background.'"),
});

const AnalyzeJoJoConnectionOutputSchema = z.object({
  connectionTitle: z.string().describe('A catchy title for the connection.'),
  connectionSteps: z.array(ConnectionStepSchema).describe('The step-by-step breakdown of the connection, including an explanation and an image generation prompt for each step.'),
  bizarreOMeter: z.number().int().min(1).max(5).describe('A rating of the connection strength (1-5).'),
  supportingEvidence: z.array(z.string()).optional().describe('Relevant media URLs, quotes, or links.'),
});

export type AnalyzeJoJoConnectionOutput = z.infer<typeof AnalyzeJoJoConnectionOutputSchema>;

export async function analyzeJoJoConnection(input: AnalyzeJoJoConnectionInput): Promise<AnalyzeJoJoConnectionOutput> {
  return analyzeJoJoConnectionFlow(input);
}

const analyzeJoJoConnectionPrompt = ai.definePrompt({
  name: 'analyzeJoJoConnectionPrompt',
  tools: [getYouTubeTranscriptTool],
  input: {schema: z.object({
    type: z.string(),
    text: z.string().optional(),
    url: z.string().optional(),
    file: z.string().optional(),
  })},
  output: {schema: AnalyzeJoJoConnectionOutputSchema},
  prompt: `You are a master of the absurd and an encyclopedic expert on JoJo's Bizarre Adventure. Your mission is to unearth the most creative, outlandish, and ridiculously intricate connections between a user's input and the world of JoJo. Do not settle for the obvious; your goal is to weave a web of logic so convoluted it becomes genius.

  The user will provide an input of type {{{type}}}. Deconstruct this input into its most obscure components—concepts, aesthetics, historical footnotes, anything is fair game. Then, brainstorm the most unexpected links to the JJBA universe (manga, anime, characters, Stands, plot points, author inspirations, music references, esoteric trivia, etc.).

  If the input is a YouTube URL, use the getYouTubeTranscript tool to fetch the transcript and analyze its content for maximum absurdity.

  Select the most ridiculously compelling connection and explain it step-by-step. For each step, provide both the textual explanation and a detailed, DALL-E 3 style image prompt to generate a visual for that step. The image prompt should capture the explanation in a vibrant, absurd, and anime-like style that is thematically consistent with JoJo's Bizarre Adventure.

  Input: {{{text}}}{{{url}}}{{{file}}}

  Output the connection in the following JSON format.
  `,
});

const analyzeJoJoConnectionFlow = ai.defineFlow(
  {
    name: 'analyzeJoJoConnectionFlow',
    inputSchema: AnalyzeJoJoConnectionInputSchema,
    outputSchema: AnalyzeJoJoConnectionOutputSchema,
  },
  async input => {
    let finalPromptInput: Record<string, any> = { type: input.type };

    switch (input.type) {
      case 'text':
        finalPromptInput.text = input.text;
        break;
      case 'url':
        try {
          const imageData = await fetchImageAsDataUri(input.url);
          // It's an image URL, switch type and use media helper
          finalPromptInput.type = 'image';
          finalPromptInput.file = `{{media url=${imageData}}}`;
        } catch (error) {
          // Not an image URL, treat as a regular URL for the tool to potentially use.
          finalPromptInput.url = input.url;
          console.log("URL is not an image, treating as text URL for tool usage.");
        }
        break;
      case 'file':
        // Handle uploaded file
        finalPromptInput.file = `{{media url=${input.file}}}`;
        break;
    }

    const {output} = await analyzeJoJoConnectionPrompt(finalPromptInput);
    return output!;
  }
);
