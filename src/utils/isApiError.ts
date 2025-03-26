type ApiError = {
  response: {
    data: {
      message: string;
    };
  };
};

function IsApiError(error: unknown): error is ApiError {
  if (typeof error !== "object" || error === null || !("response" in error)) {
    return false;
  }

  const maybeResponse = (error as { response?: unknown }).response;

  if (
    typeof maybeResponse !== "object" ||
    maybeResponse === null ||
    !("data" in maybeResponse)
  ) {
    return false;
  }

  const maybeData = (maybeResponse as { data?: unknown }).data;

  if (
    typeof maybeData !== "object" ||
    maybeData === null ||
    !("message" in maybeData)
  ) {
    return false;
  }

  const maybeMessage = (maybeData as { message?: unknown }).message;

  return typeof maybeMessage === "string";
}

export default IsApiError;
