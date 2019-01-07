const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCompra(data) {
  let errors = {};

  data.cantidad = !isEmpty(data.cantidad) ? data.cantidad : "";

  if (Validator.isEmpty(data.cantidad)) {
    errors.cantidad = "La cantidad de Vales debe ser mayor a 0";
  }

  if (data.cantidad > 20) {
    errors.cantidad = "No puede comprar más de 20 vales";
  }

  if (data.cantidad < 1) {
    errors.cantidad = "La cantidad de Vales debe ser mayor a 0";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
