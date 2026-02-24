import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002'}/api/vendors`;

export const getVendors = async (search?: string) => {
    const url = search ? `${API_URL}?search=${encodeURIComponent(search)}` : API_URL;
    const response = await axios.get(url);
    return response.data;
};

export const createVendor = async (data: any) => {
    const response = await axios.post(API_URL, data);
    return response.data;
};

export const updateVendor = async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
};

export const deleteVendor = async (id: string) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

export const getVendorById = async (id: string) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};
