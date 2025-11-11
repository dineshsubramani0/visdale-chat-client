import { AxiosError } from 'axios';
import { toast } from 'sonner';

export const useApiError = () => {
  return (error: unknown, defaultMessage: string | undefined) => {
    let errorMessage = '';

    if (error instanceof AxiosError) {
      if (!error.response) {
        errorMessage = 'Network error: Unable to connect to the server.';
      } else {
        errorMessage =
          error.response.data ||
          error.response.data?.message ||
          error.response.statusText ||
          `Error ${error.response.status}: An unknown error occurred.`;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    if (defaultMessage) {
      toast.error(defaultMessage);
    }

    return errorMessage;
  };
};
