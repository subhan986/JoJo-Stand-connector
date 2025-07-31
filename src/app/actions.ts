'use server';

import { analyzeJoJoConnection, AnalyzeJoJoConnectionInput, AnalyzeJoJoConnectionOutput } from "@/ai/flows/analyze-jojo-connection";
import { generateJoJoImage, GenerateJoJoImageOutput } from "@/ai/flows/generate-jojo-image";

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
