import { axiosInstance } from "../../../core/api/api";

export const getInterest = async () => {
  try {
    const response = await axiosInstance.get(`Intereses/Listado/`);
    return response;
  } catch (error) {
    console.log("Error en getInterest", error);
    throw error;
  }
};

export const getClients = async (userid) => {
  try {
    const response = await axiosInstance.post(`Cliente/Listado/`, {
      identificacion: "string",
      nombre: "string",
      usuarioId: userid,
    });

    return response;
  } catch (error) {
    console.log("Error en getClientes", error);
    throw error;
  }
};

export const getClientById = async (clientId) => {
  try {
    const response = await axiosInstance.get(`Cliente/Obtener/${clientId}`);

    return response;
  } catch (error) {
    console.log("Error en getClientes", error);
    throw error;
  }
};

export const insertCliente = async (cliente) => {
  try {
    const response = await axiosInstance.post(`Cliente/Crear/`, cliente);
    return response;
  } catch (error) {
    if (
      error.request.status === 500 &&
      error.request.response === "Duplicated cliente"
    ) {
      console.log("Error en insertarCliente", error);
      return error;
    }
    console.log("Error en insertarCliente", error);
    throw error;
  }
};

export const updateCliente = async (cliente) => {
  try {
    const response = await axiosInstance.post(`Cliente/Actualizar`, cliente);
    return response;
  } catch (error) {
    if (
      error.request.status === 500 &&
      error.request.response === "Duplicated cliente"
    ) {
      console.log("Error en modificarCliente", error);
      return error;
    }
    console.log("Error en modificarCliente", error);
    throw error;
  }
};

export const deleteClient = async (career) => {
  try {
    const response = await axiosInstance.delete(`carrera/${career.id}`);
    return response;
  } catch (error) {
    console.log("Error en deleteClient", error);
    throw error;
  }
};
