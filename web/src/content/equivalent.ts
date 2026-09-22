import { normalizeSubmission } from "./check";
import type { CriterionResult, EquivalentCriterion } from "./types";
import { create, all } from "mathjs"

const MAX_EXPRESSION_LENGTH = 500;

export function checkEquivalent(
  _criterion: EquivalentCriterion,
  _submission: unknown,
): CriterionResult {
  const reason_code = _criterion.reason_code;

  if (typeof _submission !== "string") {
    return {
      passed: false,
      reason_code,
      error: "Submission is not a string",
    };
  }

  if (typeof _criterion.expected !== "string") {
    return {
      passed: false,
      reason_code,
      error: "Expected value is not a string",
    }
  }

  if (_criterion.expected === "") {
    return {
      passed: false,
      reason_code,
      error: "Expected value is empty",
    };
  }

  if (_submission === "") {
    return {
      passed: false,
      reason_code,
      error: "Submission value is empty",
    };
  }

  if (_submission.length > MAX_EXPRESSION_LENGTH || _criterion.expected.length > MAX_EXPRESSION_LENGTH) {
    return {
      passed: false,
      reason_code,
      error: "Expression is too long",
    };
  }

  try {
    const math = create(all);

    const expected = math.parse(normalizeSubmission(_criterion.expected));
    const submission = math.parse(normalizeSubmission(_submission));

    const difference = math
    .simplify(`${expected} - (${submission})`)
    .toString();

    if (difference === "0") {
      return {
        passed: true,
      };
    }

    return {
      passed: false,
      reason_code,
    };
  } catch {
    return {
      passed: false,
      error: "Invalid expression",
    };
  }
}
