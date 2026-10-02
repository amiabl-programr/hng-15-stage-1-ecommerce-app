import type { ProfileKind } from "@/lib/products/image-manifest";

/**
 * Dimensioned cross-sections of the roll-formed profiles in the catalogue.
 *
 * These stand in for product photography until a real photograph exists. They
 * are section drawings, not pictures of a product, so they are drawn to be
 * useful: a buyer choosing between profiles is choosing a cross-section, and
 * that is the one thing a placeholder photograph cannot tell them.
 *
 * Each sheet is drawn as a closed outline with a constant wall thickness, the
 * way a folded metal profile appears in a manufacturer's section drawing.
 */

const TONES = {
  light: {
    sheet: "stroke-amber-600/70",
    fill: "fill-amber-600/[0.07]",
    dim: "stroke-slate-300",
    grid: "stroke-slate-200",
    label: "text-slate-500",
    bg: "bg-slate-100/70",
  },
  dark: {
    sheet: "stroke-amber-400/70",
    fill: "fill-amber-400/[0.07]",
    dim: "stroke-slate-700",
    grid: "stroke-slate-800",
    label: "text-slate-400",
    bg: "bg-slate-950",
  },
} as const;

export type DiagramTone = keyof typeof TONES;

/** Builds a closed outline of constant wall thickness from a top polyline. */
function sheet(points: [number, number][], t = 5): string {
  const forward = points.map(([x, y]) => `${x},${y}`).join(" L");
  const back = [...points]
    .reverse()
    .map(([x, y]) => `${x},${y + t}`)
    .join(" L");
  return `M${forward} L${back} Z`;
}

function wave(from: number, to: number, base: number, amp: number, period: number): [number, number][] {
  const points: [number, number][] = [];
  const steps = 28;
  for (let i = 0; i <= steps; i++) {
    const x = from + ((to - from) * i) / steps;
    points.push([x, base - amp * Math.sin(((x - from) / period) * Math.PI * 2)]);
  }
  return points;
}

const LONGSPAN = sheet([
  [30, 150],
  [100, 150],
  [120, 96],
  [140, 96],
  [160, 150],
  [270, 150],
  [290, 96],
  [310, 96],
  [330, 150],
]);

const METCOPPO = sheet([
  [26, 152],
  [96, 152],
  [104, 118],
  [116, 112],
  [140, 112],
  [152, 118],
  [160, 152],
  [240, 152],
  [248, 118],
  [260, 112],
  [284, 112],
  [296, 118],
  [304, 152],
  [336, 152],
]);

/**
 * Step tile: a hard right-angle step profile with a broad flat pan between
 * risers. Metcoppo's crest is a soft ogee with a narrow channel; step tile has a
 * wider pan and a square shoulder. Keeping them distinguishable matters because
 * they are separate categories with separate buyers.
 */
const STEP_TILE = sheet([
  [26, 152],
  [104, 152],
  [112, 116],
  [164, 116],
  [172, 152],
  [232, 152],
  [240, 116],
  [292, 116],
  [300, 152],
  [336, 152],
]);

const CORRUGATED = sheet(wave(24, 336, 138, 24, 52));

const RIDGE_CAP =
  "M52,184 L60,176 L180,102 L300,176 L308,184 L303,189 L297,181 L180,109 L63,181 L57,189 Z";

const TRIMMER =
  "M120,54 L120,138 Q120,158 140,158 L250,158 Q270,158 270,138 L270,54 L265,59 L265,137 Q265,153 249,153 L141,153 Q125,153 125,137 L125,59 Z";

const FLASHING = sheet([
  [118, 56],
  [118, 142],
  [338, 142],
]);

const GUTTER =
  "M100,56 L100,72 Q100,154 175,154 Q250,154 250,72 L250,56 L244,56 L244,71 Q244,148 175,148 Q106,148 106,71 L106,56 Z";

const FASTENER_HEAD = "M56,88 L74,71 L100,71 L118,88 L100,105 L74,105 Z";
const FASTENER_SHANK = sheet([
  [116, 84],
  [286, 84],
]);

function threadMarks(from: number, to: number) {
  const marks: [number, number][] = [];
  for (let x = from; x <= to; x += 13) {
    marks.push([x, x + 8]);
  }
  return marks;
}

function shingleCourse(x: number, y: number, w: number, h: number, tabs: number, depth: number): string {
  const tw = w / tabs;
  const bottom: string[] = [`L${x + w},${y + h}`];
  for (let i = tabs - 1; i >= 1; i--) {
    bottom.push(`L${x + i * tw},${y + h}`);
    bottom.push(`L${x + i * tw},${y + h - depth}`);
    bottom.push(`L${x + (i - 1) * tw},${y + h - depth}`);
  }
  bottom.push(`L${x},${y + h - depth}`);
  return `M${x},${y} L${x + w},${y} ${bottom.join(" ")} L${x},${y} Z`;
}

