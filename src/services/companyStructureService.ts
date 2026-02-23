import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/company`;

export const getCompanyStructure = async (type: string, params: any = {}) => {
    const response = await axios.get(`${API_URL}/${type}`, { params });
    return response.data;
};

export const createCompanyStructure = async (type: string, data: any) => {
    const response = await axios.post(`${API_URL}/${type}`, data);
    return response.data;
};

export const updateCompanyStructure = async (type: string, id: string, data: any) => {
    const response = await axios.put(`${API_URL}/${type}/${id}`, data);
    return response.data;
};

export const deleteCompanyStructure = async (type: string, id: string) => {
    const response = await axios.delete(`${API_URL}/${type}/${id}`);
    return response.data;
};

export const reorderCompanyStructure = async (type: string, id: string, direction: 'up' | 'down') => {
    const response = await axios.put(`${API_URL}/${type}/reorder`, { id, direction });
    return response.data;
};
