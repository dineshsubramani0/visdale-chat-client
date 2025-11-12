import { SOCKET_SLICE_NAME } from './socket.constant';
import socketSlice from './socket.slice';

export const socketReducer = {
  [SOCKET_SLICE_NAME]: socketSlice,
};
