# Disk Scheduling Simulator

An interactive, browser-based simulator for the classic disk scheduling algorithms
used by real operating systems. Build a request queue by clicking on the disk
map, watch the disk head move across the platter, read a step-by-step explanation of
every move, and compare all six algorithms on the same queue.

![HTML](https://img.shields.io/badge/built%20with-vanilla%20HTML%2FCSS%2FJS-blue)

## Algorithms implemented

| Algorithm | How it works |
|-----------|--------------|
| **FCFS**  | First Come First Served - requests are serviced in arrival order. |
| **SSTF**  | Shortest Seek Time First - always services the request nearest to the current head position. |
| **SCAN**  | Elevator algorithm - the head sweeps to the end of the disk in its current direction, then reverses. |
| **C-SCAN**| Circular SCAN - sweeps in one direction only; at the end it jumps back to the far end and continues. |
| **LOOK**  | Like SCAN, but reverses at the last request instead of travelling to the disk end. |
| **C-LOOK**| Like C-SCAN, but jumps from the last request to the first without touching the disk ends. |

## Features

- **Interactive disk map** - click the track to add a request, click a dot to
  remove it, and drag the HEAD marker to set the initial head position. The map
  and the input fields stay in sync both ways.
- Animated disk-head movement plotted the way textbooks draw it
  (cylinder number on the x-axis, service order on the y-axis)
- **"Why" narration** - a plain-English sentence explains every move while the
  animation runs ("the closest pending request is 65 - move 2 cylinders left")
- **Trace table** - every step with from, to, seek distance and running total,
  the working you write by hand. Click a row to jump the animation
  to that step; the current row highlights as the head moves
- Play / pause, step forward / back, a **timeline scrubber**, restart and speed
  control. Keyboard: space = play/pause, arrow keys = step
- **Hover any plotted point** to inspect it (step number, cylinder, seek
  distance); click it to jump straight there
- One-click **comparison of all six algorithms** on the same queue, with a bar
  chart and the best performer highlighted - click any row to watch that
  algorithm run
- **Textbook example button** restores the classic Silberschatz queue
  `98, 183, 37, 122, 14, 124, 65, 67` with head at 53
- Random queue generator, custom queue input, configurable disk size,
  initial head position and sweep direction
- **Download the trace as CSV** - the same step / from / to / seek / running-total
  table, ready to paste into a report or spreadsheet
- Shareable demo links: add `#demo=compare` or `#demo=run&algo=SCAN` to the URL
- Zero dependencies - plain HTML/CSS/JS, works offline, mobile friendly

## How to run

Clone the repository:

```cmd
git clone https://github.com/hadhiabdulla/disk-scheduling-simulator.git
cd disk-scheduling-simulator
```

Then either:

- **Just open the file** - double-click `index.html`, or
- **Serve it** (recommended, from cmd):

```cmd
python -m http.server 8000
```

and open <http://localhost:8000> in your browser.

> No Python? `npx serve` works too, or any static file server.

## How to use

1. Click on the **disk map** to place requests (or type them into the queue
   box, press *Textbook example* or *Random queue*). Drag the HEAD marker to
   the starting cylinder.
2. Pick an **algorithm** - a one-line explanation of how it works appears
   under the dropdown.
3. Press **Run algorithm**. Press space to pause, then step with the arrow
   keys or drag the scrubber. The "why" line and the trace table explain each
   move as it happens.
4. Press **Compare all algorithms** to see every algorithm's total head
   movement on the same queue. Click any row to watch that algorithm animate.

## Example

For the queue `98, 183, 37, 122, 14, 124, 65, 67` with head at `53`
(direction: left, disk size 199):

| Algorithm | Total head movement |
|-----------|--------------------:|
| FCFS      | 640 |
| SSTF      | 236 |
| SCAN      | 236 |
| C-SCAN    | 386 |
| LOOK      | 208 |
| C-LOOK    | 326 |

*C-SCAN / C-LOOK include the return sweep to the far end, the standard textbook convention.*

## Tests

The algorithm logic is covered by a zero-dependency unit test suite (Node 18+):

```cmd
node tests.js
```

The suite checks every algorithm against the classic Silberschatz worked
example (totals and exact service orders), verifies that every request is
served exactly once, covers edge cases (empty queue, requests at the disk
ends, duplicate requests) and smoke-tests the narration text. It extracts the
algorithm code straight out of `index.html`, so it always tests the exact
code the browser runs. The same tests run automatically on every push via
GitHub Actions (`.github/workflows/tests.yml`).

## Project structure

```
disk-scheduling-simulator/
  index.html                  - the whole simulator (markup, styles and logic in one file)
  tests.js                    - unit tests for the algorithms (node tests.js)
  .github/workflows/tests.yml - CI: runs the tests on every push
  README.md                   - this file
```

No build step, no runtime dependencies.
