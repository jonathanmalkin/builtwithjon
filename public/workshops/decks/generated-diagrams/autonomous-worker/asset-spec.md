# Autonomous Agent Concept Diagram

## Direction

Use a source-first SVG for the Autonomous Agent diagram rather than a generated raster image. The diagram is built at the deck's 1280 x 720 design size so it can be dropped into the HTML deck as an image or used as source for an inline SVG treatment.

## Visual Spec

- Canvas: 1280 x 720.
- Background: warm porcelain `#fffdf8`.
- Ink: `#1f1713`.
- Paper card fill: `#fbf6ec`.
- Accent strokes: sage `#6e8b6f`, plum `#7a4e68`, copper `#8f4e24`.
- Typography: system sans for nodes and context, SF Mono stack for arrow labels.
- Minimum visible text: 30px. Main nodes are 48px, arrow labels and Schedule are 34px, context pills are 30px.
- Layout: Person left, Model center, Tools right. Your Context sits above/right with Profile, Memory, Data, Workflows. Schedule sits below/near Person.
- Flow: Ask from Person to Model, Answers from Model to Person, copper tool loop between Model and Tools, sage context feed into Model, plum schedule feed into Model from below/left.

## Prompt Equivalent

Create a clean 1280 x 720 source SVG concept diagram on warm porcelain `#fffdf8`. Use ink `#1f1713`, paper `#fbf6ec`, sage `#6e8b6f`, plum `#7a4e68`, copper `#8f4e24`, and SF Mono for labels. Place Person on the left, Model in the center, Tools on the right, a Schedule trigger near Person below, and a Your Context group above/right containing Profile, Memory, Data, and Workflows. Draw an Ask arrow from Person to Model and an Answers arrow back. Draw a copper curved loop from Model to Tools labeled Picks a tool and back labeled Reacts to result. Draw a sage context arrow into Model and a plum schedule arrow into Model from below/left. Keep all visible text at 30px or larger and route lines so no labels overlap lines or nodes.

## Recommendation

Prefer this source SVG or an inline HTML/SVG rebuild over an AI-generated bitmap. Use the PNG only as a preview or fallback export.
