import axios from 'axios';

const API = axios.create({
    baseURL: 'https://final-receipt-backend.onrender.com',  // बस इतना रखना है
});

export default API;