export function reduceToSingleDigit(value: number): number {
  let result = value;
  while (result > 9) {
    result = result
      .toString()
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
  }
  return result;
}

export function isValidIsoDate(value: unknown): value is string {
  if (typeof value !== "string") return false;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  if (year < 1000 || month < 1 || month > 12 || day < 1 || day > 31) return false;

  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day;
}

function requireValidIsoDate(dob: unknown): asserts dob is string {
  if (!isValidIsoDate(dob)) {
    throw new Error("Date of Birth must be a valid YYYY-MM-DD value.");
  }
}

export function calculateMoolank(dob: string): number {
  requireValidIsoDate(dob);
  return reduceToSingleDigit(Number(dob.slice(8, 10)));
}

export function calculateBhagyank(dob: string): number {
  requireValidIsoDate(dob);
  const digitSum = dob.replaceAll("-", "").split("").reduce((sum, digit) => sum + Number(digit), 0);
  return reduceToSingleDigit(digitSum);
}

export function isNumerologyNumber(value: unknown): value is number | string {
  const parsed = typeof value === "number" ? value : typeof value === "string" && value.trim() !== "" ? Number(value) : NaN;
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 9;
}
