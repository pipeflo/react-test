import axios from "axios";
import { GET_ERRORS, SET_CONTRATO, SET_VALOR_VALE } from "./types";
import compraReducer from "../reducers/compraReducer";

export const agregarContrato = (contratoData, beneficiario) => dispatch => {
  //Llamar API para traer precio de vale
  const infoCompra = {
    beneficiario: beneficiario,
    contrato: contratoData
  };
  console.log("Ejecutando Accion traer precio");
  axios
    .post("/api/beneficiarios/precio", infoCompra)
    .then(res => {
      //Se consulta precio vale y se envia a reducer
      const compra = {
        contrato: contratoData,
        precio: res.data
      };
      console.log("datos compra:", compra);
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
};
