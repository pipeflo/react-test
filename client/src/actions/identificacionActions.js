import axios from "axios";
import { GET_ERRORS } from "./types";
import { SET_BENEFICIARIOS } from "./types";

//
export const buscarBenediciario = identificacionData => dispatch => {
  axios
    .post("/api/beneficiarios/consulta", identificacionData)
    .then(res => {
      const payload = {
        numero: identificacionData.numero,
        tipoIdentificacion: identificacionData.tipoIdentificacion,
        beneficiarios: res.data
      };
      dispatch(setBeneficiarios(payload));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Set Beneficiarios
export const setBeneficiarios = data => {
  return {
    type: SET_BENEFICIARIOS,
    payload: data
  };
};

//re-iniciar app
export const reiniciarCompra = () => dispatch => {
  //borrar info del store (identificacion -> numero, tipo y beneficiarios)
  dispatch(setBeneficiarios({}));
};
