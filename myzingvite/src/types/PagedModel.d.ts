export interface PagedModel<T> {
    content: T[],
    page: {
        number: number;
        size: number;
        totalElements: number;
        totalPages: number;
    }
}

export interface APIResponse {
    status: number;
    message: string;
    data: any;
}