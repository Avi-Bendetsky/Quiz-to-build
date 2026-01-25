export declare class PaginationMeta {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}
export declare class ApiResponseDto<T> {
    success: boolean;
    data: T;
    meta?: {
        timestamp: string;
        requestId?: string;
    };
}
export declare class PaginatedResponseDto<T> {
    success: boolean;
    data: {
        items: T[];
        pagination: PaginationMeta;
    };
}
export declare class ErrorResponseDto {
    success: false;
    error: {
        code: string;
        message: string;
        details?: unknown[];
        requestId?: string;
        timestamp: string;
    };
}
//# sourceMappingURL=response.dto.d.ts.map