const SHINGLE_COURSES = [132, 96, 60]
  .map((y) => `${shingleCourse(40, y, 280, 40, 5, 9)} ${shingleCourse(40, y - 6, 280, 40, 5, 9)}`)
  .join(" ");

// Roll forming: flat coil strip feeds through the roller pair, then emerges
// as a formed profile. The emerging profile uses its own wave so it never
// overlaps the coil or the rollers.
const ROLL_FORMING_FEED = sheet([
  [146, 99],
  [200, 99],
]);

const ROLL_FORMING_OUT = sheet(wave(200, 340, 102, 13, 30));

function Diagram({
  kind,
  tone,
  weightScale,
}: {
  kind: ProfileKind;
  tone: DiagramTone;
  weightScale: number;
}) {
  const w = (n: number) => n * weightScale;
  const t = TONES[tone];

  switch (kind) {
    case "longspan":
      return (
        <>
          <path d={LONGSPAN} className={`${t.sheet} ${t.fill}`} strokeWidth={w(1.5)} />
          <path d="M30,168 L330,168" className={t.dim} strokeWidth={w(1)} strokeDasharray="8.4 14.0" />
          <path d="M30,163 L30,173 M330,163 L330,173" className={t.dim} strokeWidth={w(1)} />
          <path d="M120,84 L120,70 M120,70 L140,70 M140,70 L140,84" className={t.dim} strokeWidth={w(1)} />
        </>
      );
    case "metcoppo":
      return (
        <>
          <path d={METCOPPO} className={`${t.sheet} ${t.fill}`} strokeWidth={w(1.5)} />
          <path d="M26,170 L336,170" className={t.dim} strokeWidth={w(1)} strokeDasharray="8.4 14.0" />
          <path d="M104,106 L104,92 M104,92 L140,92 M140,92 L140,106" className={t.dim} strokeWidth={w(1)} />
        </>
      );
    case "step-tile":
      return (
        <>
          <path d={STEP_TILE} className={`${t.sheet} ${t.fill}`} strokeWidth={w(1.5)} />
          <path d="M26,170 L336,170" className={t.dim} strokeWidth={w(1)} strokeDasharray="8.4 14.0" />
          <path d="M112,110 L112,96 M112,96 L152,96 M152,96 L152,110" className={t.dim} strokeWidth={w(1)} />
        </>
      );
    case "corrugated":
      return (
        <>
          <path d={CORRUGATED} className={`${t.sheet} ${t.fill}`} strokeWidth={w(1.5)} />
          <path d="M24,178 L336,178" className={t.dim} strokeWidth={w(1)} strokeDasharray="8.4 14.0" />
          <path d="M76,102 L76,74 M76,74 L128,74 M128,74 L128,102" className={t.dim} strokeWidth={w(1)} />
        </>
      );
    case "ridge":
      return (
        <>
          <path d={RIDGE_CAP} className={`${t.sheet} ${t.fill}`} strokeWidth={w(1.5)} />
          <path d="M52,178 L308,178" className={t.dim} strokeWidth={w(1)} strokeDasharray="8.4 14.0" />
          <path d="M180,92 L180,68 M180,68 L148,68 M148,68 L148,92" className={t.dim} strokeWidth={w(1)} />
        </>
      );
    case "trimmer":
      return (
        <>
          <path d={TRIMMER} className={`${t.sheet} ${t.fill}`} strokeWidth={w(1.5)} />
          <path d="M100,158 L290,158" className={t.dim} strokeWidth={w(1)} strokeDasharray="8.4 14.0" />
        </>
      );
    case "flashing":
      return (
        <>
          <path d={FLASHING} className={`${t.sheet} ${t.fill}`} strokeWidth={w(1.5)} />
          <path d="M60,142 L60,56" className={t.dim} strokeWidth={w(1)} strokeDasharray="8.4 14.0" />
          <path d="M52,142 L118,142 M52,137 L52,147 M112,137 L112,147" className={t.dim} strokeWidth={w(1)} />
        </>
      );
    case "gutter":
      return (
        <>
          <path d={GUTTER} className={`${t.sheet} ${t.fill}`} strokeWidth={w(1.5)} />
          <path d="M80,154 L270,154" className={t.dim} strokeWidth={w(1)} strokeDasharray="8.4 14.0" />
        </>
      );
    case "fastener":
      return (
        <>
          <path d={FASTENER_HEAD} className={`${t.sheet} ${t.fill}`} strokeWidth={w(1.5)} />
          <path d={FASTENER_SHANK} className={`${t.sheet} ${t.fill}`} strokeWidth={w(1.5)} />
          <path d="M286,84 L307,86.5 L286,89 Z" className={`${t.sheet} ${t.fill}`} strokeWidth={w(1.5)} />
          <g className={t.sheet} strokeWidth={w(1)}>
            {threadMarks(130, 278).map(([x1, x2]) => (
              <path key={x1} d={`M${x1},84 L${x2},89`} />
            ))}
          </g>
        </>
      );
    case "shingle":
      return (
        <>
          <path d={SHINGLE_COURSES} className={`${t.sheet} ${t.fill}`} strokeWidth={w(1.4)} />
          <circle cx={180} cy={72} r={6} className={t.dim} strokeWidth={w(1.4)} fill="none" />
        </>
      );
    case "roll-forming":
      return (
        <>
          <circle cx={60} cy={104} r={36} className={`${t.sheet} ${t.fill}`} strokeWidth={w(1.5)} />
          <circle cx={60} cy={104} r={11} className={t.dim} strokeWidth={w(1.4)} fill="none" />
          <circle cx={132} cy={64} r={14} className={t.dim} strokeWidth={w(1.4)} fill="none" />
          <circle cx={132} cy={144} r={14} className={t.dim} strokeWidth={w(1.4)} fill="none" />
          <path d={ROLL_FORMING_FEED} className={`${t.sheet} ${t.fill}`} strokeWidth={w(1.5)} />
          <path d={ROLL_FORMING_OUT} className={`${t.sheet} ${t.fill}`} strokeWidth={w(1.5)} />
        </>
      );
    case "bending":
      return (
        <>
          <path
            d="M104,186 L178,140 L252,186 Z"
            className={t.dim}
            strokeWidth={w(1.4)}
            fill="none"
          />
          <path d="M40,150 L146,150 L206,118 L336,118" className={`${t.sheet} ${t.fill}`} strokeWidth={w(1.5)} />
          <path d="M134,58 L226,58 L212,100 L148,100 Z" className={`${t.sheet} ${t.fill}`} strokeWidth={w(1.5)} />
          <path d="M176,108 L176,140" className={t.dim} strokeWidth={w(1)} strokeDasharray="8.4 11.2" />
        </>
      );
    default:
      return null;
  }
}

