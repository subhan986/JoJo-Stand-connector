/**
 * @fileOverview A service for interacting with YouTube.
 *
 * - getYouTubeTranscript - Fetches the transcript for a given YouTube video URL.
 */

import { YoutubeTranscript } from 'youtube-transcript';

/**
 * Fetches the transcript of a YouTube video.
 * @param videoUrl - The URL of the YouTube video.
 * @returns The transcript of the video as a string.
 * @throws An error if the transcript cannot be fetched.
 */
export async function getYouTubeTranscript(videoUrl: string): Promise<string> {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);
    return transcript.map((item) => item.text).join(' ');
  } catch (error) {
    console.error(`Failed to fetch transcript for ${videoUrl}:`, error);
    throw new Error('Could not fetch YouTube transcript.');
  }
}
