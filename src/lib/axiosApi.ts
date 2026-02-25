import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

const axiosInstance = axios.create({
});

axiosInstance.interceptors.request.use(
  (config) => {
    const isAdminRoute = config.url?.includes('/admin/');
    const adminToken = localStorage.getItem('admin_token');
    const userToken = localStorage.getItem('token');

    // Select token based on route type
    const token = isAdminRoute ? adminToken : userToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * @param url - The endpoint or full URL
 * @param options - Axios request config (method, data, headers, etc.)
 * @returns The response data or null if status is 204
 */
const axiosApi = async <T = any>(url: string, options: AxiosRequestConfig = {}): Promise<T | null> => {
  try {
    const response: AxiosResponse<T> = await axiosInstance({
      url,
      ...options,
    });

    if (response.status === 204) {
      return null;
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message || "An unknown API error occurred.";
      console.error("AxiosApi Error:", message);
      throw new Error(message);
    } else {
      console.error("AxiosApi Error:", (error as Error).message);
      throw error;
    }
  }
};

export default axiosApi;
export { axiosInstance };
