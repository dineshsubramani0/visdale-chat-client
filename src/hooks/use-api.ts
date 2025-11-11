import client from '@/api/client';
import { useApiError } from '@/hooks/use-api-error';
import type { AxiosResponse } from 'axios';
import { toast } from 'sonner';

export const useApi = () => {
  const handleError = useApiError();

  const axiosMethods = {
    GET: (url: string) => client.get(url),
    POST: (url: string, data?: unknown) => client.post(url, data),
    PUT: (url: string, data?: unknown) => client.put(url, data),
    PATCH: (url: string, data?: unknown) => client.patch(url, data),
    DELETE: (url: string) => client.delete(url),
  } as const;

  const fetchData = async <T>(
    url: string,
    method: keyof typeof axiosMethods = 'GET',
    params?: string,
    payload?: unknown,
    successMessage?: string,
    ErrorMessage?: string
  ): Promise<T | null> => {
    try {
      let fullUrl = url;
      if (params) {
        fullUrl += `?${params}`;
      }

      const response: AxiosResponse =
        method === 'GET' || method === 'DELETE'
          ? await axiosMethods[method](fullUrl)
          : await axiosMethods[method](fullUrl, payload);

      const data = response.data;

      if (successMessage && data?.success === true) {
        toast.dismiss();
        toast.success(data?.message ?? successMessage);
      }

      if (data?.success === false && data?.message) {
        toast.dismiss();
        toast.error(data?.message);
      }

      return data;
    } catch (error) {
      handleError(error, ErrorMessage);
      return null;
    }
  };

  return { fetchData };
};
