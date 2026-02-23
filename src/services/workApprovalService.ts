import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/attendance/work-approval`;

export const getWorkApprovals = async (params: { page?: number; limit?: number; search?: string; status?: string; startDate?: string; endDate?: string } = {}) => {
    try {
        const response = await axios.get(API_URL, { params });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch work approvals", error);
        throw error;
    }
};

export const updateWorkApprovalStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    try {
        const response = await axios.patch(`${API_URL}/status/${id}`, { status });
        return response.data;
    } catch (error) {
        console.error("Failed to update work approval status", error);
        throw error;
    }
};
