import { combineReducers } from '@reduxjs/toolkit';
import { socketReducer } from './features/socket';

const combinedReducers = {
  ...socketReducer,
};

const rootReducer = combineReducers(combinedReducers);

export default rootReducer;
