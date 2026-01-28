import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import apiClient from './client';

vi.mock('axios');

describe('API Client', () => {
    const mockAxios = axios as any;

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Request Interceptor', () => {
        it('adds auth token to request headers when token exists', async () => {
            const token = 'test-jwt-token';
            localStorage.setItem('auth_token', token);

            const config = { headers: {} };
            const interceptor = mockAxios.interceptors.request.use.mock.calls[0][0];
            const result = await interceptor(config);

            expect(result.headers.Authorization).toBe(`Bearer ${token}`);
        });

        it('does not add auth header when token does not exist', async () => {
            const config = { headers: {} };
            const interceptor = mockAxios.interceptors.request.use.mock.calls[0][0];
            const result = await interceptor(config);

            expect(result.headers.Authorization).toBeUndefined();
        });

        it('adds content-type application/json by default', async () => {
            const config = { headers: {} };
            const interceptor = mockAxios.interceptors.request.use.mock.calls[0][0];
            const result = await interceptor(config);

            expect(result.headers['Content-Type']).toBe('application/json');
        });

        it('preserves existing content-type', async () => {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const interceptor = mockAxios.interceptors.request.use.mock.calls[0][0];
            const result = await interceptor(config);

            expect(result.headers['Content-Type']).toBe('multipart/form-data');
        });
    });

    describe('Response Interceptor', () => {
        it('returns response data on success', async () => {
            const responseData = { data: { id: 1, name: 'Test' } };
            const interceptor = mockAxios.interceptors.response.use.mock.calls[0][0];
            const result = await interceptor(responseData);

            expect(result).toEqual(responseData);
        });

        it('handles 401 unauthorized error', async () => {
            const error = {
                response: { status: 401, data: { message: 'Unauthorized' } },
                config: {},
            };
            const errorHandler = mockAxios.interceptors.response.use.mock.calls[0][1];

            localStorage.setItem('auth_token', 'expired-token');

            await expect(errorHandler(error)).rejects.toThrow();
            expect(localStorage.getItem('auth_token')).toBeNull();
        });

        it('handles 403 forbidden error', async () => {
            const error = {
                response: { status: 403, data: { message: 'Forbidden' } },
                config: {},
            };
            const errorHandler = mockAxios.interceptors.response.use.mock.calls[0][1];

            await expect(errorHandler(error)).rejects.toThrow();
        });

        it('handles 404 not found error', async () => {
            const error = {
                response: { status: 404, data: { message: 'Not found' } },
                config: {},
            };
            const errorHandler = mockAxios.interceptors.response.use.mock.calls[0][1];

            await expect(errorHandler(error)).rejects.toThrow();
        });

        it('handles 500 server error', async () => {
            const error = {
                response: { status: 500, data: { message: 'Internal server error' } },
                config: {},
            };
            const errorHandler = mockAxios.interceptors.response.use.mock.calls[0][1];

            await expect(errorHandler(error)).rejects.toThrow();
        });

        it('retries on network error', async () => {
            const error = {
                message: 'Network Error',
                config: { _retryCount: 0 },
            };
            const errorHandler = mockAxios.interceptors.response.use.mock.calls[0][1];

            mockAxios.request.mockResolvedValueOnce({ data: 'success' });

            await errorHandler(error);
            expect(mockAxios.request).toHaveBeenCalled();
        });

        it('does not retry after max retry attempts', async () => {
            const error = {
                message: 'Network Error',
                config: { _retryCount: 3 },
            };
            const errorHandler = mockAxios.interceptors.response.use.mock.calls[0][1];

            await expect(errorHandler(error)).rejects.toThrow();
            expect(mockAxios.request).not.toHaveBeenCalled();
        });

        it('implements exponential backoff for retries', async () => {
            const error = {
                message: 'Network Error',
                config: { _retryCount: 1 },
            };
            const errorHandler = mockAxios.interceptors.response.use.mock.calls[0][1];

            const startTime = Date.now();
            mockAxios.request.mockResolvedValueOnce({ data: 'success' });

            await errorHandler(error);
            const elapsed = Date.now() - startTime;

            expect(elapsed).toBeGreaterThanOrEqual(200); // 2^1 * 100ms
        });
    });

    describe('HTTP Methods', () => {
        it('makes GET request', async () => {
            mockAxios.get.mockResolvedValue({ data: { id: 1 } });
            const result = await apiClient.get('/test');

            expect(mockAxios.get).toHaveBeenCalledWith('/test', undefined);
            expect(result).toEqual({ data: { id: 1 } });
        });

        it('makes POST request', async () => {
            const payload = { name: 'Test' };
            mockAxios.post.mockResolvedValue({ data: { id: 1, ...payload } });

            const result = await apiClient.post('/test', payload);

            expect(mockAxios.post).toHaveBeenCalledWith('/test', payload, undefined);
            expect(result.data).toMatchObject(payload);
        });

        it('makes PUT request', async () => {
            const payload = { name: 'Updated' };
            mockAxios.put.mockResolvedValue({ data: { id: 1, ...payload } });

            const result = await apiClient.put('/test/1', payload);

            expect(mockAxios.put).toHaveBeenCalledWith('/test/1', payload, undefined);
        });

        it('makes DELETE request', async () => {
            mockAxios.delete.mockResolvedValue({ data: { success: true } });

            const result = await apiClient.delete('/test/1');

            expect(mockAxios.delete).toHaveBeenCalledWith('/test/1', undefined);
        });

        it('makes PATCH request', async () => {
            const payload = { status: 'active' };
            mockAxios.patch.mockResolvedValue({ data: { id: 1, ...payload } });

            const result = await apiClient.patch('/test/1', payload);

            expect(mockAxios.patch).toHaveBeenCalledWith('/test/1', payload, undefined);
        });
    });

    describe('Error Handling', () => {
        it('extracts error message from response', async () => {
            const errorMessage = 'Validation failed';
            mockAxios.post.mockRejectedValue({
                response: { data: { message: errorMessage } },
            });

            await expect(apiClient.post('/test', {})).rejects.toThrow();
        });

        it('handles timeout errors', async () => {
            mockAxios.get.mockRejectedValue({
                code: 'ECONNABORTED',
                message: 'timeout of 5000ms exceeded',
            });

            await expect(apiClient.get('/test')).rejects.toThrow();
        });

        it('handles connection refused errors', async () => {
            mockAxios.get.mockRejectedValue({
                code: 'ECONNREFUSED',
                message: 'connect ECONNREFUSED',
            });

            await expect(apiClient.get('/test')).rejects.toThrow();
        });
    });

    describe('Request Cancellation', () => {
        it('supports request cancellation via AbortController', async () => {
            const controller = new AbortController();

            mockAxios.get.mockImplementation(() =>
                new Promise((resolve, reject) => {
                    controller.signal.addEventListener('abort', () => {
                        reject(new Error('Request cancelled'));
                    });
                })
            );

            const requestPromise = apiClient.get('/test', { signal: controller.signal });
            controller.abort();

            await expect(requestPromise).rejects.toThrow('Request cancelled');
        });
    });

    describe('Query Parameters', () => {
        it('serializes query parameters', async () => {
            mockAxios.get.mockResolvedValue({ data: [] });

            await apiClient.get('/test', { params: { page: 1, limit: 10 } });

            expect(mockAxios.get).toHaveBeenCalledWith('/test', {
                params: { page: 1, limit: 10 },
            });
        });

        it('handles array query parameters', async () => {
            mockAxios.get.mockResolvedValue({ data: [] });

            await apiClient.get('/test', { params: { ids: [1, 2, 3] } });

            expect(mockAxios.get).toHaveBeenCalledWith('/test', {
                params: { ids: [1, 2, 3] },
            });
        });
    });
});
