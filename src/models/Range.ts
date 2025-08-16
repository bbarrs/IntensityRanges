/*
Simple range model giving the intensity of a range starting at from (incl)

Params:
    from: start of range
    intensity: intensity value for range
*/
export class Range {
    from: number;
    intensity: number;

    constructor(from: number, intensity: number) {
        this.from = from;
        this.intensity = intensity;
    }
    
    toString(): string {
        return `[${this.from},${this.intensity}]`;
    }
}
