import { combineReducers } from "redux";
import identificacionReducer from "./beneficiarioReducer";
import cantidadReducer from "./compraReducer";
import errorReducer from "./errorReducer";

export default combineReducers({
  beneficiario: identificacionReducer,
  compra: cantidadReducer,
  errors: errorReducer
});
