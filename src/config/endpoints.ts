// export const BASE_URL = 'http://122.163.121.176:3019/v1';
export const BASE_URL = "http://157.173.221.226:3019/v1";


export const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/auth/login`,
  REGISTER: `${BASE_URL}/auth/register`,    
} as const;