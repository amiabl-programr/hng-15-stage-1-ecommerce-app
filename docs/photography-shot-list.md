# Photography shot list

Everything the storefront needs, in the order it should be shot. Until each
asset exists the site shows the SVG profile cross-section from
`components/products/ProfileDiagram.tsx`, so nothing is blocked while you
shoot.

## Ground rules for every shot

- Neutral, uncluttered background. A sheet of plain grey board or a clean
  workshop wall. No other brand's product in frame.
- Square crop, **1600 × 1600 px or larger**. Products are displayed in square
  frames.
- Shoot in even daylight or under diffuse light. No on-camera flash — specular
  highlights across aluminium read as dents.
- Convert to WebP before upload.
- Write alt text describing the specific product. See
  `lib/products/image-manifest.ts` for the alt text already drafted per asset.

## Priority 1 — Products

For each product, three shots.

| Product | `main` | `profile` | `installed` |
| ------- | ------ | -------- | ----------- |
| Premium Longspan Aluminium Roofing Sheet | one clean sheet, rib visible | close-up of the rib cross-section | a finished longspan roof |
| Metcoppo Steptile Profile Sheet | one clean sheet | close-up showing the step | a finished metcoppo roof |
| Corrugated sheet (category) | one clean sheet | close-up of the corrugation | a finished corrugated roof |
| Stone-Coated Shake Shingle Tile | a small stack showing the coating | tabbed courses and keyway slot | a finished shingle roof |
| Heavy-Gauge Ridged Apex Cap | one cap, isolated | the folded apex and return lips | a ridge run along an apex |
| Upper Trimmer / Lower Trimmer | the actual component | cross-section end-on | fitted to the relevant system |
| Valley / Barge / Apron / Sidewall Flashing | each type, isolated | cross-section end-on | installed at a junction |
| Gutter and downpipe | gutter section, isolated | cross-section | fitted to an eave |
| Self-Drilling Hex Roofing Screws | a small pack | one screw side-on, large | — |

**Do not label a generic roofing photo as a specific product.** If you cannot
photograph the exact item, leave the asset out rather than substituting
something that looks similar.

## Priority 2 — Services

These are the shots that prove the work is actually done in-house.

- **Roll forming** — aluminium coil entering the machine, and the formed sheet
  leaving it. Ideally both in one frame: coil, rollers, finished profile.
- **Corrugation** — the corrugating machine in operation.
- **Sheet bending** — flat sheet going in, bent component coming out.
- **Fabrication workshop** — a wide shot of the workshop with people working.

Photograph your own machines. A stock factory photo implies a facility that
may not be yours.

## Priority 3 — Projects

Your own completed roofs are worth more than any product shot. For each:

```ts
{
  title: "Industrial warehouse roof",
  location: "Port Harcourt, Rivers State",
  profile: "Longspan",
  colour: "Slate grey",
  projectType: "Industrial"
}
```

Capture: the whole roof from a safe vantage point, then two or three detail
shots of a ridge run, a valley, and a fascia edge. Detail shots are what prove
the fit and finish.

**Safety:** do not climb or stand on a roof for a photograph. Hire a drone
operator or use a pole camera for elevated shots.

## Priority 4 — Hero and general

Only use licensed stock here, and never label it as your own work. The current
hero does not need a photograph at all — it is drawn from the longspan profile,
which is the more honest choice.

## When a photograph is ready

1. Put it at the reserved path from `docs/image-assets.md`, or
2. Upload through `/admin/products` → the image count next to the product. The
   admin screen handles captioning, ordering, setting the main image, and
   removal. No code change is needed.