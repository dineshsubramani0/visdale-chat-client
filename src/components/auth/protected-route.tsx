import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AUTH_LOGIN_ROUTES_CONSTANT } from '@/routers/app/auth/login/auth-login-routes.constant';
import { AUTH_REGISTER_ROUTES_CONSTANT } from '@/routers/app/auth/register/auth-register-routes.constant';
import { SessionStorageUtils } from '@/lib/session-storage-utils';
import { CHAT_ROUTES_CONSTANT } from '@/routers/app/chat/chat-routes.constant';
import type { UserProfile } from '@/@types/auth/user.inferface';
import { decrypt } from '@/lib/encryption';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * ProtectedRoute checks if a user is authenticated.
 * - Redirects unauthenticated users to login page
 * - Redirects authenticated users away from login/register pages
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const storedValue = SessionStorageUtils.getItem('_ud');

  let _ud: UserProfile | null = null;

  if (storedValue) {
    const decrypted = decrypt(storedValue as string); // returns string
    _ud = JSON.parse(decrypted as string) as UserProfile;
  }

  const currentPath = location.pathname.replace(/\/$/, '');

  const accessToken = SessionStorageUtils.getItem('access_token');
  const isAuthenticated = !!accessToken;

  // Prevent authenticated users from visiting login or register
  const isAuthPage =
    currentPath === AUTH_LOGIN_ROUTES_CONSTANT.LOGIN_PAGE ||
    currentPath === AUTH_REGISTER_ROUTES_CONSTANT.REGISTER_PAGE;

  if (isAuthenticated && isAuthPage) {
    return <Navigate to={`${CHAT_ROUTES_CONSTANT.CHAT}/${_ud?.id}`} replace />;
  }

  // Protect other routes: redirect unauthenticated users to login
  const isProtectedRoute = !isAuthPage;
  if (!isAuthenticated && isProtectedRoute) {
    return (
      <Navigate
        to={AUTH_LOGIN_ROUTES_CONSTANT.LOGIN_PAGE}
        replace
        state={{ from: location }}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
