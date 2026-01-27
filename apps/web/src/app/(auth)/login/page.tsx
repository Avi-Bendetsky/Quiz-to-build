'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton,
    Divider,
} from '@mui/material';
import { Visibility, VisibilityOff, Business as BusinessIcon } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/lib';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { login, isLoading, error, clearError } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        clearError();
        try {
            await login(data.email, data.password);
            router.push('/dashboard');
        } catch {
            // Error is handled by the store
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                p: 2,
            }}
        >
            <Card sx={{ maxWidth: 440, width: '100%' }}>
                <CardContent sx={{ p: 4 }}>
                    {/* Logo & Title */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 56,
                                height: 56,
                                borderRadius: 2,
                                bgcolor: 'primary.main',
                                color: 'white',
                                mb: 2,
                            }}
                        >
                            <BusinessIcon sx={{ fontSize: 32 }} />
                        </Box>
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                            Welcome Back
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Sign in to continue to Quiz2Biz
                        </Typography>
                    </Box>

                    {/* Error Alert */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
                            {error}
                        </Alert>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            {...register('email')}
                            label="Email Address"
                            type="email"
                            fullWidth
                            autoComplete="email"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            {...register('password')}
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            autoComplete="current-password"
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 3 }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={isLoading}
                            sx={{ mb: 2, py: 1.5 }}
                        >
                            {isLoading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>

                    <Divider sx={{ my: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                            or
                        </Typography>
                    </Divider>

                    {/* Register Link */}
                    <Typography variant="body2" textAlign="center" color="text.secondary">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" style={{ color: '#2563eb', fontWeight: 500 }}>
                            Sign up for free
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}
