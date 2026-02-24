import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002'}/api`;

export const getExpenses = async () => {
    try {
        const response = await axios.get(`${API_URL}/accounts/expenses`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addExpense = async (expenseData: any) => {
    try {
        const response = await axios.post(`${API_URL}/accounts/expenses`, expenseData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteExpense = async (id: string) => {
    try {
        const response = await axios.delete(`${API_URL}/accounts/expenses/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Category APIs
export const getCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/accounts/expenses/categories`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addCategory = async (categoryData: any) => {
    try {
        const response = await axios.post(`${API_URL}/accounts/expenses/categories`, categoryData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteCategoryById = async (id: string) => {
    try {
        const response = await axios.delete(`${API_URL}/accounts/expenses/categories/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
