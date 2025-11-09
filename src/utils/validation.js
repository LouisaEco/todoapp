export const ValidationRules = {
  TITLE_MIN_LENGTH: 1,
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 2000,
};

export function validateTaskTitle(title) {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: 'Task title cannot be empty.' };
  }

  if (title.length > ValidationRules.TITLE_MAX_LENGTH) {
    return {
      valid: false,
      error: `Title must be less than ${ValidationRules.TITLE_MAX_LENGTH} characters.`,
    };
  }

  return { valid: true };
}

export function validateTaskDescription(description) {
  if (description && description.length > ValidationRules.DESCRIPTION_MAX_LENGTH) {
    return {
      valid: false,
      error: `Description must be less than ${ValidationRules.DESCRIPTION_MAX_LENGTH} characters.`,
    };
  }

  return { valid: true };
}

export function validateDueDate(dateString) {
  if (!dateString) {
    return { valid: true };
  }

  const today = new Date();
  const selectedDate = new Date(dateString);

  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return { valid: false, error: 'Due date cannot be in the past.' };
  }

  return { valid: true };
}

export function validatePriority(priority) {
  const validPriorities = ['Low', 'Medium', 'High'];

  if (!validPriorities.includes(priority)) {
    return {
      valid: false,
      error: `Priority must be one of: ${validPriorities.join(', ')}`,
    };
  }

  return { valid: true };
}

export function validateTask(task) {
  const errors = [];

  const titleValidation = validateTaskTitle(task.title);
  if (!titleValidation.valid) {
    errors.push(titleValidation.error);
  }

  const descriptionValidation = validateTaskDescription(task.description);
  if (!descriptionValidation.valid) {
    errors.push(descriptionValidation.error);
  }

  const dateValidation = validateDueDate(task.dueDate);
  if (!dateValidation.valid) {
    errors.push(dateValidation.error);
  }

  const priorityValidation = validatePriority(task.priority);
  if (!priorityValidation.valid) {
    errors.push(priorityValidation.error);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function isPastDate(dateString) {
  if (!dateString) return false;

  const today = new Date();
  const chosenDate = new Date(dateString);

  today.setHours(0, 0, 0, 0);
  chosenDate.setHours(0, 0, 0, 0);

  return chosenDate < today;
}

export function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
