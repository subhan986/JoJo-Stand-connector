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
  z.object({type: z.literal('image'), image: z.string().describe("The image to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'.")}),
  z.object({type: z.literal('file'), file: z.string().describe('The file to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.')}),
]);

export type AnalyzeJoJoConnectionInput = z.infer<typeof AnalyzeJoJoConnectionInputSchema>;

const AnalyzeJoJoConnectionOutputSchema = z.object({
  connectionTitle: z.string().describe('A catchy title for the connection.'),
  connectionSteps: z.array(z.string()).describe('The step-by-step breakdown of the connection.'),
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
  input: {schema: AnalyzeJoJoConnectionInputSchema},
  output: {schema: AnalyzeJoJoConnectionOutputSchema},
  prompt: `You are an expert on JoJo's Bizarre Adventure. Your task is to find creative and compelling connections between a user's input and the world of JoJo's Bizarre Adventure.

  The user will provide an input of type {{{type}}}. Based on this input, identify key subjects, concepts, entities, and themes. Then, brainstorm direct and indirect connections to the JJBA universe (manga, anime, characters, Stands, plot points, author inspirations, music references, etc.).

  If the input is a YouTube URL, use the getYouTubeTranscript tool to fetch the transcript and analyze its content.

  Select the most compelling connection and explain it step-by-step, as if telling a fascinating story. Structure the explanation with a title, a short summary, and a detailed path of connection. Cite specific examples from JJBA.

  Input: {{{text}}}{{{url}}}{{{image}}}{{{file}}}

  Output the connection in the following JSON format:
  {
    "connectionTitle": "A catchy, AI-generated title for the connection",
    "connectionSteps": ["Step 1: ...", "Step 2: ...", ...], // A clear, step-by-step breakdown of the connection.
    "bizarreOMeter": 3, // A fun rating from 1 to 5, indicating the strength/tenuousness of the connection (1 = Direct Reference, 5 = Absurdly Bizarre Stretch).
    "supportingEvidence": ["URL to manga panel", "Quote from the anime", ...] // (Optional) Relevant media: manga panel, quote, song link, wiki page.
  }`,
});

const analyzeJoJoConnectionFlow = ai.defineFlow(
  {
    name: 'analyzeJoJoConnectionFlow',
    inputSchema: AnalyzeJoJoConnectionInputSchema,
    outputSchema: AnalyzeJoJoConnectionOutputSchema,
  },
  async input => {
    let promptInput: AnalyzeJoJoConnectionInput = {...input};
    let mediaContent: string | undefined;
    let isImage = false;

    if (input.type === 'url') {
      try {
        const imageData = await fetchImageAsDataUri(input.url);
        mediaContent = imageData;
        isImage = true;
        // Re-type the input for the prompt.
        promptInput = { type: 'image', image: `{{media url=${imageData}}}` };
      } catch (error) {
        // Not an image URL, proceed as a regular URL.
        console.log("URL is not an image, treating as text URL.");
      }
    } else if (input.type === 'image') {
      mediaContent = input.image;
      isImage = true;
      promptInput = { type: 'image', image: `{{media url=${input.image}}}` };
    } else if (input.type === 'file') {
      mediaContent = input.file;
      promptInput = { type: 'file', file: `{{media url=${input.file}}}` };
    }
    
    const finalPromptInput = {
      type: promptInput.type,
      text: promptInput.type === 'text' ? promptInput.text : undefined,
      url: promptInput.type === 'url' ? promptInput.url : undefined,
      image: isImage ? `{{media url=${mediaContent}}}` : undefined,
      file: promptInput.type === 'file' ? `{{media url=${promptInput.file}}}` : undefined,
    }

    const {output} = await analyzeJoJoConnectionPrompt(finalPromptInput);
    return output!;
  }
);
