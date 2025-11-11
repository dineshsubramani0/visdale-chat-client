import { redirect } from 'react-router-dom';
import { REDIRECT_ROUTES_CONSTANT } from './redirect-routes.constant';
import GlobalErrorBoundary from '@/components/error/global-error-boundary';

export const RedirectRoutes = [
  {
    path: REDIRECT_ROUTES_CONSTANT.BASE_URL,
    loader: async () => redirect(REDIRECT_ROUTES_CONSTANT.LOGIN_PAGE),
    errorElement: <GlobalErrorBoundary />,
  },
];
