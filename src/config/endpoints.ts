// export const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// export const BASE_URL = 'http://122.163.121.176:3021';
export const BASE_URL = 'http://122.163.121.176:3029';
// export const BASE_URL = "http://157.173.221.226:3019";
// export const BASE_URL=' http://127.0.0.1:5000'; 


export const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/login`,
  REGISTER: `${BASE_URL}/register`,
  GENERATERECIPE: `${BASE_URL}/generate-recipe`,
  RECIPEDETAILS: `${BASE_URL}/generate-recipe-details`,
  SAVEMENU: `${BASE_URL}/save-menu`,
  GETSAVEDMENU: `${BASE_URL}/get-save-menu`,
  SAVEMEAL: `${BASE_URL}/save-meal`,
  GETSAVEDMEAL: `${BASE_URL}/get-save-meal`,
  DELETESAVEDRECIPE: `${BASE_URL}/delete-saved-recipe`,
  DELETESAVEDMEAL: `${BASE_URL}/delete-saved-meal`,
  RECIPEUPDATESERVINGS: `${BASE_URL}/recipe/update-servings`,
  CHATRECIPECONFIGURATION: `${BASE_URL}/doctor-foody/chat`,
  SHARETOCOMMUNITY: `${BASE_URL}/share-to-community`,
  GETCOMMUNITYFEED: `${BASE_URL}/get-community-feed`,
  CAPTCHA: `${BASE_URL}/captcha`,
  ADMINLOGIN: `${BASE_URL}/admin/login`,
  ADMIN_APPROVE_POST: `${BASE_URL}/admin/community/approve`,
  ADMIN_REJECT_POST: `${BASE_URL}/admin/community/reject`,
  ADMIN_PENDING_POST: `${BASE_URL}/admin/community/pending`,
  ADMIN_DELETE_POST: `${BASE_URL}/admin/community/delete`,
  ADMIN_REJECTED_POST: `${BASE_URL}/admin/community/rejected`,
  ADMIN_GET_POSTS: `${BASE_URL}/admin/community/all`,
  USER_ALL_POSTS: `${BASE_URL}/community/my-posts`,
  USER_EDIT_POST: `${BASE_URL}/community/edit-post`,


} as const;