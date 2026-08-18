# Conversational Agent Diagram

## Spec Used

- Canvas: 1280 x 720.
- Palette: porcelain `#fffdf8`, ink `#1f1713`, paper `#fbf6ec`, blue support `#3b6e8f`, orange `#e8752b`, copper `#8f4e24`.
- Layout: Person left, Model center, Tools right.
- Person and Model: two straight separated arrows, top arrow labeled `Ask`, bottom arrow labeled `Answers`.
- Model and Tools: two separated curved copper arrows, top arc from Model to Tools labeled `Picks a tool`, bottom arc from Tools back to Model labeled `Reacts to result`.
- Readability: node labels are 54px, arrow labels are 38px, all visible text is above the 30px minimum.
- Overlap rule: labels sit outside the arrow paths and outside node boxes.

## Recommendation

Use the SVG as the source asset, or inline the SVG coordinates into the HTML slide if the deck itself is revised later. Use the PNG export only as an image fallback. I do not recommend an AI-generated bitmap over source-first SVG or HTML for this diagram because the labels need exact spelling and clean arrow geometry.
