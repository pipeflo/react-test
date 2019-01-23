const express = require("express");
const soapRequest = require("easy-soap-request");
const fs = require("fs");
const router = express.Router();
const xmlreader = require("xmlreader");
const { consultaPrecio, registrarCompra } = require("../../config/keys");

//Beneficiario validator
const validateConsultaBeneficiario = require("../../validation/consultaBeneficiario");
const validateConsultaPrecio = require("../../validation/validateConsultaPrecio");

// @Route  GET api/beneficiarios/test
// @Desc   Test Users route
// @Access Public
router.get("/test", (req, res) => res.json({ msg: "Beneficiarios Funciona" }));

// @Route  POST api/beneficiarios/consulta
// @Desc   Consultar un beneficiario
// @Access Public
router.post("/consulta", (req, res) => {
  const { errors, isValid } = validateConsultaBeneficiario(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  } else {
    //Ir y consultar usuario
    const url =
      "https://osiapppre02.colsanitas.com/services/ProxyContratoMP.ProxyContratoMPHttpSoap12Endpoint";
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
                   req.body.numeroIdentificacion
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

        xmlreader.read(body, function(err, respuesta) {
          if (err) return console.log("Error reading XML:", err);

          if (
            respuesta["s:Envelope"]["s:Header"][
              "h:HeaderRspns"
            ].header.responseStatus.businessException.errorDetails.errorCode.text() ===
            "OK"
          ) {
            //encontró beneficiario
            let beneficiario = {};

            if (
              respuesta["s:Envelope"][
                "s:Body"
              ].ConsultarBeneficiarioSal.consultarBeneficiarioSal.Contrato.count() ===
              1
            ) {
              //Tiene un solo contrato
              beneficiario = {
                tipoIdentificacion: req.body.tipoIdentificacion,
                numeroIdentificacion: req.body.numeroIdentificacion,
                codTipoIdentificacion: req.body.codTipoIdentificacion,
                nombre: respuesta["s:Envelope"][
                  "s:Body"
                ].ConsultarBeneficiarioSal.consultarBeneficiarioSal.Contrato.InformacionBeneficiarios.nombreBeneficiario
                  .text()
                  .replace(/_|,/g, function(x) {
                    return x === "_" ? " " : ", ";
                  }),
                contratos: extraerContratos(
                  respuesta["s:Envelope"]["s:Body"].ConsultarBeneficiarioSal
                    .consultarBeneficiarioSal.Contrato
                )
              };

              if (beneficiario.contratos[0].estadoContrato === "4") {
                //contrato Liquidado, verificar si el usuario está o no HABILITADO
                if (beneficiario.contratos[0].estadoUsuario === "HABILITADO") {
                  //estado contato y estado usuario correctos
                  beneficiario.contratos[0].error = false;
                } else {
                  //Estado de usuario NO HABILITADO
                  beneficiario.contratos[0].error =
                    "Su  contrato  se  encuentra pendiente de pagos acérquese a Asesoría integral o comuníquese a la LíneaNro. 4871920";
                }
              } else if (beneficiario.contratos[0].estadoContrato === "1") {
                //contrato cancelado, revisar si está o no HABILITADO
                if (
                  beneficiario.contratos[0].EstadoUsuarioPrestacionServicio ===
                  "HABILITADO"
                ) {
                  if (
                    beneficiario.contratos[0].fechaConsultaPrestacionServicio >
                    Date.now()
                  ) {
                    //contrato cancelado pero aun vigente
                    beneficiario.contratos[0].error = false;
                  } else {
                    beneficiario.contratos[0].error =
                      "Contrato cancelado, acérquese a Asesoría integral o comuníquese a la Línea Nro. 4871920";
                  }
                } else {
                  beneficiario.contratos[0].error =
                    "Contrato cancelado, acérquese a Asesoría integral o comuníquese a la Línea Nro. 4871920";
                }
              }
              return res.json(beneficiario);
            } else if (
              respuesta["s:Envelope"][
                "s:Body"
              ].ConsultarBeneficiarioSal.consultarBeneficiarioSal.Contrato.count() >
              1
            ) {
              //Tiene varios contratos
              beneficiario = {
                nombre: respuesta["s:Envelope"][
                  "s:Body"
                ].ConsultarBeneficiarioSal.consultarBeneficiarioSal.Contrato.at(
                  0
                )
                  .InformacionBeneficiarios.nombreBeneficiario.text()
                  .replace(/_|,/g, function(x) {
                    return x === "_" ? " " : ", ";
                  }),
                tipoIdentificacion: req.body.tipoIdentificacion,
                numeroIdentificacion: req.body.numeroIdentificacion,
                codTipoIdentificacion: req.body.codTipoIdentificacion,
                contratos: extraerContratos(
                  respuesta["s:Envelope"]["s:Body"].ConsultarBeneficiarioSal
                    .consultarBeneficiarioSal.Contrato
                )
              };
              console.log(beneficiario);
              return res.json(beneficiario);
            }
          } else {
            errors.mensaje = respuesta["s:Envelope"]["s:Header"][
              "h:HeaderRspns"
            ].header.responseStatus.businessException.errorDetails.errorDesc.text();
            return res.status(400).json(errors);
          }
        });
      } catch (e) {}
    })();
  }
});

