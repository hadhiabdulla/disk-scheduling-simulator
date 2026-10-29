# Disk Scheduling Simulator

An interactive, browser-based simulator for the classic disk scheduling algorithms
taught in Operating Systems courses. Watch the disk head move across the platter,
then compare every algorithm on the same request queue.

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

- Animated disk-head movement plotted the way textbooks draw it
  (cylinder number on the x-axis, service order on the y-axis)
- Play / pause, step forward / back, restart and speed control
- Total head movement, average seek length and full seek order for every run
- One-click **comparison of all six algorithms** on the same queue, with a bar
  chart and the best performer highlighted
- Random queue generator, custom queue input, configurable disk size,
  initial head position and sweep direction
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

1. Set the **disk size** (cylinders are numbered `0` to `disk size`).
2. Set the **initial head position**.
3. Type the **request queue**, e.g. `98, 183, 37, 122, 14, 124, 65, 67`
   (or press *Random queue*).
4. Pick an **algorithm** and press **Run algorithm** to watch the head move.
5. Press **Compare all algorithms** to see every algorithm's total head
   movement and average seek length on the same queue.

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

## Project structure

```
disk-scheduling-simulator/
  index.html   - the whole simulator (markup, styles and logic in one file)
  README.md    - this file
```

No build step, no dependencies.
