import { SET_DATOS_COMPRA } from "../actions/types";

const initialState = {
  inicioCompra: false,
  valor: 0,
  precioVale: 0,
  cantidad: 0,
  stringCompra: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_DATOS_COMPRA:
      return {
        ...state,
        inicioCompra: action.payload.inicioCompra,
        valor: action.payload.valor,
        precioVale: action.payload.precioVale,
        cantidad: action.payload.cantidad,
        stringCompra: action.payload.stringCompra
      };
    default:
      return state;
  }
}
