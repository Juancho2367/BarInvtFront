export const required = (value: any): string | undefined => {
  if (value === undefined || value === null || value === '') {
    return 'This field is required';
  }
  return undefined;
};

export const minLength = (min: number) => (value: string): string | undefined => {
  if (value && value.length < min) {
    return `Must be at least ${min} characters`;
  }
  return undefined;
};

export const maxLength = (max: number) => (value: string): string | undefined => {
  if (value && value.length > max) {
    return `Must be at most ${max} characters`;
  }
  return undefined;
};

export const email = (value: string): string | undefined => {
  if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
    return 'Invalid email address';
  }
  return undefined;
};

export const phone = (value: string): string | undefined => {
  if (value && !/^\+?[\d\s-]{10,}$/.test(value)) {
    return 'Invalid phone number';
  }
  return undefined;
};

export const number = (value: any): string | undefined => {
  if (value && isNaN(Number(value))) {
    return 'Must be a number';
  }
  return undefined;
};

export const min = (min: number) => (value: number): string | undefined => {
  if (value && value < min) {
    return `Must be at least ${min}`;
  }
  return undefined;
};

export const max = (max: number) => (value: number): string | undefined => {
  if (value && value > max) {
    return `Must be at most ${max}`;
  }
  return undefined;
};

export const composeValidators = (...validators: ((value: any) => string | undefined)[]) => (
  value: any
): string | undefined => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) {
      return error;
    }
  }
  return undefined;
}; 