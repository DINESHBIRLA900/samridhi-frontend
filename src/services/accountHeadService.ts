import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002'}/api/accounts/chart-of-accounts`;

export const getAccountHeads = async (params?: { type?: string; parentId?: string }) => {
    try {
        const response = await axios.get(API_URL, { params });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const createAccountHead = async (data: any) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const updateAccountHead = async (id: string, data: any) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const deleteAccountHead = async (id: string) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