// @Route  POST api/beneficiarios/precio
// @Desc   Consultar un precio de vale para un beneficiario
// @Access Public
router.post("/precio", (req, res) => {
  const { errors, isValid } = validateConsultaPrecio(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  } else {
    //Ir y consultar usuario
    const url =
      "https://osiapppre02.colsanitas.com/services/GestionPines.GestionPinesHttpSoap12Endpoint";
    const headers = {
      "user-agent": "sampleTest",
      "Content-Type": "text/xml;charset=UTF-8",
      soapAction: "http://www.colsanitas.com/GestionPines/ConsultarPrecio"
    };

    //const xml = fs.readFileSync("test/zipCodeEnvelope.xml", "utf-8");
    const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ges="http://www.colsanitas.com/GestionPines/" xmlns:com="http://www.colsanitas.com/schema/osi/comun" xmlns:srv="http://www.colsanitas.com/schema/osi/srv">
    <soapenv:Header>
       <ges:HeaderRqust>
          <header>
             <com:user>
              <com:userName>${consultaPrecio.userName}</com:userName>
              <com:userToken>${consultaPrecio.userToken}</com:userToken>
             </com:user>
          </header>
       </ges:HeaderRqust>
    </soapenv:Header>
    <soapenv:Body>
       <ges:ConsultaPrecioEnt>
          <precio>
             <srv:consulta>
              <srv:codigoCompania>${
                req.body.contrato.codigoCompania
              }</srv:codigoCompania>
              <srv:codigoPlan>${req.body.contrato.codigoPlan}</srv:codigoPlan>
              <srv:numeroContrato>${
                req.body.contrato.numeroContrato
              }</srv:numeroContrato>
             </srv:consulta>
             <srv:numeroFamilia>${
               req.body.contrato.numeroFamilia
             }</srv:numeroFamilia>
             <srv:documento>
             <com:Documento>${
               req.body.beneficiario.numeroIdentificacion
             }</com:Documento>
            <com:TipoDocumento>${
              req.body.beneficiario.codTipoIdentificacion
            }</com:TipoDocumento>
             </srv:documento>
             <srv:codCiudad>${consultaPrecio.codigoCiudad}</srv:codCiudad>
             <srv:cantidad>1</srv:cantidad>
          </precio>
       </ges:ConsultaPrecioEnt>
    </soapenv:Body>
 </soapenv:Envelope>`;

    console.log("XML traer precio:", xml);

    (async () => {
      try {
        const { response } = await soapRequest(url, headers, xml, 10000); // Optional timeout parameter(milliseconds)
        const { body, statusCode } = response;

        xmlreader.read(body, function(err, respuesta) {
          if (err) return console.log("Error reading XML:", err);

          let precio = {};

          precio.valorTotal = respuesta["soapenv:Envelope"]["soapenv:Body"][
            "ns4:ConsultaPrecioSal"
          ].precioSal.precio.precio["ns1:valorTotal"].text();
          precio.valorIVA = respuesta["soapenv:Envelope"]["soapenv:Body"][
            "ns4:ConsultaPrecioSal"
          ].precioSal.precio.precio["ns1:valorIVA"].text();
          precio.valorBase = respuesta["soapenv:Envelope"]["soapenv:Body"][
            "ns4:ConsultaPrecioSal"
          ].precioSal.precio["ns2:valorBase"].text();
          precio.descuento = respuesta["soapenv:Envelope"]["soapenv:Body"][
            "ns4:ConsultaPrecioSal"
          ].precioSal.precio["ns2:descuento"].text();
          precio.requierePin = respuesta["soapenv:Envelope"]["soapenv:Body"][
            "ns4:ConsultaPrecioSal"
          ].precioSal.precio["ns2:requierePin"].text();
          res.json(precio);
        });
      } catch (e) {
        console.log("Error:", e);
      }
    })();
  }
});

// @Route  POST api/beneficiarios/registrar
// @Desc   Registrar compra
// @Access Public
router.post("/registrar", (req, res) => {
  //const { errors, isValid } = validateConsultaPrecio(req.body);

  const isValid = true;

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  } else {
    //Ir y consultar usuario
    const url =
      "https://osiapppre02.colsanitas.com/services/ValeElectronico.ValeElectronicoHttpSoap11Endpoint";
    const headers = {
      "user-agent": "sampleTest",
      "Content-Type": "text/xml;charset=UTF-8",
      soapAction: "urn:registrar"
    };

    const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:val="http://www.colsanitas.com/schema/dss/aseguradoras/ValeElectronico">
    <soapenv:Header/>
    <soapenv:Body>
       <val:registrar>
          <val:canal>${registrarCompra.canal}</val:canal>
          <val:ciudad>${registrarCompra.codigoCiudad}</val:ciudad>
          <val:codigoCompania>${
            req.body.compra.contrato.codigoCompania
          }</val:codigoCompania>
          <val:codigoConcepto>${
            registrarCompra.codigoConcepto
          }</val:codigoConcepto>
          <val:codigoEstacion>${
            registrarCompra.codigoEstacion
          }</val:codigoEstacion>
          <val:tipoDocUsuario>${
            req.body.beneficiario.codTipoDocumento
          }</val:tipoDocUsuario>
          <val:documentoIdentUsu>${
            req.body.beneficiario.numeroIdentificacion
          }</val:documentoIdentUsu>
          <val:contrato>${
            req.body.compra.contrato.numeroContrato
          }</val:contrato>
          <val:plan>${req.body.compra.contrato.codigoPlan}</val:plan>
          <val:familia>${req.body.compra.contrato.numeroFamilia}</val:familia>
          <val:usuario>${
            req.body.compra.contrato.codigoTipoUsuario
          }</val:usuario>
          <val:numerTransaccion>${
            req.body.compra.numeroTransaccion
          }</val:numerTransaccion>
          <val:cantidad>${req.body.compra.cantidad}</val:cantidad>
          <val:valorTotalTrx>${req.body.compra.valorTotal}</val:valorTotalTrx>
          <val:mediosDePago>5,${req.body.compra.valorTotal},0,0,D,0,${
      req.body.compra.numeroAprobacion
    }</val:mediosDePago>
          <val:aplicacionAsigna>${
            registrarCompra.aplicacionAsigna
          }</val:aplicacionAsigna>
          <val:vales>0</val:vales>
          <val:categoria></val:categoria>
          <val:documentoIdentPrest></val:documentoIdentPrest>
          <val:servicio></val:servicio>
          <val:viaIngreso></val:viaIngreso>
          <val:estado>2</val:estado>
          <val:tipoDocPrest></val:tipoDocPrest>
       </val:registrar>
    </soapenv:Body>
 </soapenv:Envelope>`;

    (async () => {
      try {
        const { response } = await soapRequest(url, headers, xml, 10000); // Optional timeout parameter(milliseconds)
        const { body, statusCode } = response;

        xmlreader.read(body, function(err, respuesta) {
          if (err) return console.log("Error reading XML:", err);

          let precio = {};

          precio.valorTotal = respuesta["soapenv:Envelope"]["soapenv:Body"][
            "ns4:ConsultaPrecioSal"
          ].precioSal.precio.precio["ns1:valorTotal"].text();
          precio.valorIVA = respuesta["soapenv:Envelope"]["soapenv:Body"][
            "ns4:ConsultaPrecioSal"
          ].precioSal.precio.precio["ns1:valorIVA"].text();
          precio.valorBase = respuesta["soapenv:Envelope"]["soapenv:Body"][
            "ns4:ConsultaPrecioSal"
          ].precioSal.precio["ns2:valorBase"].text();
          precio.descuento = respuesta["soapenv:Envelope"]["soapenv:Body"][
            "ns4:ConsultaPrecioSal"
          ].precioSal.precio["ns2:descuento"].text();
          precio.requierePin = respuesta["soapenv:Envelope"]["soapenv:Body"][
            "ns4:ConsultaPrecioSal"
          ].precioSal.precio["ns2:requierePin"].text();
          res.json(precio);
        });
      } catch (e) {
        console.log("Error:", e);
      }
    })();
  }
});

