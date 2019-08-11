import axios from 'axios';
import ENV from '../enviroments/enviroment'

const api = axios.create({
    baseURL: ENV.BASE_URL
});

export default api;