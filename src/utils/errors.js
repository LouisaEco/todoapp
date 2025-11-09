export const ErrorMessages = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TASK_NOT_FOUND: 'Task not found.',
  INVALID_TASK: 'Invalid task data.',
  EMPTY_TITLE: 'Task title cannot be empty.',
  PAST_DATE: 'Due date cannot be in the past.',
  LOAD_FAILED: 'Failed to load tasks.',
  ADD_FAILED: 'Failed to add task.',
  UPDATE_FAILED: 'Failed to update task.',
  DELETE_FAILED: 'Failed to delete task.',
  VALIDATION_ERROR: 'Please check your input and try again.',
};

export class APIError extends Error {
  constructor(message, status = null, details = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
  }
}

export async function handleFetchResponse(response) {
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorData;

    try {
      if (contentType?.includes('application/json')) {
        errorData = await response.json();
      } else {
        errorData = await response.text();
      }
    } catch {
      errorData = null;
    }

    const errorMessage = errorData?.message || ErrorMessages.SERVER_ERROR;
    throw new APIError(errorMessage, response.status, errorData);
  }

  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return await response.json();
  }

  return response;
}

export function isNetworkError(error) {
  return error instanceof TypeError || error?.name === 'NetworkError';
}

export function isValidationError(error) {
  return error?.status === 400 || error?.name === 'ValidationError';
}

export function getErrorMessage(error) {
  if (error instanceof APIError) {
    return error.message;
  }

  if (isNetworkError(error)) {
    return ErrorMessages.NETWORK_ERROR;
  }

  if (error?.message) {
    return error.message;
  }

  return ErrorMessages.SERVER_ERROR;
}
