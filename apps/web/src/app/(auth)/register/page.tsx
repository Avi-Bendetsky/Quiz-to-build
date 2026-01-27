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

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const { register: registerUser, isLoading, error, clearError } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        clearError();
        try {
            await registerUser(data.email, data.password, data.name);
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
                            Create Account
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Get started with Quiz2Biz for free
                        </Typography>
                    </Box>

                    {/* Error Alert */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
                            {error}
                        </Alert>
                    )}

                    {/* Register Form */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            {...register('name')}
                            label="Full Name"
                            fullWidth
                            autoComplete="name"
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            sx={{ mb: 2 }}
                        />

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
                            autoComplete="new-password"
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
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            {...register('confirmPassword')}
                            label="Confirm Password"
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            autoComplete="new-password"
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
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
                                'Create Account'
                            )}
                        </Button>
                    </form>

                    <Divider sx={{ my: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                            or
                        </Typography>
                    </Divider>

                    {/* Login Link */}
                    <Typography variant="body2" textAlign="center" color="text.secondary">
                        Already have an account?{' '}
                        <Link href="/login" style={{ color: '#2563eb', fontWeight: 500 }}>
                            Sign in
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}
