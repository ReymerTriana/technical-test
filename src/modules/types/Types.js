import { axiosForAuth, axiosInstance } from "../../core/api/api";

export const getMunicipiosPorProvincia = async (codProvincia) => {
  try {
    const response = await axiosInstance.get(
      `municipio/provincia/${codProvincia}`
    );
    return response;
  } catch (error) {
    console.log("Error en getMunicipiosPorProvincia", error);
    throw error;
  }
};

export const getMunicipiosPorProvinciaRequester = async (codProvincia) => {
  try {
    const response = await axiosForAuth.get(
      `municipio/provincia/${codProvincia}`
    );
    return response;
  } catch (error) {
    console.log("Error en getMunicipiosPorProvinciaRequester", error);
    throw error;
  }
};

export const getMunicipioPorID = async (idMunicipio) => {
  try {
    const response = await axiosInstance.get(`municipio/${idMunicipio}`);
    return response;
  } catch (error) {
    console.log("Error en getMunicipioPorID", error);
    throw error;
  }
};

export const getProvincias = async () => {
  try {
    const response = await axiosInstance.get(`provincia/`);
    return response;
  } catch (error) {
    console.log("Error en getProvincias", error);
    throw error;
  }
};

export const getProvinciasRequester = async () => {
  try {
    const response = await axiosForAuth.get(`provincia/`);
    return response;
  } catch (error) {
    console.log("Error en getProvinciasRequester", error);
    throw error;
  }
};

export const getFuentesIngreso = async () => {
  try {
    const response = await axiosInstance.get(`fuenteIngreso/`);
    return response;
  } catch (error) {
    console.log("Error en getFuentesIngreso", error);
    throw error;
  }
};

export const getFuentesIngresoRequester = async () => {
  try {
    const response = await axiosForAuth.get(`fuenteIngreso/`);
    return response;
  } catch (error) {
    console.log("Error en getFuentesIngresoRequester", error);
    throw error;
  }
};
