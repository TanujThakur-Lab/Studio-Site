---
name: "[BRAND NAME]"
description: "The sign-off desk: paper, ink and one approval chartreuse, laid out as the finished weekly client report."
colors:
  bg: "#F0F0ED"
  surface: "#E4E4E0"
  surface-2: "#D6D6D1"
  ink: "#131417"
  muted: "#55575C"
  accent: "#C8F03C"
  on-accent: "#131417"
  field: "#131417"
  on-field: "#F0F0ED"
  field-muted: "#B1B2AC"
  paper: "#FFFFFF"
  paper-ink: "#131417"
  paper-muted: "#5C5E63"
  paper-chrome: "#EBEBE8"
  paper-tint: "#F3F3F1"
  alert: "#9B2C13"
  mark: "#E9F8B4"
  del: "#F6D7CF"
  bg-dark: "#111214"
  surface-dark: "#1C1D20"
  surface-2-dark: "#27282C"
  ink-dark: "#E6E6E3"
  muted-dark: "#A3A49E"
  paper-dark: "#F5F5F2"
  field-muted-dark: "#4A4B4F"
typography:
  display:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 0.4rem + 6.6vw, 7rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 100"
  headline:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "clamp(2.125rem, 1.3rem + 3.6vw, 4.75rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 106"
  title:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 1.1rem + 1.1vw, 2.125rem)"
    fontWeight: 800
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  body:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.25vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.5
    fontVariation: "'wdth' 100"
  label:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.45
    letterSpacing: "0"
  document-title:
    fontFamily: "'Newsreader Variable', 'Newsreader', Georgia, serif"
    fontSize: "clamp(1.375rem, 1.1rem + 1.1vw, 2.125rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  document-body:
    fontFamily: "'Newsreader Variable', 'Newsreader', Georgia, serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.25vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.45
rounded:
  none: "0px"
spacing:
  tight: "4px"
  gutter: "clamp(12px, 1.6vw, 24px)"
  margin: "clamp(16px, 3.4vw, 48px)"
  section: "clamp(64px, 3.5vw + 48px, 120px)"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0 26px"
    height: "56px"
  button-primary-small:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 18px"
    height: "44px"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
    rounded: "{rounded.none}"
    padding: "0 26px"
    height: "56px"
  document-sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paper-ink}"
    typography: "{typography.document-body}"
    rounded: "{rounded.none}"
    padding: "18px 22px"
  document-bar:
    backgroundColor: "{colors.paper-chrome}"
    textColor: "{colors.paper-ink}"
    typography: "{typography.label}"
    padding: "10px 10px 10px 22px"
  sample-label:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "3px 8px"
  segment:
    backgroundColor: "{colors.paper-chrome}"
    textColor: "{colors.paper-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "44px"
  segment-pressed:
    backgroundColor: "{colors.paper-ink}"
    textColor: "{colors.paper}"
  stage-segment:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    height: "clamp(210px, 28vh, 260px)"
---

# Design System: [BRAND NAME]

## Overview

**Creative North Star: "The Sign-Off Desk"**

The site is set as the finished, edited weekly client report that the studio's workflows produce. A grey desk holds loose notes; paper-white documents sit on it at true size; a single chartreuse marks the one thing that matters on any surface, which is approval. Nothing is lifted, glowing or blended. Everything is a flat sheet of colour cut square, and hierarchy comes from weight, size and fill contrast alone.

Two typefaces split the world cleanly. Archivo, heavy and tight, builds every structural element: headings, navigation, buttons, labels, tables. Newsreader appears only inside finished documents, so a serif on screen always means "this is the output a person approves". Text hangs on a 42% axis: headlines start at the left margin, and the reading column and actions sit on the axis to their right.

Motion is physical and brief. Springs move parts into place, a 60 or 90ms stagger walks them in reading order, and longer sequences are scrubbed by scroll. Only transform, opacity and clip-path animate. With reduced motion every finished state is shown at once and every interaction still works.

