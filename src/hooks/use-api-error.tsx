import { toast } from 'sonner';

type ApiErrorType =
  | string
  | string[]
  | { message?: string; errors?: string[] }
  | undefined;

export const useApiError = () => {
  return (error: ApiErrorType, defaultMessage?: string): string => {
    let errorMessage = 'An unexpected error occurred';

    if (!error) {
      errorMessage = defaultMessage ?? errorMessage;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (Array.isArray(error)) {
      errorMessage = error.join(', ');
    } else if (typeof error === 'object') {
      if (error.message) errorMessage = error.message;
      else if (error.errors) errorMessage = error.errors.join(', ');
      else errorMessage = JSON.stringify(error);
    }

    toast.dismiss();
    toast.error(defaultMessage ?? errorMessage);

    return errorMessage;
  };
};
