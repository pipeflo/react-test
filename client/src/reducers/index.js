import { combineReducers } from "redux";
import identificacionReducer from "./identificacionReducer";
import cantidadReducer from "./cantidadReducer";
import errorReducer from "./errorReducer";

export default combineReducers({
  identificacion: identificacionReducer,
  compra: cantidadReducer,
  errors: errorReducer
});
