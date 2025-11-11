import loginReducer from './login-slice';
import { LOGIN_SLICE_NAME } from './auth-constant';

export const authReducer = {
  [LOGIN_SLICE_NAME]: loginReducer,
};
