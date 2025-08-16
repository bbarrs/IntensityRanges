import { IntensityRanges } from "./classes/IntensityRanges";
import { Range } from "./models/Range";
import * as assert from "assert";

function assertRanges(label: string, actual: Range[], expected: [number, number][]) {
    const a = actual.map(r => ({from: r.from, intensity: r.intensity}));
    const e = expected.map(([from, intensity]) => ({from, intensity}));

    console.log(label + ": " + actual.map(r => r.toString()).join(", "));

    assert.deepEqual(a, e, label + " failed");
}

function test() {
    console.log("Running tests...");

    console.log("First example:")
    const ir1 = new IntensityRanges();
    ir1.add(10, 30, 1);
    assertRanges("add(10, 30, 1)", ir1.getAllRanges(), [[10,1],[30,0]]);

    ir1.add(20, 40, 1);
    assertRanges("add(20, 40, 1)", ir1.getAllRanges(), [[10,1],[20,2],[30,1],[40,0]]);

    ir1.add(10, 40, -2);
    assertRanges("add(10, 40, -2)", ir1.getAllRanges(), [[10,-1],[20,0],[30,-1],[40,0]]);


    console.log("Second example:")
    const ir2 = new IntensityRanges();
    ir2.add(10, 30, 1);
    assertRanges("add(10, 30, 1)", ir2.getAllRanges(), [[10,1],[30,0]]);

    ir2.add(20, 40, 1);
    assertRanges("add(20, 40, 1)", ir2.getAllRanges(), [[10,1],[20,2],[30,1],[40,0]]);

    ir2.add(10, 40, -1);
    assertRanges("add(10, 40, -1)", ir2.getAllRanges(), [[20,1],[30,0]]);

    ir2.add(10, 40, -1);
    assertRanges("add(10, 40, -1)", ir2.getAllRanges(), [[10,-1],[20,0],[30,-1],[40,0]]);

    console.log("Custom tests/edge cases:");

    const ir3 = new IntensityRanges();
    ir3.add(0, 10, 1);
    assertRanges("add(0, 10, 1)", ir3.getAllRanges(), [[0, 1], [10, 0]]);

    ir3.add(5, 15, 2);
    assertRanges("add(5, 15, 2)", ir3.getAllRanges(), [[0, 1], [5, 3], [10, 2], [15, 0]]);

    ir3.set(7, 12, 5);
    assertRanges("set(7, 12, 5)", ir3.getAllRanges(), [[0, 1], [5, 3], [7, 5], [12, 2], [15, 0]]);

    ir3.add(10, 13, -3);
    assertRanges("add(10, 13, -3)", ir3.getAllRanges(), [[0, 1], [5, 3], [7, 5], [10, 2], [12, -1], [13, 2], [15, 0]]);

    const ir4 = new IntensityRanges();

    ir4.set(5, 15, 2);
    assertRanges("set(5, 15, 2)", ir4.getAllRanges(), [[5, 2], [15, 0]]);

    ir4.set(10, 20, 3);
    assertRanges("set(10, 20, 3)", ir4.getAllRanges(), [[5, 2], [10, 3], [20, 0]]);

    ir4.add(0, 25, 1);
    assertRanges("add(0, 25, 1)", ir4.getAllRanges(), [[0, 1], [5, 3], [10, 4], [20, 1], [25, 0]]);

    const ir5 = new IntensityRanges();
    ir5.add(10, 20, 5);
    ir5.set(15, 25, 2);
    ir5.add(5, 17, -1);
    assertRanges("random adds and set", ir5.getAllRanges(), [[5, -1], [10, 4], [15, 1], [17, 2], [25, 0]]);

    const ir6 = new IntensityRanges();
    ir6.add(0, 100, 1);
    ir6.add(25, 75, -1);
    assertRanges("cancel out part of range", ir6.getAllRanges(), [[0, 1], [25, 0], [75, 1], [100, 0]]);

    console.log("Zero intensity");

    const ir7 = new IntensityRanges();
    assertRanges("empty array check", ir7.getAllRanges(), []);

    ir7.add(10, 20, 0);
    assertRanges("add zero intensity", ir7.getAllRanges(), []);

    ir7.set(15, 25, 0);
    assertRanges("set zero intensity", ir7.getAllRanges(), []);

    ir7.add(15, 20, 1);
    assertRanges("add after set-zero", ir7.getAllRanges(), [[15, 1], [20, 0]]);

    console.log("from == to");

    const ir8 = new IntensityRanges();
    ir8.add(10, 10, 5);
    assertRanges("add invalid range", ir8.getAllRanges(), []);

    ir8.set(5, 5, 3); 
    assertRanges("set invalid range", ir8.getAllRanges(), []);

    console.log("ensuring negative range works");

    const ir9 = new IntensityRanges();
    ir9.set(-10, 0, 2);
    assertRanges("set negative range", ir9.getAllRanges(), [[-10, 2], [0, 0]]);
    
    ir9.add(-5, 5, 1);
    assertRanges("cross zero", ir9.getAllRanges(), [[-10, 2], [-5, 3], [0, 1], [5, 0]]);

    const ir10 = new IntensityRanges();
    ir10.set(0, 100, 1);
    ir10.set(20, 80, 0);
    assertRanges("intersperse zeroes 1", ir10.getAllRanges(), [[0, 1], [20, 0], [80, 1], [100, 0]]);

    const ir11 = new IntensityRanges();
    ir11.add(0, 50, 2);
    ir11.add(20, 30, -2);
    ir11.add(40, 50, -2);
    assertRanges("intersperse zeroes 2", ir11.getAllRanges(), [[0, 2], [20, 0], [30, 2], [40, 0]]);

    console.log("Cancelling out operations");

    const ir12 = new IntensityRanges();
    ir12.add(0, 10, 5);
    ir12.add(0, 10, -5);
    assertRanges("cancel add", ir12.getAllRanges(), []);

    const ir13 = new IntensityRanges();
    ir13.set(0, 10, 5);
    ir13.set(0, 10, 0);
    assertRanges("revert set", ir13.getAllRanges(), []);

    const ir14 = new IntensityRanges();
    ir14.add(10, 20, 3);
    ir14.add(15, 25, -3);
    ir14.add(20, 25, 3);
    ir14.add(10, 15, -3);
    assertRanges("piece-wise cancel", ir14.getAllRanges(), []);

    const ir15 = new IntensityRanges();
    ir15.set(0, 100, 5);
    ir15.set(25, 75, 0);
    ir15.set(0, 100, 0);
    assertRanges("set cancel", ir15.getAllRanges(), []);

    console.log("Invalid range test cases (from > to)");

    const ir16 = new IntensityRanges();
    ir16.add(20, 10, 5);
    assertRanges("add from > to", ir16.getAllRanges(), []);

    ir16.set(15, -5, 3);
    assertRanges("set from > to", ir16.getAllRanges(), []);

    console.log("Tests passed");
}

test();