import axios from "axios";
const BASE_URL = "http://localhost:5000/api";

export const getRequests = () => axios.get(`${BASE_URL}/requests`);
export const addRequest = (data) => axios.post(`${BASE_URL}/requests`, data);
