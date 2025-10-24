import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const fetchDonors = () => axios.get(`${API_URL}/api/donors`);
export const registerDonor = (data) => axios.post(`${API_URL}/api/donors`, data);
