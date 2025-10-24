import axios from "axios";
const BASE_URL = "http://localhost:5000/api";

export const getDonors = () => axios.get(`${BASE_URL}/donors`);
export const addDonor = (data) => axios.post(`${BASE_URL}/donors`, data);
