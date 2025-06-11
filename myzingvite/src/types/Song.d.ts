export interface SongResponse {
    id: string;
    name: string;
    description: string;
    url: string;
    imageUrl: string;
    createdDate: string;
    numberOfLikes: number;
    numberOfListens: number;
    singers: string[];
}