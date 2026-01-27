import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from './api';

export interface User {
    id: string;
    email: string;
    name?: string;
    role: 'CLIENT' | 'DEVELOPER' | 'ADMIN' | 'SUPER_ADMIN';
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    fetchProfile: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.login(email, password);
                    api.setTokens(response.accessToken, response.refreshToken);
                    set({
                        user: response.user,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error: unknown) {
                    const message = error instanceof Error ? error.message : 'Login failed';
                    set({ error: message, isLoading: false });
                    throw error;
                }
            },

            register: async (email: string, password: string, name: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.register(email, password, name);
                    api.setTokens(response.accessToken, response.refreshToken);
                    set({
                        user: response.user,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error: unknown) {
                    const message = error instanceof Error ? error.message : 'Registration failed';
                    set({ error: message, isLoading: false });
                    throw error;
                }
            },

            logout: async () => {
                try {
                    await api.logout();
                } finally {
                    set({ user: null, isAuthenticated: false });
                }
            },

            fetchProfile: async () => {
                set({ isLoading: true });
                try {
                    const user = await api.getProfile();
                    set({ user, isAuthenticated: true, isLoading: false });
                } catch {
                    set({ user: null, isAuthenticated: false, isLoading: false });
                }
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
);
