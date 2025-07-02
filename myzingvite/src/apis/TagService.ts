import type { PagedModel } from "../types/PagedModel";
import type { TagCreatedRequest, TagResponse } from "../types/Tag";
import { instance } from "./instance";
import Cookies from "js-cookie";

export const getAllTags = async (page: number, limit: number = 10) => {
    return (await instance.get('/public/tags', {
        params: {
            page,
            limit
        }
    })).data as PagedModel<TagResponse>;
}

export const createTag = async (tag: TagCreatedRequest) => {
    const token = Cookies.get('token');
    await instance.post('/auth/tags', tag, {
        headers: { Authorization: `Bearer ${token}` }
    });
};