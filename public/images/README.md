# Keeping /public/images in version control

These directories are reserved for the business's own photography and
manufacturer assets. Git cannot track empty directories, so each one holds a
`.gitkeep` until its first real asset arrives.

The storefront does not depend on anything in here. Until a photograph is
uploaded, a product renders the dimensioned SVG cross-section in
`components/products/ProfileDiagram.tsx` instead. See `docs/image-assets.md`
for the reserved filenames and licensing state.