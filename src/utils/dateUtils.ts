import { format, parseISO, isValid } from 'date-fns';

export const formatDate = (date: Date | string, formatStr: string = 'MMM dd, yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) {
      throw new Error('Invalid date');
    }
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
};

export const formatDateTime = (date: Date | string): string => {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
};

export const formatTime = (date: Date | string): string => {
  return formatDate(date, 'HH:mm');
};

export const formatDateForInput = (date: Date | string): string => {
  return formatDate(date, 'yyyy-MM-dd');
};

export const formatTimeForInput = (date: Date | string): string => {
  return formatDate(date, 'HH:mm');
};

export const formatDateTimeForInput = (date: Date | string): string => {
  return formatDate(date, "yyyy-MM-dd'T'HH:mm");
}; 