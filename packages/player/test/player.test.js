import test from "node:test";
import assert from "node:assert/strict";
import { formatTime, clamp } from "../dist/index.js";

test("formatTime: correctly formats seconds into MM:SS", () => {
  assert.equal(formatTime(0), "00:00");
  assert.equal(formatTime(5), "00:05");
  assert.equal(formatTime(65), "01:05");
  assert.equal(formatTime(599), "09:59");
});

test("formatTime: correctly formats seconds into HH:MM:SS for longer videos", () => {
  assert.equal(formatTime(3600), "1:00:00");
  assert.equal(formatTime(3665), "1:01:05");
  assert.equal(formatTime(7322), "2:02:02");
});

test("formatTime: handles invalid and negative values safely", () => {
  assert.equal(formatTime(-10), "00:00");
  assert.equal(formatTime(NaN), "00:00");
});

test("clamp: restricts numbers to within boundaries", () => {
  assert.equal(clamp(0.5, 0, 1), 0.5);
  assert.equal(clamp(1.5, 0, 1), 1);
  assert.equal(clamp(-0.5, 0, 1), 0);
  assert.equal(clamp(50, 10, 100), 50);
  assert.equal(clamp(5, 10, 100), 10);
  assert.equal(clamp(150, 10, 100), 100);
});
