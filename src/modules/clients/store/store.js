import { axiosForAuth, axiosInstance } from "../../../core/api/api";

export const getCarreras = async () => {
  try {
    const response = await axiosInstance.get(`carrera/`);
    return response;
  } catch (error) {
    console.log("Error en getCarreras", error);
    throw error;
  }
};

export const getCarrerasRequester = async () => {
  try {
    const response = await axiosForAuth.get(`carrera/`);
    return response;
  } catch (error) {
    console.log("Error en getCarrerasRequester", error);
    throw error;
  }
};

export const insertCarrera = async (carrera) => {
  try {
    const response = await axiosInstance.post(`carrera/`, carrera);
    return response;
  } catch (error) {
    if (
      error.request.status === 500 &&
      error.request.response === "Duplicated carrera"
    ) {
      console.log("Error en insertarCarrera", error);
      return error;
    }
    console.log("Error en insertarCarrera", error);
    throw error;
  }
};

export const updateCarrera = async (carrera) => {
  try {
    const response = await axiosInstance.put(`carrera/`, carrera);
    return response;
  } catch (error) {
    if (
      error.request.status === 500 &&
      error.request.response === "Duplicated carrera"
    ) {
      console.log("Error en modificarCarrera", error);
      return error;
    }
    console.log("Error en modificarCarrera", error);
    throw error;
  }
};

export const deleteCareer = async (career) => {
  try {
    const response = await axiosInstance.delete(
      `carrera/${career.cod_carrera}`
    );
    return response;
  } catch (error) {
    console.log("Error en deleteCareer", error);
    throw error;
  }
};
