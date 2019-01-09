const express = require("express");
const soapRequest = require("easy-soap-request");
const fs = require("fs");
const router = express.Router();
const xmlreader = require("xmlreader");

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
    const url =
      "https://osiapppre02.colsanitas.com/services/ProxyContratoMP.ProxyContratoMPHttpSoap11Endpoint";
    const headers = {
      "user-agent": "sampleTest",
      "Content-Type": "text/xml;charset=UTF-8",
      soapAction: "http://www.colsanitas.com/ContratoMP/consultarBeneficiario"
    };

    //const xml = fs.readFileSync("test/zipCodeEnvelope.xml", "utf-8");
    const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:con="http://colsanitas.com/ContratoMPServicio/" xmlns:nof="http://colsanitas.com/osi/comun/nofuncionales" xmlns:srv="http://colsanitas.com/osi/srv" xmlns:per="http://colsanitas.com/osi/comun/persona">
  <soapenv:Header>
     <con:HeaderRqust>
        <!--Optional:-->
        <con:header>
           <!--Optional:-->
           <nof:messageHeader>
              <!--Optional:-->
              <nof:messageKey>
              </nof:messageKey>
              <!--Optional:-->
              <nof:messageInfo>
                 <!--Optional:-->
                 <nof:tipoConsulta>1</nof:tipoConsulta>
              </nof:messageInfo>
              <!--Optional:-->
              <nof:trace>
              </nof:trace>
           </nof:messageHeader>
           <!--Optional:-->
           <nof:user>           
           </nof:user>
        </con:header>
     </con:HeaderRqust>
  </soapenv:Header>
  <soapenv:Body>
     <con:ConsultarBeneficiarioEnt>
        <!--Optional:-->
        <con:consultarBeneficiarioEnt>
           <!--Optional:-->
           <srv:ConsultarBeneficiario>
              <srv:identificacionBeneficiario>
                 <!--Optional:-->
                 <per:numIdentificacion>${
                   req.body.numero
                 }</per:numIdentificacion>
                 <!--Optional:-->
                 <per:tipoIdentificacion>${
                   req.body.tipoIdentificacion
                 }</per:tipoIdentificacion>
              </srv:identificacionBeneficiario>
           </srv:ConsultarBeneficiario>
        </con:consultarBeneficiarioEnt>
     </con:ConsultarBeneficiarioEnt>
  </soapenv:Body>
  </soapenv:Envelope>`;

    (async () => {
      try {
        const { response } = await soapRequest(url, headers, xml, 10000); // Optional timeout parameter(milliseconds)
        const { body, statusCode } = response;
        //console.log(body);
        //console.log(statusCode);
        //return res.status(400).json(errors);

        xmlreader.read(body, function(err, respuesta) {
          if (err) return console.log("Error reading XML:", err);

          // use .text() to get the content of a node:
          console.log(
            respuesta["s:Envelope"]["s:Header"][
              "h:HeaderRspns"
            ].header.responseStatus.businessException.errorDetails.errorCode.text()
          );
          if (
            respuesta["s:Envelope"]["s:Header"][
              "h:HeaderRspns"
            ].header.responseStatus.businessException.errorDetails.errorCode.text() ===
            "OK"
          ) {
            //encontró beneficiario
            return res.json({});
          } else {
            errors.numero = respuesta["s:Envelope"]["s:Header"][
              "h:HeaderRspns"
            ].header.responseStatus.businessException.errorDetails.errorDesc.text();
            return res.status(400).json(errors);
          }
        });
      } catch (e) {}
    })();
  }
});

module.exports = router;
