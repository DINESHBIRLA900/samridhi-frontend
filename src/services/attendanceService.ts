import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002'}/api/attendance`;

export const checkIn = async (data: any) => {
    try {
        const response = await axios.post(`${API_URL}/check-in`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const checkOut = async (data: any) => {
    try {
        const response = await axios.post(`${API_URL}/check-out`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAttendanceList = async (params: any = {}) => {
    try {
        const response = await axios.get(API_URL, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUserAttendance = async (userId: string) => {
    try {
        const response = await axios.get(`${API_URL}/user/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
