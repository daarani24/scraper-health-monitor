import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export const getEvents = () => axios.get(`${API_BASE}/events`);
export const getStats = (collectorName) => axios.get(`${API_BASE}/stats/${collectorName}`);
export const checkRecords = (collectorName, records) =>
  axios.post(`${API_BASE}/check/${collectorName}`, records);