**Key Characteristics:**
- Flat paper, ink and one approval chartreuse, used as fills, never as text on light grounds.
- Square corners everywhere (0px).
- Archivo for structure, Newsreader only inside documents.
- A 12-column grid with the reading axis at column 6 (about 42% across).
- Depth from fill steps only: no lines, shadows or gradients.
- Spring motion on transform and opacity; full parity under reduced motion.

**Motion grammar:**

- **Springs:** snappy (420/32, about 220ms) for presses, toggles and the tick landing; smooth (220/28, about 420ms) for reveals and swaps; gentle (120/22, about 650ms) for the hero assembly and large travel.
- **Stagger:** 60ms between lines, 90ms between parts. Reveals rise 24px with opacity; headlines rise out of a clip mask; the photograph opens like a shutter.
- **CSS tokens:** ease-out cubic-bezier(0.23, 1, 0.32, 1), ease-in-out cubic-bezier(0.77, 0, 0.175, 1), 120ms state, 240ms UI, 420ms reveal.
- **Properties:** transform, opacity and clip-path only. Looping illustrations play only while on screen.
- **Reduced motion:** content is visible without JavaScript; reveals, magnetic pull, photo drift, smooth scroll and the circular theme wipe are skipped; the hero shows the finished report ready to approve; looping illustrations stop on a representative frame; the stage bar shows all stages filled. Every demo remains fully interactive.

## Colors

A cool, near-neutral grey paper and graphite ink, with one acid chartreuse kept for approval and the single action.

### Primary
- **Approval Chartreuse** (accent): the fill of the primary button, the sample-data label, the approval stamp, the selected-index square, the nav wordmark tick, text selection and the final stage of the stage bar. Text on it is always ink (on-accent). It is never used as a text colour on light grounds, and never tinted or graded.

### Neutral
- **Desk Grey** (bg): the page ground. Also the inverse text on ink colour pages (on-field).
- **Desk Surface** (surface) and **Desk Surface Deep** (surface-2): the desk band, the stage behind demos, zebra rows, the hero document's top bar. These two steps are the only means of grouping on the page.
- **Graphite Ink** (ink): text, the ink button, pressed segments, and the flat ink colour pages (field).
- **Graphite Muted** (muted): secondary text, unselected index items, the first stage of the stage bar.
- **Field Muted** (field-muted): secondary text on ink colour pages.
- **Paper White** (paper), **Paper Ink** (paper-ink), **Paper Muted** (paper-muted): the document sheet and its text. Paper stays light in both themes.
- **Paper Chrome** (paper-chrome) and **Paper Tint** (paper-tint): the control and footer bars of a document, and its zebra rows.

### Document marks
- **Correction Red** (alert) on **Struck Rose** (del): the removed value in a document update. Correction Red also sets the "stale figure" warning.
- **Highlighter** (mark): the inserted value in a document update.

### Dark theme
The desk goes dark and the documents stay paper. Ground becomes Night Desk (bg-dark), surfaces step up through surface-dark and surface-2-dark, ink becomes Pale Ink (ink-dark) with muted-dark for secondary text. Ink colour pages invert: the field becomes Pale Ink with Night Desk text, and field-muted-dark for secondary text. The paper sheet warms slightly to paper-dark. Chartreuse does not change.

