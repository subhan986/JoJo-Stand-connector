'use client';

import { Check, Copy, ExternalLink, BookText, Images } from 'lucide-react';
import type { AnalyzeJoJoConnectionOutput } from '@/ai/flows/analyze-jojo-connection';
import type { GenerateSlideshowImagesOutput } from '@/ai/flows/generate-slideshow-images';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import BizarreOMeter from './bizarre-o-meter';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResultsSlideshow from './results-slideshow';


const MenacingSymbol = ({ className }: { className?: string }) => (
    <span
      className={cn(
        'font-headline text-2xl font-bold text-primary transition-all duration-300',
        className
      )}
      style={{ textShadow: '1px 1px 0px hsl(var(--accent))' }}
    >
      ゴ
    </span>
  );

interface ResultsDisplayProps {
  result: AnalyzeJoJoConnectionOutput;
  slideshowImages: GenerateSlideshowImagesOutput | null;
  isSlideshowLoading: boolean;
}

export default function ResultsDisplay({ result, slideshowImages, isSlideshowLoading }: ResultsDisplayProps) {
    const { toast } = useToast();
    const [isCopied, setIsCopied] = useState(false);

    const formatResultForSharing = () => {
        let text = `*${result.connectionTitle}*\n\n`;
        text += "The Path of Fate:\n";
        result.connectionSteps.forEach((step, index) => {
            text += `${index + 1}. ${step.explanation}\n`;
        });
        text += `\nBizarre-o-Meter: ${result.bizarreOMeter}/5\n`;
        if (result.supportingEvidence && result.supportingEvidence.length > 0) {
            text += "\nSupporting Evidence:\n";
            result.supportingEvidence.forEach(evidence => {
                text += `- ${evidence}\n`;
            });
        }
        text += "\nAnalyzed with 'Is this a JoJo Reference?'";
        return text;
    };

    const handleShare = () => {
        const textToCopy = formatResultForSharing();
        navigator.clipboard.writeText(textToCopy).then(() => {
            setIsCopied(true);
            toast({
                title: 'Copied to Clipboard!',
                description: 'The bizarre connection is ready to be shared.',
            });
            setTimeout(() => setIsCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            toast({
                variant: 'destructive',
                title: 'Copy Failed',
                description: 'Could not copy the result to your clipboard.',
            });
        });
    };

  return (
    <Card className="bg-card/70 backdrop-blur-sm border-accent/50 border-2 shadow-lg shadow-accent/20">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-accent font-black uppercase tracking-wider">{result.connectionTitle}</CardTitle>
        <CardDescription>This must be the work of an enemy Stand!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text"><BookText className="w-4 h-4 mr-2"/>Text Analysis</TabsTrigger>
                <TabsTrigger value="slideshow" disabled={isSlideshowLoading}><Images className="w-4 h-4 mr-2"/>Visual Journey</TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="mt-4">
                <div>
                  <h3 className="font-semibold text-lg mb-4 font-headline uppercase tracking-wider">The Path of Fate:</h3>
                  <div className="relative pl-6">
                      {result.connectionSteps.map((step, index) => (
                        <div key={index} className="relative pb-8">
                          {/* Vertical line */}
                          {index < result.connectionSteps.length - 1 && (
                              <div className="absolute top-2 left-[10px] w-px h-full bg-border" />
                          )}
                          {/* Node icon */}
                          <div className="absolute top-[-4px] left-[-2px] h-4 w-4 bg-transparent rounded-full flex items-center justify-center">
                            <MenacingSymbol />
                          </div>
                          {/* Content */}
                          <div className="pl-6">
                              <p className="flex-1 text-muted-foreground">{step.explanation}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
            </TabsContent>
            <TabsContent value="slideshow" className="mt-4">
                <ResultsSlideshow
                    steps={result.connectionSteps}
                    images={slideshowImages}
                    isLoading={isSlideshowLoading}
                />
            </TabsContent>
        </Tabs>
        
        <BizarreOMeter rating={result.bizarreOMeter} />

        {result.supportingEvidence && result.supportingEvidence.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-2 font-headline uppercase tracking-wider">Supporting Evidence:</h3>
            <ul className="space-y-2">
                {result.supportingEvidence.map((evidence, index) => (
                    <li key={index} className="text-muted-foreground">
                        <a 
                            href={evidence} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center text-accent hover:underline"
                        >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            {evidence}
                        </a>
                    </li>
                ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleShare} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold uppercase tracking-wider">
            {isCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {isCopied ? 'Copied!' : '"To Be Continued..." (Share Result)'}
        </Button>
      </CardFooter>
    </Card>
  );
}
