import { SET_BENEFICIARIOS } from "../actions/types";

const initialState = {
  numero: "",
  tipoIdentificacion: "",
  beneficiarios: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_BENEFICIARIOS:
      console.log("Entro a set beneficiarios");
      return {
        ...state,
        numero: action.payload.numero,
        tipoIdentificacion: action.payload.tipoIdentificacion,
        beneficiarios: action.payload.beneficiarios
      };
    default:
      return state;
  }
}
