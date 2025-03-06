'use client';

import { ThemeProvider } from '@/components/ui/theme-provider';
import React from 'react';

import { store } from '@/redux/store';
import { ClerkProvider } from '@clerk/nextjs';
import { Provider } from 'react-redux';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <Provider store={store}>
        <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
      </Provider>
    </ClerkProvider>
  );
};

export default Providers;
