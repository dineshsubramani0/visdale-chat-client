import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from './features/auth';

const combinedReducers = {
  ...authReducer,
};

const rootReducer = combineReducers(combinedReducers);

export default rootReducer;
