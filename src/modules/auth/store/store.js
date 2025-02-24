import { axiosForAuth } from "../../../core/api/api";

export const login = async (loginData) => {
  try {
    const response = await axiosForAuth.post(`Authenticate/login`, loginData);
    return response;
  } catch (error) {
    if (!error?.response) {
      console.log("No hay respuesta del server");
    } else if (error.response?.status === 401) {
      console.log("la respuesta en el store", error.response.data);
    }
    return error;
  }
};

export const signup = async (loginData) => {
  try {
    const response = await axiosForAuth.post(`Authenticate/login`, loginData);
    return response;
  } catch (error) {
    if (!error?.response) {
      console.log("No hay respuesta del server");
    } else if (error.response?.status === 401) {
      console.log("la respuesta en el store", error.response.data);
    }
    return error;
  }
};
