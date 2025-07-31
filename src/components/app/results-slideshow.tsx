'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import type { GenerateSlideshowImagesOutput } from '@/ai/flows/generate-slideshow-images';
import type { AnalyzeJoJoConnectionOutput } from '@/ai/flows/analyze-jojo-connection';
import { ImageIcon } from 'lucide-react';

interface ResultsSlideshowProps {
  steps: AnalyzeJoJoConnectionOutput['connectionSteps'];
  images: GenerateSlideshowImagesOutput | null;
  isLoading: boolean;
}

export default function ResultsSlideshow({ steps, images, isLoading }: ResultsSlideshowProps) {
  const stepCount = steps.length;
  
  return (
    <div className="w-full flex justify-center">
      <Carousel className="w-full max-w-sm" opts={{ loop: true }}>
        <CarouselContent>
          {Array.from({ length: stepCount }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6 flex-col gap-4">
                    {isLoading || !images ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg">
                           <ImageIcon className="w-16 h-16 text-primary animate-pulse" />
                           <p className="text-sm mt-4 text-muted-foreground">Generating Bizarre Image...</p>
                           <Skeleton className="h-4 w-[200px] mt-4" />
                        </div>
                    ) : (
                      <>
                        <div className="relative w-full h-4/5">
                            <Image
                                src={images.imageUrls[index]}
                                alt={steps[index].explanation}
                                fill
                                className="object-contain rounded-lg"
                            />
                        </div>
                        <p className="text-center text-sm text-muted-foreground mt-2">
                          <strong>Step {index + 1}:</strong> {steps[index].explanation}
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
