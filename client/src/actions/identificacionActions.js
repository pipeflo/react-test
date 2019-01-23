import axios from "axios";
import {
  SET_BENEFICIARIO,
  BENEFICIARIO_LOADING,
  BORRAR_BENEFICIARIO_ACTUAL,
  GET_ERRORS,
  CLEAR_ERRORS
} from "./types";

//
export const buscarBenediciario = identificacionData => dispatch => {
  dispatch(setBeneficiarioLoading(true));
  dispatch(clearErrors());
  axios
    .post("/api/beneficiarios/consulta", identificacionData)
    .then(res => {
      const payload = res.data;
      dispatch(setBeneficiario(payload));
    })
    .catch(err => {
      console.log("Entro al catch: ", err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
      dispatch(setBeneficiarioLoading(false));
    });
};

//Set Beneficiarios
export const setBeneficiario = data => {
  return {
    type: SET_BENEFICIARIO,
    payload: data
  };
};

//re-iniciar app
export const reiniciarCompra = () => dispatch => {
  dispatch(borrarBeneficiarioActual());
};

//cambiar estado de cargando beneficiario
export const setBeneficiarioLoading = cargando => {
  return {
    type: BENEFICIARIO_LOADING,
    payload: cargando
  };
};

//Borrar beneficiario actual
export const borrarBeneficiarioActual = () => {
  return {
    type: BORRAR_BENEFICIARIO_ACTUAL
  };
};

//Borrar errores
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
