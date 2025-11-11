import { AUTH_LOGIN_ROUTES_CONSTANT } from '@/routers/app/auth/login/auth-login-routes.constant';
import { toast } from 'sonner';
import { LocalStorageUtils } from './local-storage-utils';

/**
 * Logs out the user by clearing session storage, signing out from Azure, and redirecting.
 * @param {IPublicClientApplication} msalInstance - The initialized MSAL instance.
 */
export const logout = async () => {
  try {
    toast.success('You have been logged out');
    // Redirect to the login page
    // localStorage.clear();
    LocalStorageUtils.removeItem('chat_user');
    setTimeout(() => {
      window.location.href = AUTH_LOGIN_ROUTES_CONSTANT.LOGIN_PAGE;
    }, 1500);
  } catch (error) {
    console.error('Logout failed:', error);
    toast.error('Logout failed. Please try again.');
  }
};
