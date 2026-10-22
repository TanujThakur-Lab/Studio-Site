---
target: studio homepage
total_score: 26
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 3
target_identity: "file:C:\\Users\\tanuj\\Claude's Playground\\Studio Site\\src\\pages\\index.astro"
target_fingerprint: "sha256:2de9cd8237dfea9ed32a779afcaeb2b43118f6c151c6f1b311d65fb29bf640c9"
target_path: "C:\\Users\\tanuj\\Claude's Playground\\Studio Site\\src\\pages\\index.astro"
timestamp: 2026-10-22T14-33-40Z
slug: src-pages-index-astro
---
Method: dual-agent (A: design review sub-agent · B: detector + browser sub-agent)

## Design Health Score
| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 4 | The hero's Drafting, Draft ready and Approved states are announced through aria-live |
| 2 | Match with the real world | 4 | Freight and IT vocabulary, British spelling |
| 3 | User control and freedom | 3 | The "Look again" links send the visitor back up the page |
| 4 | Consistency and standards | 3 | The mid-page ask mentions "a site" |
| 5 | Error prevention | 3 | The disabled Approve, at 0.45 opacity, reads as broken in dark mode |
| 6 | Recognition rather than recall | 3 | |
| 7 | Flexibility and efficiency | n/a | A one-action Persuade page |
| 8 | Aesthetic and minimalist design | 3 | The second half runs long: a tall FAQ slab, a tall close and a big wordmark |
| 9 | Error recovery | 3 | |
| 10 | Help and documentation | n/a | The FAQ covers this |
| **Total** | | **26/32** | Good |

## Design specificity verdict
Specific where the sample data speaks: the freight shorthand notes, the "Read 11 notes. Used 8, left out 3." log, the approve stamp, the 1959 typists' room photo and the rupee rate sheet. Generic where only the structure speaks: the h1, the tier staircase, the comparison table and the FAQ bands. Most of the page's specificity comes from its sample data, not its headlines.

## What's working
1. The hero shows the positioning rather than stating it. The struck-through "left out" rows show judgement.
2. Honesty is built into the design: sample-data labels, "No AI runs on this page", "Pricing on request", and a case-study slot left as a placeholder.
3. A tight token system: flat fields, square corners, and the serif used only inside documents.

## Priority issues
1. **P1: The peak isn't converted.** After Approve, focus goes to "Run it again", and the booking action is far away. Fix: offer "Get this for real" (the booking link) in the sheet bar right after approval.
2. **P1: Dead-end CTA while the booking link is a placeholder.** `BOOKING_URL = '#contact'`, and the footer's "Book a call" points to itself. Fix: until a real link is set, the footer opens an email; the README lists the booking link as a launch blocker.
3. **P1: Stage clauses fail contrast mid-scroll** (agreed by both assessments and by Lighthouse). They are dimmed to 0.5 opacity: 3.4:1 in light, 4.49:1 in dark. Fix: no opacity dimming; labels under unfilled stages hide their fill layer.
4. **P2: The mobile report is cropped mid-sentence**, and the top of the desk is empty after drafting. Fix: on small screens the report slides up into the space the notes leave.
5. **P2: Touch targets under 44px at 375.** The index tabs are 36px, the segment buttons, mini Approve and footer links are 38–40px, and the legal links are small. Fix: raise them to 44px.

## Persona red flags
- **Impatient owner:** during the roughly 3-second draft, the faded Approve looks broken.
- **Screen-reader user:** the hero notes are aria-hidden (the report and live status carry the content). The theme toggle doesn't name the theme it switches to.
- **Mobile user:** the cropped report, and small targets in the demos and footer.

## Minor observations
- Unbalanced heading: "IT support report: Example IT Services".
- The footer legal line runs to about 94 characters per line.
- Sample weekdays don't match the dates in 2026.
- The chartreuse on the biggest tier reads as an upsell under the heading "Start small."
- The mid-page ask ("Want a site and workflows this good…") mentions websites. This copy came from the brief.

## Questions
1. Should the Approve press itself lead into booking?
2. Should the h1 carry the human sign-off rather than the time-saving promise?
