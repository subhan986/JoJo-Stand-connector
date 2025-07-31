'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const MenacingSymbol = ({ className }: { className?: string }) => (
    <span
      className={`font-headline text-8xl md:text-9xl font-black text-primary/80 transition-all duration-300 ${className}`}
      style={{ textShadow: '0 0 15px hsl(var(--accent)), 4px 4px 0px hsl(var(--background))' }}
    >
      ゴ
    </span>
  );

export default function LandingPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 animate-[spin_60s_linear_infinite]">
                <MenacingSymbol />
            </div>
            <div className="absolute bottom-1/4 right-1/4 animate-[spin_60s_linear_infinite_reverse]">
                <MenacingSymbol />
            </div>
             <div className="absolute top-1/2 right-1/4 animate-[spin_45s_linear_infinite]">
                <MenacingSymbol className="text-accent" />
            </div>
             <div className="absolute bottom-1/3 left-1/3 animate-[spin_50s_linear_infinite_reverse]">
                <MenacingSymbol className="text-accent"/>
            </div>
        </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        <div className="flex items-center justify-center space-x-2">
            <MenacingSymbol />
            <MenacingSymbol />
            <MenacingSymbol />
        </div>
        
        <h1 
            className="font-headline text-5xl md:text-7xl font-black tracking-tighter uppercase my-4 bg-gradient-to-r from-primary via-accent to-primary/80 text-transparent bg-clip-text"
            style={{
                textShadow: '0 0 10px hsl(var(--primary) / 0.5), 0 0 20px hsl(var(--accent) / 0.5)'
            }}
        >
          Stand Connector
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-lg mb-8">
            This must be the work of an enemy Stand! Uncover the impossibly bizarre connections between anything and the world of JoJo.
        </p>

        <Link href="/connector" passHref>
          <Button
            size="lg"
            className="font-bold uppercase tracking-wider text-lg bg-accent hover:bg-accent/90 text-accent-foreground h-14 px-8 transform hover:scale-105 transition-transform duration-300"
          >
            Awaken Your Stand
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </Link>
      </div>

       <footer className="absolute bottom-4 text-center text-sm text-muted-foreground/50">
        <p>Powered by the inexplicable energy of Hamon and Google Gemini.</p>
      </footer>
    </div>
  );
}