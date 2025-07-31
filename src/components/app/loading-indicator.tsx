import { cn } from '@/lib/utils';

const MenacingSymbol = ({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <span
    className={cn(
      'font-headline text-7xl font-bold text-primary opacity-0',
      className
    )}
    style={{
      ...style,
      textShadow: '3px 3px 0px hsl(var(--accent))',
    }}
  >
    ゴ
  </span>
);

export default function LoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-card/50 rounded-lg">
      <div className="flex space-x-2">
        <MenacingSymbol className="animate-[fade-in-out_2s_ease-in-out_infinite]" />
        <MenacingSymbol className="animate-[fade-in-out_2s_ease-in-out_0.25s_infinite]" />
        <MenacingSymbol className="animate-[fade-in-out_2s_ease-in-out_0.5s_infinite]" />
        <MenacingSymbol className="animate-[fade-in-out_2s_ease-in-out_0.75s_infinite]" />
      </div>
      <p className="mt-4 text-lg font-medium text-accent animate-pulse">
        Awakening your Stand... please wait.
      </p>
      <style jsx>{`
        @keyframes fade-in-out {
          0%, 100% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
