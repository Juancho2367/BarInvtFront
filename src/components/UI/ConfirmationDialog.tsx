import React from 'react';
import { Dialog } from '@headlessui/react';
import Button from './Button';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const variantClasses = {
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
  };

  const buttonVariants = {
    danger: 'danger',
    warning: 'primary',
    info: 'primary',
  } as const;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex min-h-screen items-center justify-center">
        <div className="fixed inset-0 bg-black opacity-30" />

        <Dialog.Panel className="relative mx-auto max-w-sm rounded-lg bg-white p-6 shadow-xl">
          <Dialog.Title
            as="h3"
            className={`text-lg font-medium ${variantClasses[variant]}`}
          >
            {title}
          </Dialog.Title>

          <div className="mt-2">
            <p className="text-sm text-gray-500">{message}</p>
          </div>

          <div className="mt-4 flex justify-end space-x-3">
            <Button variant="secondary" onClick={onClose}>
              {cancelText}
            </Button>
            <Button variant={buttonVariants[variant]} onClick={handleConfirm}>
              {confirmText}
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ConfirmationDialog;

 