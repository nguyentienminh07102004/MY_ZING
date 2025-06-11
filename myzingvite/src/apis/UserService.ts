import { instance } from "./instance"

export const UserLoginService = async (email: string, password: string) => {
    const res = await instance.post('/users/login', { email, password });
    return res.data;
}