import Cookies from "js-cookie";
import type { PagedModel } from "../types/PagedModel";
import type { TagCreatedRequest, TagResponse, TagUpdateRequest } from "../types/Tag";
import { instance } from "./instance";

export const getAllTags = async (page: number, limit: number = 10, searchKey: string = '') => {
    return (await instance.get('/public/tags', {
        params: {
            page,
            limit,
            name: searchKey
        }
    })).data as PagedModel<TagResponse>;
}

export const createTag = async (tag: TagCreatedRequest) => {
    const token = Cookies.get('token');
    await instance.post('/auth/tags', tag, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const deleteTagService = async (id: string) => {
    const token = Cookies.get('token');
    await instance.delete(`/auth/tags/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const updateTag = async (tag: TagUpdateRequest) => {
    const token = Cookies.get('token');
    await instance.put('/auth/tags', tag, {
        headers: { Authorization: `Bearer ${token}` }
    });
};