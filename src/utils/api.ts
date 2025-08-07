import axios from 'axios';
import { baseUrl } from './apiBase';

const api = axios.create({
  baseURL: baseUrl,
});

export default api;
