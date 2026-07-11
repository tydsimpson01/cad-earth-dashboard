import assert from "node:assert/strict";
import test from "node:test";

function parseRiotId(value) {
  const trimmed = value.trim();
  const separator = trimmed.lastIndexOf("#");

  if (separator <= 0 || separator === trimmed.length - 1) return null;

  const gameName = trimmed.slice(0, separator).trim();
  const tagLine = trimmed.slice(separator + 1).trim();

  if (
    !gameName ||
    !tagLine ||
    gameName.includes("#") ||
    tagLine.includes("#")
  ) {
    return null;
  }

  return {
    gameName,
    tagLine,
    riotId: `${gameName}#${tagLine}`,
  };
}

function validateRiotAccount(value) {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    typeof value.puuid !== "string" ||
    typeof value.gameName !== "string" ||
    typeof value.tagLine !== "string"
  ) {
    throw new Error(
      "Riot Account-v1 response did not match the expected shape.",
    );
  }

  return {
    puuid: value.puuid,
    gameName: value.gameName,
    tagLine: value.tagLine,
  };
}

function mapRiotStatus(status, retryAfter = null) {
  if (status === 401 || status === 403) {
    return {
      code: "unauthorized",
      status,
      message:
        "Riot API key is missing, expired, invalid, or not allowed for this route.",
      retryAfter,
    };
  }

  if (status === 404) {
    return {
      code: "not_found",
      status,
      message: "Riot player or match was not found.",
      retryAfter,
    };
  }

  if (status === 429) {
    return {
      code: "rate_limited",
      status,
      message: "Riot API rate limit was reached. Wait before retrying.",
      retryAfter,
    };
  }

  if (status >= 500) {
    return {
      code: "outage",
      status,
      message: "Riot API is currently unavailable or returning server errors.",
      retryAfter,
    };
  }

  return {
    code: "unknown",
    status,
    message: `Riot API returned HTTP ${status}.`,
    retryAfter,
  };
}

test("parses valid Riot IDs and rejects malformed values", () => {
  assert.deepEqual(parseRiotId(" Aigis#SEES "), {
    gameName: "Aigis",
    tagLine: "SEES",
    riotId: "Aigis#SEES",
  });
  assert.equal(parseRiotId("missing-tag"), null);
  assert.equal(parseRiotId("too#many#parts"), null);
});

test("validates Account-v1 responses", () => {
  assert.deepEqual(
    validateRiotAccount({
      puuid: "p",
      gameName: "chico",
      tagLine: "3456",
    }),
    {
      puuid: "p",
      gameName: "chico",
      tagLine: "3456",
    },
  );
  assert.throws(
    () => validateRiotAccount({ puuid: "p" }),
    /expected shape/,
  );
});

test("maps Riot HTTP errors to user-facing categories", () => {
  assert.equal(mapRiotStatus(403).code, "unauthorized");
  assert.equal(mapRiotStatus(404).code, "not_found");
  assert.deepEqual(mapRiotStatus(429, "120"), {
    code: "rate_limited",
    status: 429,
    message: "Riot API rate limit was reached. Wait before retrying.",
    retryAfter: "120",
  });
  assert.equal(mapRiotStatus(503).code, "outage");
});
