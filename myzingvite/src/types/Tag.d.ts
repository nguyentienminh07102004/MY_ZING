export interface TagResponse {
    id: string;
    name: string;
    description: string;
}

export interface TagCreatedRequest {
    name: string;
    description: string;
}
