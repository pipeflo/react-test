import axios from "axios";
import { GET_ERRORS, SET_VALOR_VALE, CONTRATO_LOADING } from "./types";

export const agregarContrato = (contratoData, beneficiario) => dispatch => {
  dispatch(setContratoLoading(true));
  //Traer código de ciudad
  axios
    .post("/api/beneficiarios/ciudad", contratoData)
    .then(res => {
      contratoData = res.data;
      //Llamar API para traer precio de vale
      const infoCompra = {
        beneficiario: beneficiario,
        contrato: contratoData
      };
      axios
        .post("/api/beneficiarios/precio", infoCompra)
        .then(res => {
          //Se consulta precio vale y se envia a reducer
          const compra = {
            contrato: contratoData,
            precio: res.data
          };
          dispatch({
            type: SET_VALOR_VALE,
            payload: compra
          });
        })
        .catch(err =>
          dispatch({
            type: GET_ERRORS,
            payload: err.response.data
          })
        );
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//cambiar estado de cargando beneficiario
export const setContratoLoading = cargando => {
  return {
    type: CONTRATO_LOADING,
    payload: true
  };
};
