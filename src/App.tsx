import { RouterProvider } from 'react-router-dom';
import { AppRouters } from './routers/routes';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QueryClientConfig } from './config/query-client.config';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'react-redux';
import store from './store';
import { ThemeProvider } from './context/theme-provider';

const queryClient = new QueryClient(QueryClientConfig);
function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <RouterProvider router={AppRouters} />
          <Toaster richColors position="top-center" />
          {/* <ReactQueryDevtools initialIsOpen /> */}
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