const extraerContratos = contratosXml => {
  const contratos = [];
  contratosXml.each((i, contratoXml) => {
    const contrato = {
      nombreProducto: contratoXml.InformacionBasicadelContrato.nombreProducto.text(),
      numeroContrato: contratoXml.InformacionBasicadelContrato.numContrato.text(),
      estadoContrato: contratoXml.InformacionBasicadelContrato.codEstadoContrato.text(),
      estadoUsuario: contratoXml.EstadoUsuarioPrestacionServicio.estadoHabilitado.text(),
      tipoUsuario: contratoXml.InformacionBeneficiarios.tipoUsuario.text(),
      codigoTipoUsuario: contratoXml.InformacionBeneficiarios.codigoTipoUsuario.text(),
      codigoCompania: contratoXml.InformacionBasicadelContrato.producto.text(),
      nombreCompania: contratoXml.InformacionBasicadelContrato.nombreProducto.text(),
      codigoPlan: contratoXml.InformacionBasicadelContrato.codigoPlan.text(),
      nombrePlan: contratoXml.InformacionBasicadelContrato.nombrePlan.text(),
      numeroContrato: contratoXml.InformacionBasicadelContrato.numContrato.text(),
      numeroFamilia: contratoXml.InformacionBasicadelContrato.numeroFamilia.text(),
      estatoTitularFamilia: contratoXml.InformacionBasicadelContrato.estadoTitularFamilia.text(),
      fechaPrestacionDeServicio: new Date(
        contratoXml.EstadoUsuarioPrestacionServicio.fechaConsultaPrestacionServicio.text()
      )
    };

    if (contrato.estadoContrato === "4") {
      //contrato Liquidado, verificar si el usuario está o no HABILITADO
      if (contrato.estadoUsuario === "HABILITADO") {
        //estado contrato y estado usuario correctos
        contrato.error = false;
      } else {
        //Estado de usuario NO HABILITADO
        contrato.error =
          "Su  contrato  se  encuentra pendiente de pagos acérquese a Asesoría integral o comuníquese a la LíneaNro. 4871920";
      }
    } else if (contrato.estadoContrato === "1") {
      //contrato cancelado, revisar si está o no HABILITADO
      if (contrato.estadoUsuario === "HABILITADO") {
        if (contrato.fechaConsultaPrestacionServicio > Date.now()) {
          //contrato cancelado pero aun vigente
          contrato.error = false;
        } else {
          contrato.error =
            "Contrato cancelado, acérquese a Asesoría integral o comuníquese a la Línea Nro. 4871920";
        }
      } else {
        contrato.error =
          "Contrato cancelado, acérquese a Asesoría integral o comuníquese a la Línea Nro. 4871920";
      }
    }
    contratos.push(contrato);
  });
  return contratos;
};

module.exports = router;
