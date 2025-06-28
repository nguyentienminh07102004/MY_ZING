import type { PagedModel } from "../types/PagedModel";
import type { SongResponse } from "../types/Song";
import { instance } from "./instance";
import Cookies from "js-cookie";

const token = Cookies.get('token');

export const getSongService = async (): Promise<PagedModel<SongResponse>> => {
    const res = await instance.get('/songs');
    return res.data;
}

export const deleteSongByIdService = async (id: string) => {
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

export const getAllSongs = async (page: number, limit: number) => {
    const res: PagedModel<SongResponse> = await instance.get('/public/songs', { params: { page: page, limit: limit } });
    return res;
}

export const getRelatedSongs = async (songId: string, limit: number = 6) => {
    const res: SongResponse[] = (await instance.get(`/public/songs/related/${songId}`, {
        params: { limit: limit }
    })).data;
    return res;
}