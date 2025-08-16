# Intensity Ranges

This is a program that manages "intensity" by segments.
Segments are intervals from -infinity to infinity. All intensity starts with 0.

This implementation employs number ranges using intervals `[from, to)`.

There are two main functions:

- `add`, which adds an integer amount to the intensity of a given range
- `set`, which sets the intensity of a given range to an integer amount

Ranges are stored in a sorted array, allowing for the use of binary search to find ranges according to their start point.

All consecutive ranges with the same intensity are merged.

One can return a list of all ranges along with their intensities using the function `getAllRanges`.

## Usage

To run this program, first compile using `npx tsc`, and then run `node compiled/index.js`.
