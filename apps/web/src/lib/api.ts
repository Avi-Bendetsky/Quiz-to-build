import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 30000,
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor - add auth token
        this.client.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const token = this.getAccessToken();
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor - handle token refresh
        this.client.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error) => {
                const originalRequest = error.config;

                // If 401 and not already retrying, attempt token refresh
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const refreshToken = this.getRefreshToken();
                        if (refreshToken) {
                            const response = await this.client.post('/auth/refresh', {
                                refreshToken,
                            });

                            const { accessToken } = response.data;
                            this.setAccessToken(accessToken);

                            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                            return this.client(originalRequest);
                        }
                    } catch (refreshError) {
                        // Refresh failed, clear tokens and redirect to login
                        this.clearTokens();
                        if (typeof window !== 'undefined') {
                            window.location.href = '/login';
                        }
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    private getAccessToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('accessToken');
        }
        return null;
    }

    private getRefreshToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('refreshToken');
        }
        return null;
    }

    private setAccessToken(token: string) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', token);
        }
    }

    public setTokens(accessToken: string, refreshToken: string) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
        }
    }

    public clearTokens() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    }

    // Auth endpoints
    async login(email: string, password: string) {
        const response = await this.client.post('/auth/login', { email, password });
        return response.data;
    }

    async register(email: string, password: string, name: string) {
        const response = await this.client.post('/auth/register', { email, password, name });
        return response.data;
    }

    async logout() {
        const refreshToken = this.getRefreshToken();
        if (refreshToken) {
            await this.client.post('/auth/logout', { refreshToken });
        }
        this.clearTokens();
    }

    async getProfile() {
        const response = await this.client.get('/users/me');
        return response.data;
    }

    // Questionnaire endpoints
    async getQuestionnaires() {
        const response = await this.client.get('/questionnaires');
        return response.data;
    }

    async getQuestionnaire(id: string) {
        const response = await this.client.get(`/questionnaires/${id}`);
        return response.data;
    }

    // Session endpoints
    async startSession(questionnaireId: string) {
        const response = await this.client.post(`/sessions/start/${questionnaireId}`);
        return response.data;
    }

    async getSessions() {
        const response = await this.client.get('/sessions');
        return response.data;
    }

    async getSession(id: string) {
        const response = await this.client.get(`/sessions/${id}`);
        return response.data;
    }

    async getNextQuestions(sessionId: string, count: number = 1) {
        const response = await this.client.get(`/sessions/${sessionId}/continue?count=${count}`);
        return response.data;
    }

    async submitResponse(sessionId: string, questionId: string, value: unknown) {
        const response = await this.client.post(`/sessions/${sessionId}/responses`, {
            questionId,
            value,
        });
        return response.data;
    }

    async completeSession(sessionId: string) {
        const response = await this.client.post(`/sessions/${sessionId}/complete`);
        return response.data;
    }

    // Document endpoints
    async getDocuments(sessionId?: string) {
        const url = sessionId ? `/documents?sessionId=${sessionId}` : '/documents';
        const response = await this.client.get(url);
        return response.data;
    }

    async generateDocument(sessionId: string, documentTypeId: string) {
        const response = await this.client.post('/documents/generate', {
            sessionId,
            documentTypeId,
        });
        return response.data;
    }

    async downloadDocument(documentId: string) {
        const response = await this.client.get(`/documents/${documentId}/download`, {
            responseType: 'blob',
        });
        return response.data;
    }
}

export const api = new ApiClient();
