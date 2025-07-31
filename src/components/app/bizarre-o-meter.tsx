import type { FC } from 'react';
import { cn } from '@/lib/utils';

interface BizarreOMeterProps {
  rating: number;
}

const MenacingSymbol: FC<{ className?: string }> = ({ className }) => (
  <span
    className={cn(
      'font-headline text-4xl font-bold text-primary transition-all duration-300',
      className
    )}
    style={{ textShadow: '2px 2px 0px hsl(var(--accent))' }}
  >
    ゴ
  </span>
);

const BizarreOMeter: FC<BizarreOMeterProps> = ({ rating }) => {
  const clampedRating = Math.max(1, Math.min(5, rating));

  const ratingLabels: { [key: number]: string } = {
    1: 'Direct Reference',
    2: 'Clear Homage',
    3: 'Creative Leap',
    4: 'Tenuous Link',
    5: 'Absurdly Bizarre Stretch',
  };

  return (
    <div className="flex flex-col items-center gap-2 my-4 p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg">
       <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Bizarre-O-Meter</h3>
      <div className="flex items-end space-x-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <MenacingSymbol
            key={index}
            className={cn(
              index < clampedRating ? 'opacity-100' : 'opacity-20 scale-75'
            )}
          />
        ))}
      </div>
      <p className="font-medium text-accent">{ratingLabels[clampedRating]}</p>
    </div>
  );
};

export default BizarreOMeter;
