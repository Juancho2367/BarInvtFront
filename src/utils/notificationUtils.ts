type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

let notifications: Notification[] = [];
let listeners: ((notifications: Notification[]) => void)[] = [];

export const addNotification = (
  type: NotificationType,
  message: string,
  duration: number = 5000
): string => {
  const id = Math.random().toString(36).substring(7);
  const notification: Notification = {
    id,
    type,
    message,
    duration,
  };

  notifications = [...notifications, notification];
  notifyListeners();

  if (duration > 0) {
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }

  return id;
};

export const removeNotification = (id: string): void => {
  notifications = notifications.filter((notification) => notification.id !== id);
  notifyListeners();
};

export const subscribe = (listener: (notifications: Notification[]) => void): (() => void) => {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};

const notifyListeners = (): void => {
  listeners.forEach((listener) => listener(notifications));
};

// Convenience methods
export const notify = {
  success: (message: string, duration?: number) =>
    addNotification('success', message, duration),
  error: (message: string, duration?: number) =>
    addNotification('error', message, duration),
  warning: (message: string, duration?: number) =>
    addNotification('warning', message, duration),
  info: (message: string, duration?: number) =>
    addNotification('info', message, duration),
}; 