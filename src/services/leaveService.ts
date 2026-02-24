import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002'}/api/attendance/leave`;

export const applyLeave = async (data: any) => {
    try {
        const response = await axios.post(`${API_URL}/apply`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getLeaveList = async (params: any = {}) => {
    try {
        const response = await axios.get(API_URL, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateLeaveStatus = async (id: string, data: { status: string, rejection_reason?: string }) => {
    try {
        const response = await axios.patch(`${API_URL}/status/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUserLeaves = async (userId: string) => {
    try {
        const response = await axios.get(`${API_URL}/user/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
