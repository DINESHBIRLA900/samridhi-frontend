import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/company/teams`;

export const getTeams = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createTeam = async (data: any) => {
    const response = await axios.post(API_URL, data);
    return response.data;
};

export const updateTeam = async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
};

export const deleteTeam = async (id: string) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
