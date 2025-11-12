export const QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
      cacheTime: 1000 * 60 * 10, // Unused queries stay cached for 10 minutes
      refetchOnWindowFocus: true, // Prevent unnecessary refetch on window focus
      refetchOnReconnect: true, // Refetch when network reconnects
      retry: false, // Disable automatic retries
      suspense: false,
    },
    mutations: {
      retry: false, // Disable retries for mutations as well
    },
  },
};
