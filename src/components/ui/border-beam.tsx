import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorVia?: string;
  colorTo?: string;
}

export const BorderBeam = ({
  className,
  size = 200,
  duration = 15,
  delay = 0,
  borderWidth = 1.5,
  colorFrom = "transparent",
  colorVia = "hsl(0 0% 100%)",
  colorTo = "transparent",
}: BorderBeamProps) => {
  return (
    <div
      style={
        {
          "--size": size,
          "--duration": duration,
          "--delay": delay,
          "--border-width": borderWidth,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit]",
        "[mask-clip:padding-box,border-box] [mask-composite:intersect]",
        "[mask:linear-gradient(white,white),linear-gradient(white,white)]",
        "after:absolute after:aspect-square after:w-[calc(var(--size)*1px)]",
        "after:animate-border-beam after:[animation-delay:calc(var(--delay)*1s)]",
        "after:[background:linear-gradient(to_left,transparent,hsl(0_0%_100%),transparent)]",
        "after:[offset-anchor:calc(var(--size)*0.5px)_calc(var(--size)*0.5px)]",
        "after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]",
        className
      )}
    />
  );
};
