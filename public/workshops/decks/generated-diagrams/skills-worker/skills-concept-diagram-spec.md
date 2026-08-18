# Skills Concept Diagram Spec

## Recommendation

Use the source SVG as canonical. Render to PNG only for insertion convenience. Do not use an AI-generated bitmap for the final Skills slide because the text labels need to remain exact and easy to revise.

## Canvas

- Diagram asset: 1120 by 500, matching the deck's concept diagram area below the slide title.
- Target deck canvas: 1280 by 720.
- Background: `#fffdf8`.
- Ink: `#1f1713`.
- Paper: `#fbf6ec`.
- Line: `#e5d7c3`.
- Copper: `#8f4e24`.
- Intended deck mono: `"SF Mono", ui-monospace, "Fira Code", Menlo, Consolas, monospace`.
- Standalone SVG render mono: `Menlo`, chosen so local browser and PNG rendering stay stable.

## Content

- Left folder panel named `assistant-skills/`.
- Children: `SKILL.md`, `scripts/`, `references/`.
- Right explanation blocks:
  - `SKILL.md`: Name, description, instructions
  - `scripts/`: Executable helper code
  - `references/`: Templates and examples

## Layout Checks

- Minimum visible text size: 30px.
- Diagram margins: 28px left, 28px right, 48px top, 48px bottom.
- No agent loop, model node, autonomy symbol, or "agent" label.
- No overlap between folder tree, arrows, and explanation blocks.
- No clipped bottom.
