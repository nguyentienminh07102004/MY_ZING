import Cookies from "js-cookie";
import { instance } from "./instance";
import type { PagedModel } from "../types/PagedModel";
import type { PlaylistResponse } from "../types/Playlist";

export const addSongToPlaylist = async (playlistId: string, songIds: string[]) => {
  const token = Cookies.get('token');
  await instance.put(`/auth/playlists/playlist/${playlistId}/songs/${songIds.join(', ')}`, null, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export const getPublicPlaylistsService = async (page: number, limit: number) => {
  const res: PagedModel<PlaylistResponse> = (await instance.get('/public/songs', { params: { page: page, limit: limit } })).data;
  return res;
}

export const removeSongFromPlaylistService = async (playlistId: string, songIds: string[]) => {
  const token = Cookies.get('token');
  await instance.delete(`/auth/playlists/playlist/${playlistId}/songs/${songIds.join(', ')}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export const getPlaylistById = async (playlistId: string) => {
  const token = Cookies.get('token');
  const response: PlaylistResponse = (await instance.get('/public/playlists/' + playlistId, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })).data;
  return response;
}

export const likePlaylistService = async (playlistId: string) => {
  const token = Cookies.get('token');
  await instance.post(`/auth/playlists/favourites/${playlistId}`, null, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}