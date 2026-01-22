export const BASE_URL = 'http://122.163.121.176:3029';
// export const BASE_URL = "http://157.173.221.226:3019/v1";


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


} as const;