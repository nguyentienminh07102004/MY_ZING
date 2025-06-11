import type { SongResponse } from "./Song";

export interface PlaylistResponse {
    id: string;
    name: string;
    description: string;
    image: string;
    createdDate: Date;
    email: string;
    isCommunal: boolean;
    songs: SongResponse[];
}
