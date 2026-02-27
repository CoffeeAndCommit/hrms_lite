import axios from 'axios';

const api = axios.create({
  baseURL: 'https://hrms-lite-1066.onrender.com/api/',
});

export default api;
