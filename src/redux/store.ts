import { configureStore } from '@reduxjs/toolkit';
import snippetReducer from './slices/snippetSlice';

export const store = configureStore({
  reducer: {
    snippets: snippetReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
