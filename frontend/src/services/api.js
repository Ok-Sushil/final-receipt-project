import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',  // बस इतना रखना है
});

export default API;