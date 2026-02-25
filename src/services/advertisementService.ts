import axios from 'axios';

const API_URL = 'http://localhost:5002/api/advertisement';

// Card Point APIs
export const getCardPoints = async () => {
    try {
        const response = await axios.get(`${API_URL}/card-points`);
        return response.data;
    } catch (error) {
        console.error('Error fetching card points:', error);
        throw error;
    }
};

export const getCardPointById = async (id: string) => {
    try {
        const response = await axios.get(`${API_URL}/card-points/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching card point:', error);
        throw error;
    }
};

export const createCardPoint = async (data: { pointName: string }) => {
    try {
        const response = await axios.post(`${API_URL}/card-points`, data);
        return response.data;
    } catch (error) {
        console.error('Error creating card point:', error);
        throw error;
    }
};

export const updateCardPoint = async (id: string, data: { pointName: string }) => {
    try {
        const response = await axios.put(`${API_URL}/card-points/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating card point:', error);
        throw error;
    }
};

export const deleteCardPoint = async (id: string) => {
    try {
        const response = await axios.delete(`${API_URL}/card-points/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting card point:', error);
        throw error;
    }
};

// Advertisement Card APIs
export const getAdvertisementCards = async (cardPointId?: string) => {
    try {
        const url = cardPointId
            ? `${API_URL}/cards?cardPointId=${cardPointId}`
            : `${API_URL}/cards`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching advertisement cards:', error);
        throw error;
    }
};

export const getAdvertisementCardById = async (id: string) => {
    try {
        const response = await axios.get(`${API_URL}/cards/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching advertisement card:', error);
        throw error;
    }
};

export const createAdvertisementCard = async (formData: FormData) => {
    try {
        const response = await axios.post(`${API_URL}/cards`, formData);
        return response.data;
    } catch (error) {
        console.error('Error creating advertisement card:', error);
        throw error;
    }
};

export const updateAdvertisementCard = async (id: string, formData: FormData) => {
    try {
        const response = await axios.put(`${API_URL}/cards/${id}`, formData);
        return response.data;
    } catch (error) {
        console.error('Error updating advertisement card:', error);
        throw error;
    }
};

export const deleteAdvertisementCard = async (id: string) => {
    try {
        const response = await axios.delete(`${API_URL}/cards/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting advertisement card:', error);
        throw error;
    }
};

// ─── Poster APIs ──────────────────────────────────────────────
export const getPosters = async () => {
    const response = await axios.get(`${API_URL}/posters`);
    return response.data;
};
export const createPoster = async (formData: FormData) => {
    const response = await axios.post(`${API_URL}/posters`, formData);
    return response.data;
};
export const updatePoster = async (id: string, formData: FormData) => {
    const response = await axios.put(`${API_URL}/posters/${id}`, formData);
    return response.data;
};
export const deletePoster = async (id: string) => {
    const response = await axios.delete(`${API_URL}/posters/${id}`);
    return response.data;
};

// ─── Slider Card APIs ─────────────────────────────────────────
export const getSliderCards = async () => {
    const response = await axios.get(`${API_URL}/slider-cards`);
    return response.data;
};
export const createSliderCard = async (formData: FormData) => {
    const response = await axios.post(`${API_URL}/slider-cards`, formData);
    return response.data;
};
export const updateSliderCard = async (id: string, formData: FormData) => {
    const response = await axios.put(`${API_URL}/slider-cards/${id}`, formData);
    return response.data;
};
export const deleteSliderCard = async (id: string) => {
    const response = await axios.delete(`${API_URL}/slider-cards/${id}`);
    return response.data;
};

// ─── Video APIs ───────────────────────────────────────────────
export const getVideos = async () => {
    const response = await axios.get(`${API_URL}/videos`);
    return response.data;
};
export const createVideo = async (formData: FormData) => {
    const response = await axios.post(`${API_URL}/videos`, formData);
    return response.data;
};
export const updateVideo = async (id: string, formData: FormData) => {
    const response = await axios.put(`${API_URL}/videos/${id}`, formData);
    return response.data;
};
export const deleteVideo = async (id: string) => {
    const response = await axios.delete(`${API_URL}/videos/${id}`);
    return response.data;
};

