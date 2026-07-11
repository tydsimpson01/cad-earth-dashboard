import type { RiotMappedError } from "./types";

export function mapRiotStatus(
  status: number,
  retryAfter?: string | null,
): RiotMappedError {
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

export function toRiotError(error: unknown): RiotMappedError {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    "message" in error
  ) {
    return error as RiotMappedError;
  }

  if (error instanceof Error && error.message.includes("response")) {
    return {
      code: "invalid_response",
      message: error.message,
    };
  }

  if (error instanceof Error) {
    return {
      code: "network",
      message: error.message,
    };
  }

  return {
    code: "unknown",
    message: "An unknown Riot API error occurred.",
  };
}
