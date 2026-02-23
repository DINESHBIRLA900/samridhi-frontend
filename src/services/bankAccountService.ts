import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/accounts/bank-accounts`;

// Create a new bank account
export const createBankAccount = async (formData: FormData) => {
    try {
        const response = await axios.post(API_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get all bank accounts
export const getBankAccounts = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data.data; // Assumes response structure { success: true, data: [...] }
    } catch (error) {
        throw error;
    }
};

// Get single bank account matches structure from controller
export const getBankAccountById = async (id: string) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// Update bank account
export const updateBankAccount = async (id: string, formData: FormData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete bank account
export const deleteBankAccount = async (id: string) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
