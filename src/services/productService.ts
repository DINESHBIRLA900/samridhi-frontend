import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';
const CATEGORY_URL = `${BASE_URL}/api/products/category`;
const UNIT_URL = `${BASE_URL}/api/products/unit-master`;
const HSN_URL = `${BASE_URL}/api/products/hsn-code`;
const TECHNICAL_URL = `${BASE_URL}/api/products/technical-list`;
const PRODUCT_URL = `${BASE_URL}/api/products/product-list`;
const PACKING_URL = `${BASE_URL}/api/products/packing`; // Added for Packing API

// Category Endpoints
export const getCategories = async () => (await axios.get(CATEGORY_URL)).data;
export const createCategory = async (formData: FormData) => (await axios.post(CATEGORY_URL, formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
export const updateCategory = async (id: string, formData: FormData) => (await axios.put(`${CATEGORY_URL}/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
export const reorderCategories = async (orderData: { _id: string, order: number }[]) => (await axios.post(`${CATEGORY_URL}/reorder`, { orderData })).data;
export const deleteCategory = async (id: string) => (await axios.delete(`${CATEGORY_URL}/${id}`)).data;

// Packing API
export const getPackings = async () => {
    const response = await axios.get(PACKING_URL);
    return response.data;
};

export const createPacking = async (data: any) => {
    const response = await axios.post(PACKING_URL, data);
    return response.data;
};

export const deletePacking = async (id: string) => {
    const response = await axios.delete(`${PACKING_URL}/${id}`);
    return response.data;
};

// Unit Master Endpoints
export const getUnits = async () => (await axios.get(UNIT_URL)).data;
export const createUnit = async (data: any) => (await axios.post(UNIT_URL, data)).data;
export const deleteUnit = async (id: string) => (await axios.delete(`${UNIT_URL}/${id}`)).data;

// HSN Code Endpoints
export const getHsnCodes = async () => (await axios.get(HSN_URL)).data;
export const createHsnCode = async (data: any) => (await axios.post(HSN_URL, data)).data;
export const deleteHsnCode = async (id: string) => (await axios.delete(`${HSN_URL}/${id}`)).data;

// Technical List Endpoints
export const getTechnicals = async () => (await axios.get(TECHNICAL_URL)).data;
export const createTechnical = async (data: any) => (await axios.post(TECHNICAL_URL, data)).data;
export const updateTechnical = async (id: string, data: any) => (await axios.put(`${TECHNICAL_URL}/${id}`, data)).data;
export const deleteTechnical = async (id: string) => (await axios.delete(`${TECHNICAL_URL}/${id}`)).data;

// Product List Endpoints
export const getProducts = async () => (await axios.get(PRODUCT_URL)).data;
export const createProduct = async (formData: FormData) => (await axios.post(PRODUCT_URL, formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
export const deleteProduct = async (id: string) => (await axios.delete(`${PRODUCT_URL}/${id}`)).data;
