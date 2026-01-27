'use client';

import { createTheme, ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#2563eb', // Blue-600
            light: '#3b82f6',
            dark: '#1d4ed8',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#7c3aed', // Violet-600
            light: '#8b5cf6',
            dark: '#6d28d9',
            contrastText: '#ffffff',
        },
        error: {
            main: '#dc2626',
        },
        warning: {
            main: '#f59e0b',
        },
        success: {
            main: '#10b981',
        },
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
        text: {
            primary: '#1e293b',
            secondary: '#64748b',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
            lineHeight: 1.2,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
            lineHeight: 1.3,
        },
        h3: {
            fontSize: '1.5rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h4: {
            fontSize: '1.25rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h5: {
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: 1.5,
        },
        h6: {
            fontSize: '0.875rem',
            fontWeight: 600,
            lineHeight: 1.5,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.6,
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '10px 24px',
                    fontSize: '0.9375rem',
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                size: 'medium',
            },
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    color: '#1e293b',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    height: 8,
                    backgroundColor: '#e2e8f0',
                },
                bar: {
                    borderRadius: 4,
                },
            },
        },
    },
};

export const theme = createTheme(themeOptions);

// Dark theme variant
export const darkTheme = createTheme({
    ...themeOptions,
    palette: {
        ...themeOptions.palette,
        mode: 'dark',
        background: {
            default: '#0f172a',
            paper: '#1e293b',
        },
        text: {
            primary: '#f1f5f9',
            secondary: '#94a3b8',
        },
    },
});
