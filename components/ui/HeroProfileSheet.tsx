/**
 * Hero backdrop: a continuous length of longspan roofing profile.
 *
 * The hero used to sit on a stock photograph of somebody else's roof, which
 * was both a licensing question and a dead link. The thing that actually
 * defines this business is a roll-formed profile running unbroken to 30
 * metres, so the hero shows that instead. It is drawn, not photographed, so it
 * never claims to be the business's own work.
 */
export function HeroProfileSheet({ className = "" }: { className?: string }) {
  // One rib-and-pan repeat, generated across the full width. The sheet is drawn
  // twice at a small vertical offset so it reads as having thickness.
  const rib = 34;
  const pan = 96;
  const pitch = rib + pan;
  const width = 1200;

  const run = (crestY: number, panY: number): string => {
    const segments: string[] = [];
    for (let x = 0; x < width; x += pitch) {
      segments.push(
        `M${x},${panY}`,
        `L${x + rib * 0.25},${crestY}`,
        `L${x + rib * 0.75},${crestY}`,
        `L${x + rib},${panY}`,
        `L${Math.min(x + pitch, width)},${panY}`
      );
    }
    return segments.join(" ");
  };

  return (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="hero-sheet-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id="hero-sheet-veil" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#020617" stopOpacity="0.9" />
          <stop offset="22%" stopColor="#020617" stopOpacity="0.2" />
          <stop offset="78%" stopColor="#020617" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      <g stroke="url(#hero-sheet-fade)" strokeWidth={2} fill="none" strokeLinejoin="round">
        <path d={run(14, 60)} />
        <path d={run(18, 64)} />
      </g>

      <rect x="0" y="0" width={width} height="120" fill="url(#hero-sheet-veil)" />
    </svg>
  );
}