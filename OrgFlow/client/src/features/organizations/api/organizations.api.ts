import axiosInstance from '@/lib/axios';

/**
 * Organizations feature API calls.
 */
export const getOrganizations = async () => {
  return axiosInstance.get('/organizations');
};

export const createOrganization = async (data: any) => {
  return axiosInstance.post('/organizations', data);
};
