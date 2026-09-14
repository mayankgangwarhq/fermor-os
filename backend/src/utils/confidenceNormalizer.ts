/**
 * AGRINEXT Centralized Confidence Normalization Utility
 *
 * Normalizes any raw confidence input (from AI Vision models, user overrides, or API payloads)
 * into a valid decimal between 0.0 and 1.0, or returns null if invalid/unavailable.
 *
 * Supported inputs:
 * - 0.78       -> 0.78
 * - 78         -> 0.78
 * - "0.78"     -> 0.78
 * - "78%"      -> 0.78
 * - "78"       -> 0.78
 * - 0.42       -> 0.42
 * - null/undef -> null (never defaults to 1 or 100%)
 */
export function normalizeConfidenceDecimal(val: any): number | null {
  if (val === null || val === undefined) {
    return null;
  }

  let num: number;

  if (typeof val === 'number') {
    if (isNaN(val) || !isFinite(val)) {
      return null;
    }
    num = val;
  } else if (typeof val === 'string') {
    const trimmed = val.trim();
    if (
      !trimmed ||
      trimmed.toLowerCase() === 'n/a' ||
      trimmed.toLowerCase() === 'null' ||
      trimmed.toLowerCase() === 'unknown'
    ) {
      return null;
    }
    if (trimmed.endsWith('%')) {
      const parsed = parseFloat(trimmed.slice(0, -1));
      if (isNaN(parsed) || !isFinite(parsed)) return null;
      num = parsed > 1 ? parsed / 100 : parsed;
    } else {
      const parsed = parseFloat(trimmed);
      if (isNaN(parsed) || !isFinite(parsed)) return null;
      num = parsed;
    }
  } else {
    return null;
  }

  // Range validation and normalization to [0.0, 1.0]
  if (num >= 0 && num <= 1) {
    return Math.round(num * 10000) / 10000;
  }

  if (num > 1 && num <= 100) {
    return Math.round((num / 100) * 10000) / 10000;
  }

  // Reject out of bounds values (< 0 or > 100)
  return null;
}

/**
 * Converts a normalized decimal [0.0, 1.0] to an integer percentage [0, 100].
 * If confidence is null or invalid, returns fallback (default: 0).
 */
export function confidenceToScorePercentage(decimal: number | null, fallback: number = 0): number {
  if (decimal === null || decimal === undefined || isNaN(decimal)) {
    return fallback;
  }
  return Math.max(0, Math.min(100, Math.round(decimal * 100)));
}
