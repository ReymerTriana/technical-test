import { axiosInstance } from "../../../../core/api/api";

export const getCantSolicitantesTotalCurso = async (codCurso) => {
  try {
    const response = await axiosInstance.get(
      `solicitante/cantSolicitantes/curso/${codCurso}`
    );
    return response;
  } catch (error) {
    console.log("Error en getCantSolicitantesTotalCurso", error);
    throw error;
  }
};

export const getCantSolicitudesTotalCurso = async (codCurso) => {
  try {
    const response = await axiosInstance.get(
      `solicitud/cantidadCurso/${codCurso}`
    );
    return response;
  } catch (error) {
    console.log("Error en getCantSolicitudesTotalCurso", error);
    throw error;
  }
};

export const getCantCarrerasAsigPrimeraVueltaCurso = async (codCurso) => {
  try {
    const response = await axiosInstance.get(
      `carreraAsigPrimVuelta/cantCarrAsigCurso/${codCurso}`
    );
    return response;
  } catch (error) {
    console.log("Error en getCantCarrerasAsigPrimVueltaCurso", error);
    throw error;
  }
};

export const getCantCarrerasAsigSegundaVueltaCurso = async (codCurso) => {
  try {
    const response = await axiosInstance.get(
      `carreraAsigSegVuelta/cantCarrAsigCurso/${codCurso}`
    );
    return response;
  } catch (error) {
    console.log("Error en getCantCarrerasAsigSegVueltaCurso", error);
    throw error;
  }
};
