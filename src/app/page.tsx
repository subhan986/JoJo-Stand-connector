'use client';

import { useTransition, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import type { AnalyzeJoJoConnectionOutput, AnalyzeJoJoConnectionInput } from '@/ai/flows/analyze-jojo-connection';
import { submitForAnalysis } from '@/app/actions';
import InputForm from '@/components/app/input-form';
import ResultsDisplay from '@/components/app/results-display';
import LoadingIndicator from '@/components/app/loading-indicator';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Music, VolumeX, SkipForward, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const tracks = [
  {
    name: "Jotaro's Theme",
    src: "/Jotaro Theme but it's FUNKY LOFI HIP HOP (Chill Beats to Yare Yare Daze To) [6SxmlFORXmI].mp3",
  },
  {
    name: "Giorno's Theme",
    src: "/Giorno's Theme but it's SMOOTH LOFI HIP HOP (Chill Beats to Have a Dream to) [MBiXbkKVL2E].mp3",
  },
];

export default function StandConnectorPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<AnalyzeJoJoConnectionOutput | null>(null);
  const { toast } = useToast();

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true); // Autoplay by default
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.src = tracks[currentTrackIndex].src;
        if (isPlaying) {
            audioRef.current.play().catch(error => {
                console.error("Autoplay prevented:", error);
                // If autoplay fails, set isPlaying to false so the UI icon is correct
                setIsPlaying(false);
            });
        }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);


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
    if (!audioRef.current) return;
    
    const newIsPlaying = !isPlaying;
    if (newIsPlaying) {
        audioRef.current.play().catch(error => console.error("Error playing audio:", error));
    } else {
        audioRef.current.pause();
    }
    setIsPlaying(newIsPlaying);
  };
  
  const playNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <audio ref={audioRef} src={tracks[currentTrackIndex].src} loop preload="auto" />
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
        <div className="absolute bottom-2 left-4 h-24 w-24">
            <Image 
                src="https://placehold.co/100x100.png" 
                alt="Dancing Jotaro" 
                width={100}
                height={100}
                className="animate-float"
                data-ai-hint="Jotaro Kujo dancing"
            />
        </div>
        <p>Powered by the inexplicable energy of Hamon and Google Gemini.</p>
         <div className="absolute bottom-2 right-4 flex items-center gap-4">
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleMusic}
                aria-label={isPlaying ? 'Mute music' : 'Play music'}
            >
                {isPlaying ? <Music className="h-5 w-5 text-accent" /> : <VolumeX className="h-5 w-5 text-muted-foreground" />}
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={playNextTrack}
                aria-label="Next track"
            >
                <SkipForward className="h-5 w-5 text-muted-foreground hover:text-accent" />
            </Button>
            <div className="flex items-center gap-2 w-32">
              <Volume2 className="h-5 w-5 text-muted-foreground" />
              <Slider
                defaultValue={[1]}
                max={1}
                step={0.1}
                onValueChange={handleVolumeChange}
                aria-label="Volume"
              />
            </div>
         </div>
      </footer>
    </div>
  );
}
