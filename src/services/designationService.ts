import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/company/designation`;

export const getDesignations = async (params: any = {}) => {
    const response = await axios.get(API_URL, { params });
    return response.data;
};

export const createDesignation = async (data: any) => {
    const response = await axios.post(API_URL, data);
    return response.data;
};

export const updateDesignation = async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
};

export const deleteDesignation = async (id: string) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
