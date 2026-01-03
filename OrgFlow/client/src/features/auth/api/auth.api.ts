import axiosInstance from '@/lib/axios';

/**
 * Auth feature API calls.
 * Separates authentication logic from UI components.
 */
export const login = async (data: any) => {
  return axiosInstance.post('/auth/login', data);
};

export const register = async (data: any) => {
  return axiosInstance.post('/auth/register', data);
};

export const verifyEmail = async (token: string) => {
  return axiosInstance.post('/auth/verify-email', { token });
};
