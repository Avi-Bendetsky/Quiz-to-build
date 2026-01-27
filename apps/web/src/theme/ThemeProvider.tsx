'use client';

import { ReactNode, useState, useMemo } from 'react';
import { ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { SnackbarProvider } from 'notistack';
import { theme, darkTheme } from './theme';

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [mode, setMode] = useState<'light' | 'dark'>('light');

    const currentTheme = useMemo(() => {
        return mode === 'light' ? theme : darkTheme;
    }, [mode]);

    return (
        <AppRouterCacheProvider options={{ key: 'mui' }}>
            <MUIThemeProvider theme={currentTheme}>
                <CssBaseline />
                <SnackbarProvider
                    maxSnack={3}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    autoHideDuration={4000}
                >
                    {children}
                </SnackbarProvider>
            </MUIThemeProvider>
        </AppRouterCacheProvider>
    );
}
