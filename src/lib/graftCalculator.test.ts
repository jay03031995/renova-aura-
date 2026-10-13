import assert from "node:assert/strict";
import test from "node:test";
import { calculateGrafts, GRAFT_ZONES, NORWOOD_STAGES } from "./graftCalculator";

test("offers all requested Norwood stages and stage-guided zones", () => {
  assert.deepEqual(NORWOOD_STAGES.map((stage) => stage.value), [
    "1", "2", "2A", "3", "3V", "4", "4A", "5", "5A", "6",
  ]);
  assert.deepEqual(NORWOOD_STAGES.find((stage) => stage.value === "3V")?.zones, [1, 2, 5, 7]);
  assert.deepEqual(NORWOOD_STAGES.find((stage) => stage.value === "6")?.zones, GRAFT_ZONES);
});

test("calculates one zone from its severity band and rounds to hundreds", () => {
  const result = calculateGrafts([{ zone: 1, severity: "mild" }]);
  assert.deepEqual({ low: result.low, high: result.high }, { low: 200, high: 400 });
  assert.equal(result.zones.length, 1);
});

test("adds multiple selected zones once and reports a consistent total", () => {
  const result = calculateGrafts([
    { zone: 1, severity: "mild" },
    { zone: 2, severity: "moderate" },
    { zone: 7, severity: "severe" },
  ]);
  assert.deepEqual(result.zones.map(({ low, high }) => [low, high]), [
    [200, 400], [400, 800], [500, 1_000],
  ]);
  assert.equal(result.low, result.zones.reduce((sum, zone) => sum + zone.low, 0));
  assert.equal(result.high, result.zones.reduce((sum, zone) => sum + zone.high, 0));
});

test("rejects an empty selection, invalid zones, duplicates, and invalid severity", () => {
  assert.throws(() => calculateGrafts([]), /at least one scalp zone/);
  assert.throws(() => calculateGrafts([{ zone: 9 as never, severity: "mild" }]), /scalp zone/);
  assert.throws(() => calculateGrafts([
    { zone: 2, severity: "mild" }, { zone: 2, severity: "moderate" },
  ]), /no more than once/);
  assert.throws(() => calculateGrafts([{ zone: 4, severity: "extreme" as never }]), /severity/);
});
