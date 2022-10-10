import axios from 'axios';

const api = axios.create({
    'Access-Control-Allow-Credentials': true,
    baseURL: 'http://localhost:3001',
})

export default api;