### Pending amendment
The light ground (#F0F0ED) and the dark-theme ink (#E6E6E3) are a pending amendment, awaiting the owner's sign-off. The user-approved values were #F2F1EC and #ECEBE5; both neutrals were moved slightly off yellow-cream after a palette check on 2026-10-22. Treat the shipped values as current, and revert both together if the amendment is declined.

### Named Rules
**The One Tick Rule.** Chartreuse means "approve" or "act". It is a fill for the single action, the approval stamp and the sample-data label; it never decorates.

**The Paper Stays Paper Rule.** Documents are light in both themes. Dark mode darkens the desk, never the sheet.

## Typography

**Display Font:** Archivo Variable (with Archivo, system-ui, sans-serif)
**Document Font:** Newsreader Variable (with Newsreader, Georgia, serif)

**Character:** A heavy, tightly tracked grotesque does the talking for the studio; a calm book serif speaks only for the documents the workflows write. The contrast tells the visitor which words are the product's output.

### Hierarchy
Five steps, shared by both faces.
- **Display** (800, clamp 44 to 112px, line-height 0.92, -0.035em, width 100): the hero h1 only.
- **Headline** (800, clamp 34 to 76px, line-height 0.98, -0.035em, width 106): section headings.
- **Title** (800, clamp 22 to 34px, line-height 1.12, -0.02em): sub-headings, the workflow index, stage-bar times, tier names, KPI figures. Also the lead paragraph size (400, line-height 1.3, -0.01em).
- **Body** (400, clamp 17 to 20px, line-height 1.5): running text, 34 to 58ch measures; buttons set at this step in 700.
- **Small** (0.875rem, line-height 1.45): labels, captions, meta, small buttons, the sample-data label (700).

Inside documents, Newsreader sets the document title (600, title step, line-height 1.15, -0.01em) and document body (400, body step, line-height 1.45). Section labels inside a document drop back to Archivo small at 700.

Archivo's width axis is used for character: condensed (wdth 82, 500) for the loose desk notes and stage artefacts, slightly wide (wdth 106) for headlines.

### Named Rules
**The Serif Means Output Rule.** Newsreader appears only inside a document sheet or a document artefact. Never use it for a page heading, a button or navigation.

**The No Eyebrow Rule.** A heading stands alone. No small label, kicker or category line sits above a heading; the sample-data label belongs to the document's data, inside the sheet, and is not a heading device.

## Layout

A 12-column grid inside a fluid page margin (clamp 16 to 48px) with a fluid gutter (clamp 12 to 24px). Sections are separated by vertical space (clamp 64 to 120px) or by a change of fill, never by a rule.

The 42% axis: reading text, standfirsts, answers and actions start at column 6 of 12 (grid-column 6 / -1), which lands about 42% across at desktop. Headlines start at the left margin and may span the full width; the left five columns hold the section heading, an index, a question or a short note. Below 1100px the axis column spans the full width; below 768px the grid collapses to one column.

The first viewport is a full-width desk band (clamp 360 to 500px tall) with the h1 below it at the left margin. Colour pages are whole sections in flat ink (the FAQ head, the "this page" demo, the footer) or chartreuse, padded at 1.5 times the section space. The nav is sticky at 68px on the page ground. Long sequences on desktop pin for scroll-scrubbing (the stage bar pins at 185vh).

Measures are capped: lead and standfirst 40ch, answers 58ch, promises 46ch, notes 32ch.

## Elevation & Depth

The system is flat. There are no shadows. Depth is expressed by fill steps only: a paper-white sheet on a grey surface on the grey ground, or a whole section turned to ink. Layering of elements happens by placement (the stamp over the sheet, notes over the desk), never by a cast shadow.

### Named Rules
**The Flat Desk Rule.** Every surface is a flat, square-cut fill. To separate two things, change the fill step (bg, surface, surface-2, paper, ink) or the space between them; never add a shadow, border or gradient.

## Shapes

Square corners throughout (0px), on buttons, sheets, labels, segments and photographs. Lines are not part of the form language: no borders, hairlines, dividers or rules. The lines the world does use are typographic and functional: link underlines (1.5 to 2px, offset 0.2 to 0.25em), the 2px nav hover underline, the 3px focus outline, and the 2px outline of a document while it is being edited. List bullets are 6px ink squares. Only two things rotate: the loose notes on the desk and the approval stamp (-6deg).

## Components

### Buttons
Flat, heavy and square; the chartreuse button is the page's one action.
- **Shape:** square (0px).
- **Primary:** chartreuse fill, ink text, Archivo 700 at body step, 56px tall, 0 26px padding, optional 1.05em tick icon with 0.6em gap.
- **Small:** 44px tall, 0 18px padding, small step. Used in the nav and the document bar.
- **Ink:** ink fill with ground-colour text, for secondary actions.
- **Press:** scales to 0.97 over 120ms. The main call-to-action buttons are magnetic on fine pointers: they pull up to 10px toward the cursor on the snappy spring and settle back on the smooth spring.
- **Focus:** 3px ink outline at 3px offset (ground-colour on ink pages, paper ink inside documents).
- **Text link:** 700, 2px underline; on fine-pointer hover the underline turns chartreuse.

### Paper document sheet
The signature component: a workflow's output, built in HTML at true size.
- **Background:** paper white with paper ink, max about 560 to 600px wide, square.
- **Bar:** a control or status bar above the page (surface-2 in the hero, paper chrome in demos), min 64px in the hero, holding the state text and the Approve button.
- **Page:** Newsreader, 18px 22px padding; the sample-data label first, then the document title, paper-muted meta line, Archivo small section labels, and lists with 6px ink square bullets.
- **Foot:** paper-chrome bar with state text and the mini Approve (chartreuse) and Edit (underlined text) actions. Approved state flips Approve to paper ink.
- **Approval stamp:** chartreuse block, Archivo 800, tick icon, rotated -6deg, lands on the snappy spring.
- **Proposal sheet:** the tiers use the same sheet as a proposal: tier rows alternate paper and paper tint; the recommended starting tier is a chartreuse row.

### Sample-data label
- **Style:** chartreuse fill, ink text, Archivo small 700, 3px 8px padding, square, inline at the top of every document page.
- **Rule:** every surface that shows sample data carries this label; it is never removed or restyled.

### Segmented control
- **Style:** a row of 44px square segments, 4px apart, paper-chrome fill, paper-ink text, Archivo small 600, 0 12px padding.
- **State:** the pressed segment flips to paper-ink fill with paper text (aria-pressed); press scales to 0.97. Used to switch weeks, clients, tone and before/after inside a document.

### Workflow index
- **Style:** a vertical list of title-step items in muted; the selected item turns ink, shifts 14px right and gains a 0.42em chartreuse square. Arrow keys, Home and End move through it. On mobile it becomes a horizontal snap-scrolling row.

### Stage bar
- **Style:** three square segments 6px apart on the surface fill, each sized by its share of the timeline. Each segment holds its time in title step and an artefact (notes, a spec, an approved report).
- **Behaviour:** scroll-scrubbed fills wipe in left to right (top to bottom when stacked): muted, then ink, then chartreuse; each label flips to its on-colour once the fill passes its middle. On desktop the section pins and an ink token chip rides the bar naming the current stage. Under reduced motion all three stages are shown filled.

### Navigation
- **Style:** sticky 68px bar on the page ground: wordmark with a 28px chartreuse tick square, small-step 600 links with a 2px ink underline that grows from the left on hover, a 44px theme toggle, and the small primary button. Links hide below 900px.
- **Theme switch:** the new theme opens as a circle from the toggle (520ms) where View Transitions are supported.

## Do's and Don'ts

### Do:
- **Do** separate groups with fill steps (bg, surface, surface-2, paper, ink) and space.
- **Do** keep chartreuse to fills for the single action, approval and the sample-data label, with ink text on it.
- **Do** set structure in Archivo 800 with tight tracking, and set document content in Newsreader.
- **Do** hang reading text and actions on the 42% axis (column 6 of 12), with headlines from the left margin.
- **Do** label every sample-data document with the chartreuse sample-data label.
- **Do** keep every interactive target at least 44px and every animation to transform, opacity or clip-path.

### Don't:
- **Don't** draw lines: no borders, hairlines, dividers or rules. Link underlines, focus outlines and the edit outline are the only lines.
- **Don't** use shadows of any kind for depth.
- **Don't** use gradients, glows or blends.
- **Don't** put eyebrows or kickers above headings.
- **Don't** round corners.
- **Don't** set Newsreader outside a document, or chartreuse as text on a light ground.
- **Don't** darken the paper sheet in dark mode.
