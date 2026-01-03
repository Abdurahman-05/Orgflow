import axios from 'axios';

/**
 * Axios instance for backend communication.
 * Includes base URL and default headers.
 * Interceptors for JWT authentication can be added here.
 */
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
