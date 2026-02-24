import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002'}/api/users`;

export const getUsers = async (params: any = {}) => {
    const response = await axios.get(API_URL, { params });
    return response.data;
};

export const getUserById = async (id: string) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const createUser = async (data: any) => {
    const response = await axios.post(API_URL, data);
    return response.data;
};

export const updateUser = async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
};

export const deleteUser = async (id: string) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
