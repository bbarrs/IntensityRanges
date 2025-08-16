import { binarySearch } from "../utils/BinarySearch";
import { Range } from "../models/Range";

/*
Program that manages intensity by segments.
Segments are intervals from -inf to inf (default at 0)
*/
export class IntensityRanges {
    private ranges: Range[] = [];

    /*
    Function that adds intensity to a range [from, to)

    Params:
        from: start of range (incl)
        to: end of range (excl)
        amount: integer amount to add to intensity
    */
    public add(from: number, to: number, amount: number) {
        if (from >= to || amount == 0) {
            return;
        }

        this.update(from, to, amount, (curr, amt) => {
            curr.intensity += amt;
        });
    }

    /*
    Function that sets intensity for a range [from, to)

    Params:
        from: start of range (incl)
        to: end of range (excl)
        amount: integer amount to set as intensity
    */
    public set(from: number, to: number, amount: number) {
        if (from >= to) {
            return;
        }

        this.update(from, to, amount, (curr, amt) => {
            curr.intensity = amt;
        });
    }

    /*
    Private helper function for both add and set that updates intensity values for a range [from, to),
    according to given operation

    Params:
        from: start of range (incl)
        to: end of range (excl)
        amount: integer amount to set as intensity
        update: function used to update intensity (either adding or setting)
    */
    private update(from: number, to: number, amount: number, update: (range: Range, amount: number) => void) {
        this.findSplit(from);
        this.findSplit(to);

        for (let i = 0; i < this.ranges.length - 1; i++) {
            const curr = this.ranges[i];
            const next = this.ranges[i + 1];

            if (curr.from >= to) break;
            if (next.from <= from) continue;

            update(curr, amount);
        }

        this.mergeOverlapping();
    }

    /*
    Finds where to split at pos if needed using binary search
    */
    private findSplit(pos: number) {
        const index = binarySearch(this.ranges.map(r => r.from), pos);

        if (index < this.ranges.length && this.ranges[index].from == pos) {
            return; // Range already exists starting at pos
        }

        const intensity = index > 0 ? this.ranges[index - 1].intensity : 0;
        this.ranges.splice(index, 0, new Range(pos, intensity));
    }

    /*
    Merges consecutive ranges with the same intensity
    */
    private mergeOverlapping() {
        const mergedRanges: Range[] = [];
    
        if (this.ranges.length == 0) {
            return;
        }

        for (const range of this.ranges) {
            if (mergedRanges.length == 0 || mergedRanges[mergedRanges.length - 1].intensity !== range.intensity) {
                mergedRanges.push(range);
            }
        }
    
        if (mergedRanges.length >= 1 && mergedRanges[0].intensity == 0) {
            mergedRanges.shift();
        }
    
        this.ranges = mergedRanges;
    }

    /*
    Returns a list of all ranges along with their intensities
    */
    public getAllRanges(): Range[] {
        return this.ranges;
    }
}