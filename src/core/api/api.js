import axios from "axios";

export const axiosForAuth = axios.create({
  baseURL: "https://pruebareactjs.test-class.com/Api/", // api Url
  timeout: 10000, // Set a timeout for requests
});

export const axiosInstance = axios.create({
  baseURL: "https://pruebareactjs.test-class.com/Api/", // api Url
  // baseURL: 'http://localhost:8080/cpe-backend-0.0.1-SNAPSHOT/api/v1/', // api Url
  timeout: 10000, // Set a timeout for requests
  headers: { "Content-Type": "application/json" },
});
axiosInstance.interceptors.request.use(
  (config) => {
    if (
      !config.headers.Authorization &&
      localStorage.getItem("accessToken") !== null
    ) {
      const accessToken = localStorage.getItem("accessToken");
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config;
    if (
      error?.response?.status === 403 &&
      !prevRequest?.sent &&
      localStorage.getItem("accessToken") !== null
    ) {
      prevRequest.sent = true;
      const accessToken = localStorage.getItem("accessToken");
      prevRequest.headers.Authorization = `Bearer ${accessToken}`;
      return axiosInstance(prevRequest);
    }
    return Promise.reject(error);
  }
);

// Add an interceptor to include the Bearer token in the headers
/* axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlc3RoZXIiLCJpYXQiOjE2OTE5MDUxOTgsImV4cCI6MzM4MzgxMDk5Nn0.sCtHcRGNsGLvjqMyrZP3uHcd5v4pzujWWxG2xwbsHKaGz9_pbjJmZ_Gg5W610462e4B-dlAIKBPP3k8O6Eg5WA'; // Replace with your actual token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
); */
