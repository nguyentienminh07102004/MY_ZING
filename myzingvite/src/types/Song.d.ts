import type { SingerResponse } from "./Singer";

export interface SongResponse {
    id: string;
    name: string;
    description: string;
    url: string;
    imageUrl: string;
    createdDate: string;
    numberOfListens: number;
    email: string;
    isLike: boolean;
    singers: SingerResponse[];
}