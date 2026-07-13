import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateBhagyank,
  calculateMoolank,
  isNumerologyNumber,
  isValidIsoDate,
} from "../src/lib/numerology";

test("accepts valid calendar dates, including leap days", () => {
  assert.equal(isValidIsoDate("2024-02-29"), true);
  assert.equal(calculateMoolank("2024-02-29"), 2);
  assert.equal(calculateBhagyank("2024-02-29"), 3);
});

test("rejects malformed and impossible dates", () => {
  for (const dob of ["2025-02-29", "2025-02-31", "2025-13-01", "2025-2-01", "", "not-a-date"]) {
    assert.equal(isValidIsoDate(dob), false, dob);
  }
  assert.throws(() => calculateMoolank("2025-02-31"));
});

test("only accepts manual numerology values from 1 to 9", () => {
  for (const value of [1, 9, "1", "9"]) assert.equal(isNumerologyNumber(value), true);
  for (const value of [0, 10, -1, 1.5, "NaN", "", null]) assert.equal(isNumerologyNumber(value), false);
});
