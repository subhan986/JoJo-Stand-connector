/**
 * @fileOverview Defines a Genkit tool for fetching YouTube transcripts.
 *
 * - getYouTubeTranscriptTool - A Genkit tool that fetches the transcript of a YouTube video.
 */
import { ai } from '@/ai/genkit';
import { getYouTubeTranscript } from '@/services/youtube';
import { z } from 'zod';

export const getYouTubeTranscriptTool = ai.defineTool(
  {
    name: 'getYouTubeTranscript',
    description: 'Fetches the transcript of a YouTube video from its URL.',
    inputSchema: z.object({
      url: z.string().describe('The URL of the YouTube video.'),
    }),
    outputSchema: z.string().describe('The transcript of the video.'),
  },
  async (input) => {
    return await getYouTubeTranscript(input.url);
  }
);
