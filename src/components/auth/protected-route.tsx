import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AUTH_LOGIN_ROUTES_CONSTANT } from '@/routers/app/auth/login/auth-login-routes.constant';
import { AUTH_REGISTER_ROUTES_CONSTANT } from '@/routers/app/auth/register/auth-register-routes.constant';
import { LocalStorageUtils } from '@/lib/local-storage-utils';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const currentPath = location.pathname.replace(/\/$/, '');

  // Get user session
  const _ud = LocalStorageUtils.getItem('chat_user');
  const isAuthenticated = !!_ud;

  // If authenticated, redirect away from login or register page
  if (
    isAuthenticated &&
    (currentPath === AUTH_LOGIN_ROUTES_CONSTANT.LOGIN_PAGE ||
      currentPath === AUTH_REGISTER_ROUTES_CONSTANT.REGISTER_PAGE)
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  // If not authenticated, redirect to login from protected routes
  if (
    !isAuthenticated &&
    currentPath !== AUTH_LOGIN_ROUTES_CONSTANT.LOGIN_PAGE &&
    currentPath !== AUTH_REGISTER_ROUTES_CONSTANT.REGISTER_PAGE
  ) {
    return <Navigate to={AUTH_LOGIN_ROUTES_CONSTANT.LOGIN_PAGE} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
