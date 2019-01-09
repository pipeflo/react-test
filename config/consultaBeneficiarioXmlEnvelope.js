const xmlEnvelope = {
  numero: "",
  tipoIdentificacion: ""
};

xmlEnvelope.xmlEnvelope = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:con="http://colsanitas.com/ContratoMPServicio/" xmlns:nof="http://colsanitas.com/osi/comun/nofuncionales" xmlns:srv="http://colsanitas.com/osi/srv" xmlns:per="http://colsanitas.com/osi/comun/persona">
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
                 xmlEnvelope.numero
               }</per:numIdentificacion>
               <!--Optional:-->
               <per:tipoIdentificacion>${
                 xmlEnvelope.tipoIdentificacion
               }</per:tipoIdentificacion>
            </srv:identificacionBeneficiario>
         </srv:ConsultarBeneficiario>
      </con:consultarBeneficiarioEnt>
   </con:ConsultarBeneficiarioEnt>
</soapenv:Body>
</soapenv:Envelope>`;

module.exports = xmlEnvelope;