/**
 * What each drawing actually shows. A roofing screw and a press brake are not
 * profiles, so the noun is stated per drawing rather than guessed.
 */
const CAPTIONS: Record<ProfileKind, string> = {
  longspan: "longspan cross-section",
  metcoppo: "metcoppo cross-section",
  "step-tile": "step tile cross-section",
  corrugated: "corrugation cross-section",
  shingle: "shingle course section",
  ridge: "ridge cap cross-section",
  trimmer: "trimmer channel section",
  flashing: "flashing cross-section",
  gutter: "gutter cross-section",
  fastener: "roofing screw, side elevation",
  "roll-forming": "coil to profile, roll forming line",
  bending: "press brake bending, side elevation",
};

/**
 * Stroke weights are authored for the 360x200 viewBox. In compact mode the same
 * artwork is rendered into a tile roughly a third of the size, so strokes and
 * dashes scale up to stay legible instead of thinning into noise.
 */
const COMPACT_SCALE = 2.8;

export interface ProfileDiagramProps {
  kind: ProfileKind;
  tone?: DiagramTone;
  /**
   * Drops the caption and background grid and thickens the strokes, for small
   * tiles such as the subcategory row where the label already sits underneath.
   */
  compact?: boolean;
  className?: string;
}

export function ProfileDiagram({
  kind,
  tone = "light",
  compact = false,
  className = "",
}: ProfileDiagramProps) {
  const t = TONES[tone];
  const caption = CAPTIONS[kind];

  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center ${
        compact ? "p-2" : "gap-3 p-4"
      } ${t.bg} ${className}`}
    >
      <svg
        viewBox="0 0 360 200"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`Schematic drawing: ${caption}`}
      >
        {!compact && (
          <g className={`${t.grid} opacity-70`} strokeWidth={0.5}>
            <path d="M0,50 L360,50 M0,100 L360,100 M0,150 L360,150" />
          </g>
        )}
        <g strokeLinejoin="round" strokeLinecap="round">
          <Diagram kind={kind} tone={tone} weightScale={compact ? COMPACT_SCALE : 1} />
        </g>
      </svg>
      {!compact && (
        <p className={`text-[10px] font-semibold uppercase tracking-widest ${t.label}`}>
          {caption}
        </p>
      )}
    </div>
  );
}
