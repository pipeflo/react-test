import {
  SET_BENEFICIARIO,
  BENEFICIARIO_LOADING,
  BORRAR_BENEFICIARIO_ACTUAL
} from "../actions/types";

const initialState = {
  nombre: "",
  tipoIdentificacion: "",
  codTipoIdentificacion: "",
  numeroIdentificacion: "",
  contratos: [],
  cargando: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case BENEFICIARIO_LOADING:
      return {
        ...initialState,
        cargando: action.payload
      };
    case BORRAR_BENEFICIARIO_ACTUAL:
      return {
        ...initialState
      };
    case SET_BENEFICIARIO:
      console.log(action.payload);
      return {
        ...action.payload,
        cargando: false
      };
    default:
      return state;
  }
}
