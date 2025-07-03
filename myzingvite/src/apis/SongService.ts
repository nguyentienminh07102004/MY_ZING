import type { PagedModel } from "../types/PagedModel";
import type { SongResponse } from "../types/Song";
import { instance } from "./instance";
import Cookies from "js-cookie";

export const getSongService = async (): Promise<PagedModel<SongResponse>> => {
    const res = await instance.get('/songs');
    return res.data;
}

export const deleteSongByIdService = async (id: string) => {
    const token = Cookies.get('token');
    await instance.delete(`/auth/songs/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const getSongById = async (id: string) => {
    const token = Cookies.get('token');
    const res: SongResponse = (await instance.get(`/public/songs/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })).data;
    return res;
}

export const incrementNumberOfListner = async (songId: string) => {
    await instance.put(`/public/songs/increment/song/${songId}`);
}

export const likeSongService = async (songId: string) => {
    const token = Cookies.get('token');
    await instance.post(`/auth/songs/favourites/${songId}`, null, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const getAllSongs = async (page: number, limit: number, params?: { [key: string]: string }) => {
    const res: PagedModel<SongResponse> = (await instance.get('/public/songs',
        { params: { page: page, limit: limit, ...params } })
    ).data;
    return res;
}

export const getRelatedSongs = async (songId: string, limit: number = 6) => {
    const res: SongResponse[] = (await instance.get(`/public/songs/related/${songId}`, {
        params: { limit: limit }
    })).data;
    return res;
}

export const getMySongs = async () => {
    const token = Cookies.get('token');
    const response = (await instance.get('/auth/songs/my-song', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })).data;
    return response as PagedModel<SongResponse>;
}

export const createdSong = async (formData: FormData) => {
    const token = Cookies.get('token');
    await instance.post('/auth/songs', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        },
    });
}

export const updateSongService = async (formData: FormData) => {
    const token = Cookies.get('token');
    return await instance.put('/auth/songs', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        }
    })
}

export const getMyFavouriteSong = async (page: number = 1, limit: number = 10) => {
    const token = Cookies.get('token');
    return (await instance.get('/auth/songs/my-favourites', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: { page, limit }
    })).data as PagedModel<SongResponse>;    
}