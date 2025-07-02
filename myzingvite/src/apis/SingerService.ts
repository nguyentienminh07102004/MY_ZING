import type { PagedModel } from "../types/PagedModel";
import type { SingerResponse } from "../types/Singer";
import { instance } from "./instance";

export const getAllSinger = async (page: number = 1, limit: number = 10) => {
    const response = (await instance.get('/public/singers', {
        params: {
            page: page,
            limit: limit
        }
    })).data;
    return response as PagedModel<SingerResponse>;
}