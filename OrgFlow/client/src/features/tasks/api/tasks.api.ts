import axiosInstance from '@/lib/axios';

/**
 * Tasks feature API calls.
 */
export const getTasks = async () => {
  return axiosInstance.get('/tasks');
};

export const createTask = async (data: any) => {
  return axiosInstance.post('/tasks', data);
};

export const updateTask = async (id: string, data: any) => {
  return axiosInstance.put(`/tasks/${id}`, data);
};
