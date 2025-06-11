import type { PagedModel } from "../types/PagedModel";
import type { SongResponse } from "../types/Song";
import { instance } from "./instance";

export const getSongService = async (): Promise<PagedModel<SongResponse>> => {
    const res = await instance.get('/songs');
    return res.data;
}