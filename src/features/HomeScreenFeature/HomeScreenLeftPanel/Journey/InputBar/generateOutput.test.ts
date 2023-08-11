import { generateOutput } from "./generateOutput";

describe("generate output", () => {
  describe("input is null", () => {
    it("returns null values for unitOfTime and timeRemaining", () => {
      expect(generateOutput(null, null)).toEqual({ unitOfTime: null, timeRemaining: null });
    });
  });
  describe("minutes", () => {
    it("returns units in minutes if minutes greater than 1", () => {
      expect(generateOutput(5, 12)).toEqual({ unitOfTime: "minutes", timeRemaining: 5 });
    });
  });
  describe("seconds", () => {
    it("returns units in seconds if minutes less than 1 and seconds greater than 1", () => {
      expect(generateOutput(1, 12)).toEqual({ unitOfTime: "seconds", timeRemaining: 12 });
    });
  });
  describe("second", () => {
    it("returns units as second if minutes less than one and seconds equal one", () => {
      expect(generateOutput(1, 1)).toEqual({ unitOfTime: "second", timeRemaining: 1 });
    });
  });
});
