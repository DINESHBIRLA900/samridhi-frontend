import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002'}/api/customers`;

export const getCustomers = async (type?: string, search?: string) => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (search) params.append('search', search);

    const queryString = params.toString();
    const url = queryString ? `${API_URL}?${queryString}` : API_URL;

    const response = await axios.get(url);
    return response.data;
};

export const createCustomer = async (data: any) => {
    const isFormData = data instanceof FormData;
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const response = await axios.post(API_URL, data, config);
    return response.data;
};

export const updateCustomer = async (id: string, data: any) => {
    const isFormData = data instanceof FormData;
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const response = await axios.put(`${API_URL}/${id}`, data, config);
    return response.data;
};

export const deleteCustomer = async (id: string) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
