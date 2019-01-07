const express = require("express");
const fs = require("fs");
const router = express.Router();

//Beneficiario validator
const validateCompra = require("../../validation/validationCompra");

// @Route  GET api/users/test
// @Desc   Test Users route
// @Access Public
router.get("/test", (req, res) => res.json({ msg: "Compras Funciona" }));

// @Route  POST api/compra/iniciar
// @Desc   Consultar un beneficiario
// @Access Public
router.post("/iniciar", (req, res) => {
  console.log("Entro a iniciar compra con ", req.body);
  const { errors, isValid } = validateCompra(req.body);

  // Check Validation
  if (!isValid) {
    console.log(errors);
    return res.status(400).json(errors);
  }

  //Consultar precio Vale
  const precioVale = 22000;
  //Crear archivo de compra
  const valorCompra = precioVale * Number(req.body.cantidad);
  const stringCompra = `01,${valorCompra},1,T0501,78175,0,0,11,`;
  const lrc = calculateLRC(stringCompra);
  const stringCompraFinal = stringCompra + lrc;
  //const stringCompra = `01,50,1,T0501,78175,0,0,11,59`;

  fs.writeFile(
    "./TCP-IP/IOFile/inp/dataf001_inp.eft",
    stringCompraFinal,
    function(err) {
      if (err) {
        console.log(err);
        return res.status(400).json(errors);
      }
      console.log("Escribio archivo");
      return res.json({
        inicioCompra: true,
        valor: valorCompra,
        precioVale: precioVale,
        cantidad: Number(req.body.cantidad),
        stringCompra: stringCompraFinal
      });
    }
  );
});

const calculateLRC = str => {
  var bytes = [];
  var lrc = 0;
  for (var i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i));
  }
  for (var i = 0; i < str.length; i++) {
    lrc ^= bytes[i];
  }
  //return String.fromCharCode(lrc);
  return lrc.toString(16);
};

module.exports = router;
