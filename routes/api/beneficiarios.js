const express = require("express");
const router = express.Router();

//Beneficiario validator
const validateConsultaBeneficiario = require("../../validation/consultaBeneficiario");

// @Route  GET api/users/test
// @Desc   Test Users route
// @Access Public
router.get("/test", (req, res) => res.json({ msg: "Beneficiarios Funciona" }));

// @Route  POST api/beneficiarios/consulta
// @Desc   Consultar un beneficiario
// @Access Public
router.post("/consulta", (req, res) => {
  console.log("Entro a consulta con ", req.body);
  const { errors, isValid } = validateConsultaBeneficiario(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  } else {
    //Ir y consultar usuario
    return res.json([
      {
        nombre: "Carol Modera",
        numero: "1018418668",
        tipo: "CC",
        activo: "Si"
      },
      {
        nombre: "Luis Florez",
        numero: "1019021430",
        tipo: "CC",
        activo: "Si"
      }
    ]);
  }
});

module.exports = router;
