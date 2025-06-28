import type { PagedModel } from "../types/PagedModel";
import type { UserRegister, UserResponse } from "../types/User";
import { instance } from "./instance";
import Cookies from "js-cookie";

export const UserLoginService = async (email: string, password: string) => {
    const res = await instance.post('/public/users/login', { email, password });
    return res.data;
}

export const logout = async () => {
    const token = Cookies.get('token');
    await instance.post('/auth/users/logout', null, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const getMyInfo = async () => {
    const token = Cookies.get('token');
    const user: UserResponse = (await instance.get('/auth/users/my-info', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })).data;
    return user;
}

export const registerUser = async (user: UserRegister) => {
    const res = await instance.post('/public/users/register', user);
    return res;
}

export const getAllUsers = async () => {
    const token = Cookies.get('token');
    const res = await instance.get('/auth/users/all', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data as PagedModel<UserResponse>;
}

export const deleteUserByEmail = async (email: string) => {
    const token = Cookies.get('token');
    await instance.delete(`/auth/users/${email}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const updateUserRole = async (email: string, role: 'USER' | 'ADMIN') => {
    const token = Cookies.get('token');
    await instance.put(`/auth/users/user-role`, { email, role }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const uploadAvatar = async (file: File) => {
    const token = Cookies.get('token');
    const formData = new FormData();
    formData.append('file', file);
    const res = await instance.put('/auth/users/upload-avatar', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        }
    });
    return res;
}

export const changePasswordService = async (data: { oldPassword: string; newPassword: string, confirmPassword: string }) => {
    const token = Cookies.get('token');
    await instance.put('/auth/users/change-password', data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}