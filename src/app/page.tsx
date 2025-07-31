'use client';

import { useTransition, useState, useRef, useEffect } from 'react';
import type { AnalyzeJoJoConnectionOutput, AnalyzeJoJoConnectionInput } from '@/ai/flows/analyze-jojo-connection';
import { submitForAnalysis } from '@/app/actions';
import InputForm from '@/components/app/input-form';
import ResultsDisplay from '@/components/app/results-display';
import LoadingIndicator from '@/components/app/loading-indicator';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Music, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StandConnectorPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<AnalyzeJoJoConnectionOutput | null>(null);
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Attempt to play music when component mounts, but respect browser autoplay policies.
    // User interaction is often required.
    if (audioRef.current) {
        audioRef.current.play().then(() => {
            setIsPlaying(true);
        }).catch(error => {
            console.log("Autoplay blocked by browser:", error);
            setIsPlaying(false);
        });
    }
  }, []);

  const handleFormSubmit = async (input: AnalyzeJoJoConnectionInput) => {
    setResult(null);
    startTransition(async () => {
      const { data, error } = await submitForAnalysis(input);
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: error,
        });
      } else {
        setResult(data);
      }
    });
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <audio ref={audioRef} src="/jotaro-funky-lofi.mp3" loop />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary/80 text-transparent bg-clip-text">
              Stand Connector
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Is that a JoJo Reference? Uncover the bizarre connections in anything.
            </p>
          </header>

          <InputForm onSubmit={handleFormSubmit} isLoading={isPending} />

          <div className="mt-8">
            {isPending && <LoadingIndicator />}
            {result && (
              <div className="animate-in fade-in duration-500">
                <ResultsDisplay result={result} />
              </div>
            )}
            {!isPending && !result && (
              <div className="text-center text-muted-foreground p-8 border-2 border-dashed border-border rounded-lg">
                <Sparkles className="mx-auto h-12 w-12 text-primary" />
                <p className="mt-4 text-lg">Your bizarre analysis will appear here.</p>
                <p className="text-sm">Enter something above and unleash your Stand!</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground relative">
        <p>Powered by the inexplicable energy of Hamon and Google Gemini.</p>
         <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-4"
            onClick={toggleMusic}
            aria-label={isPlaying ? 'Mute music' : 'Unmute music'}
          >
            {isPlaying ? <Music className="h-5 w-5 text-accent" /> : <VolumeX className="h-5 w-5 text-muted-foreground" />}
          </Button>
      </footer>
    </div>
  );
}
