import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/suppliers`;

export const getSuppliers = async (search?: string) => {
    const url = search ? `${API_URL}?search=${encodeURIComponent(search)}` : API_URL;
    const response = await axios.get(url);
    return response.data;
};

export const createSupplier = async (data: any) => {
    const response = await axios.post(API_URL, data);
    return response.data;
};

export const updateSupplier = async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
};

export const deleteSupplier = async (id: string) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

export const getSupplierById = async (id: string) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};
