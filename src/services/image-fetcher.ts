/**
 * @fileOverview A service for fetching images from URLs.
 *
 * - fetchImageAsDataUri - Fetches an image from a URL and returns it as a data URI.
 */

/**
 * Fetches an image from a URL and returns it as a data URI.
 * @param imageUrl - The URL of the image to fetch.
 * @returns The image as a data URI string.
 * @throws An error if the image cannot be fetched or processed.
 */
export async function fetchImageAsDataUri(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
        throw new Error('URL does not point to a valid image.');
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error(`Failed to fetch or process image from ${imageUrl}:`, error);
    if (error instanceof Error && error.message.includes('valid image')) {
        throw error;
    }
    throw new Error('Could not fetch or process image from URL.');
  }
}
