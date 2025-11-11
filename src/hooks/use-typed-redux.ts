import {
  useDispatch,
  useSelector,
  shallowEqual,
  type TypedUseSelectorHook,
} from 'react-redux';
import type { RootState, AppDispatch } from '../store';

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = (selector) =>
  useSelector(selector, shallowEqual);
