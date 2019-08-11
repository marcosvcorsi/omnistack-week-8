import ENV from '../enviroments/enviroment';
import axios from 'axios';

const api = axios.create({
    baseURL: ENV.BASE_URL
});

export default api;