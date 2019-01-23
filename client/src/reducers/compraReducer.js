import {
  SET_DATOS_COMPRA,
  SET_CONTRATO,
  SET_VALOR_VALE,
  BORRAR_COMPRA_ACTUAL
} from "../actions/types";

const initialState = {
  inicioCompra: false,
  valorVale: 0,
  valorTotal: 0,
  cantidad: 0,
  stringCompra: "",
  contrato: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_DATOS_COMPRA:
      return {
        ...state,
        inicioCompra: action.payload.inicioCompra,
        valorTotal: action.payload.valor,
        valorVale: action.payload.precioVale,
        cantidad: action.payload.cantidad,
        stringCompra: action.payload.stringCompra
      };
    case SET_CONTRATO:
      return {
        ...state,
        contrato: action.payload
      };
    case SET_VALOR_VALE:
      return {
        ...state,
        contrato: action.payload.contrato,
        valorVale: action.payload.precio.valorTotal
      };
    case BORRAR_COMPRA_ACTUAL:
      return {
        ...initialState
      };
    default:
      return state;
  }
}
