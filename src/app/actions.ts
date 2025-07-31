'use server';

import { analyzeJoJoConnection, AnalyzeJoJoConnectionInput, AnalyzeJoJoConnectionOutput } from "@/ai/flows/analyze-jojo-connection";
import { generateJoJoImage, GenerateJoJoImageOutput } from "@/ai/flows/generate-jojo-image";
import { generateSlideshowImages, GenerateSlideshowImagesInput } from "@/ai/flows/generate-slideshow-images";

interface AnalysisResult {
    data: AnalyzeJoJoConnectionOutput | null;
    error: string | null;
}

export async function submitForAnalysis(input: AnalyzeJoJoConnectionInput): Promise<AnalysisResult> {
  try {
    const result = await analyzeJoJoConnection(input);
    return { data: result, error: null };
  } catch (e) {
    console.error("Analysis Error:", e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { data: null, error: `An unexpected error occurred during analysis. WRYYYYY! Details: ${errorMessage}` };
  }
}

export async function getJojoImage(): Promise<GenerateJoJoImageOutput> {
    return generateJoJoImage();
}

export async function getSlideshowImages(input: GenerateSlideshowImagesInput) {
    try {
        const result = await generateSlideshowImages(input);
        return { data: result, error: null };
    } catch (e) {
        console.error("Slideshow Image Generation Error:", e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { data: null, error: `Failed to generate slideshow images. Details: ${errorMessage}` };
    }
}
