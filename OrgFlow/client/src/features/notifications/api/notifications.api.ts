import axiosInstance from '@/lib/axios';

/**
 * Notifications feature API calls.
 */
export const getNotifications = async () => {
  return axiosInstance.get('/notifications');
};

export const markAsRead = async (id: string) => {
  return axiosInstance.patch(`/notifications/${id}/read`);
};
