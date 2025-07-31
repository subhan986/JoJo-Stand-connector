'use client';

import { useTransition, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import type { AnalyzeJoJoConnectionOutput, AnalyzeJoJoConnectionInput } from '@/ai/flows/analyze-jojo-connection';
import { submitForAnalysis, getJojoImage } from '@/app/actions';
import InputForm from '@/components/app/input-form';
import ResultsDisplay from '@/components/app/results-display';
import LoadingIndicator from '@/components/app/loading-indicator';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Music, VolumeX, SkipForward, Volume2, Image as ImageIcon } from 'lucide-react';
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
  const [jojoImage, setJojoImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setIsImageLoading(true);
        const { imageUrl } = await getJojoImage();
        setJojoImage(imageUrl);
      } catch (error) {
        console.error("Failed to generate JoJo image:", error);
        setJojoImage("https://placehold.co/100x100.png");
      } finally {
        setIsImageLoading(false);
      }
    };
    fetchImage();
  }, []);


  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.src = tracks[currentTrackIndex].src;
      if (isPlaying) {
        audio.play().catch(error => {
          console.error("Autoplay was prevented by the browser.");
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
  
    if (isPlaying) {
      audio.play().catch(error => {
        console.error("Autoplay was prevented by the browser.");
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);


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
    setIsPlaying(prev => !prev);
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
            <h1 className="font-headline text-4xl md:text-6xl font-black tracking-tighter uppercase bg-gradient-to-r from-primary via-accent to-primary/80 text-transparent bg-clip-text"
              style={{
                textShadow: '0 0 10px hsl(var(--primary) / 0.5), 0 0 20px hsl(var(--accent) / 0.5)'
              }}
            >
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
              <div className="text-center text-muted-foreground p-8 border border-dashed border-border/50 bg-card/50 backdrop-blur-sm rounded-lg">
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
            {isImageLoading ? (
                 <div className="w-[100px] h-[100px] flex flex-col items-center justify-center bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg">
                    <ImageIcon className="w-8 h-8 text-primary animate-pulse" />
                    <p className="text-xs mt-2 text-muted-foreground">Summoning...</p>
                 </div>
            ) : (
                jojoImage && (
                    <Image 
                        src={jojoImage} 
                        alt="AI-generated JoJo Character" 
                        width={100}
                        height={100}
                        className="animate-float object-contain"
                    />
                )
            )}
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
