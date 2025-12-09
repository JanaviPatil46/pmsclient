import axios from "axios";

const api = axios.create({
  baseURL: "https://www.snptaxes.com", // your backend base URL
});

// Auto logout if access removed
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      sessionStorage.clear();
      window.location.href = "/client/login";
    }
    return Promise.reject(err);
  }
);

export default api;
