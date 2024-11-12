import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slices/authSlice';
import optionReducer from './Slices/optionsSlice';
import tableReducer from './Slices/tableSlice';

const store = configureStore({
  reducer: {
    auth:authReducer,
    options:optionReducer,
    table:tableReducer,
  },
});

export default store;