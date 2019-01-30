import React, { Component } from "react";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";
import Websocket from "react-websocket";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { reiniciarCompra } from "../../actions/identificacionActions";
import {
  registrarCompra,
  consultarTiraAuditoria
} from "../../actions/compraActions";
import { iniciarCompra } from "../../actions/cantidadActions";
import Spinner from "../common/Spinner";

class Compra extends Component {
  constructor() {
    super();
    this.state = {
      show: false,
      imprimir: false,
      data: "",
      pagoExitoso: false,
      beneficiario: {},
      compra: {
        contrato: {},
        numeroAprobacion: "",
        tiraAuditora: {}
      },
      errors: {}
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    if (!this.props.compra.inicioCompra) {
      this.props.history.push("/identificacion");
    }
    this.setState({
      beneficiario: this.props.beneficiario,
      compra: this.props.compra
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !this.props.compra.cargando &&
      this.props.compra.tiraAuditora.textoHtml
    ) {
      this.PrintElem("tira");
      this.props.reiniciarCompra();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (!nextProps.compra.inicioCompra) {
      this.props.history.push("/");
    }

    if (nextProps.compra.transaccion) {
      console.log(this.props.compra.transaccion);
      this.setState({ imprimir: true });
      let compra = Object.assign({}, this.props.compra); //creating copy of object
      this.setState({ compra });
    }
  }

  handleShow() {
    console.log("Mostrar");
    this.setState({ show: true });
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onKeyPress = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleChange(event) {
    this.setState({
      tipoIdentificacion: event.target.value
    });
  }

  handleData(data) {
    //let result = JSON.parse(data);
    //this.setState({ count: this.state.count + result.movement });
    const respuesta = JSON.parse(data);
    console.log("Respuesta:", respuesta);
    if (respuesta.reintentar) {
      this.props.iniciarCompra(this.props.compra);
    } else {
      this.setState({
        data: respuesta.message,
        pagoExitoso: respuesta.pagoExitoso,
        show: true
      });
      if (this.state.pagoExitoso) {
        let compra = Object.assign({}, this.state.compra); //creating copy of object
        compra.numeroAprobacion = respuesta.numeroAprobacion;
        this.props.registrarCompra(this.state.beneficiario, compra);
      }
    }
  }

  handleClose(e) {
    e.preventDefault();

    if (e.target.value === "REINTENTAR") {
      //this.props.history.push("/cantidad");
      this.props.iniciarCompra(this.props.compra);
      this.setState({ show: false });
    } else if (e.target.value === "IMPRIMIR") {
      console.log("Vamos a imprimir");
      this.props.consultarTiraAuditoria(this.props.compra);
    } else if (e.target.value === "SALIR") {
      this.props.reiniciarCompra({});
    }
  }

  PrintElem(elem) {
    var mywindow = window.open("", "PRINT", "height=400,width=600");

    mywindow.document.write(
      "<html><head><title>" + document.title + "</title>"
    );
    mywindow.document.write("</head><body >");
    mywindow.document.write(document.getElementById("tira").innerHTML);
    mywindow.document.write("</body></html>");

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
  }

  render() {
    const {
      compra,
      beneficiario,
      imprimir,
      pagoExitoso,
      show,
      errors
    } = this.state;
    const textoTiraAuditora = this.props.compra.tiraAuditora.textoHtml;
    let botonFinal;
    let instrucciones;
    let contenido;

    if (pagoExitoso) {
      if (imprimir) {
        botonFinal = (
          <Button
            id="imprimir"
            style={{
              width: "263px",
              height: "101px"
            }}
            onClick={this.handleClose}
            value="IMPRIMIR"
          />
        );
      }
    } else {
      botonFinal = (
        <div>
          <Button
            id="salir"
            style={{
              width: "263px",
              height: "101px"
            }}
            onClick={this.handleClose}
            value="SALIR"
          />
          <Button
            id="reintentar"
            style={{
              width: "263px",
              height: "101px"
            }}
            className="btn btn-primary"
            onClick={this.handleClose}
            value="REINTENTAR"
          />
        </div>
      );
    }

    if (!show) {
      instrucciones = (
        <img
          id="instrucciones"
          src="../../img/instrucciones.jpg"
          width="80%"
          height="950px"
          alt=""
        />
      );
    } else {
      instrucciones = (
        <div id="resultado">
          <img
            id="icono"
            src={
              pagoExitoso
                ? "./img/buttons/exito.png"
                : "./img/buttons/cancelado.png"
            }
            alt=""
          />
          <p id="mensaje_final">{this.state.data}</p>
          {botonFinal}
          {errors.mensaje && (
            <div id="error_message_compra" className="alert alert-info">
              {errors.mensaje}
            </div>
          )}
        </div>
      );
    }

    if (!this.props.compra.cargando) {
      contenido = instrucciones;
    } else {
      contenido = (
        <div>
          <Spinner />
        </div>
      );
    }

    return (
      <div className="principal">
        <img
          id="fondo_principal"
          src="../../img/colsanitas_soft-pag_2.jpg"
          width="748"
          height="1366"
          alt=""
        />
        <p id="nombre_cliente">{beneficiario.nombre} </p>
        <p id="info_contrato">
          {compra.contrato.nombreProducto} No. Contrato:{" "}
          {compra.contrato.numeroContrato}
        </p>
        <p id="info_compra">
          Cantidad de Vales: {compra.cantidad}, Valor Total: $
          {compra.valorTotal}
        </p>

        {contenido}

        <div className="otro">
          <div id="tdocumento">
            <div id="mensaje-compra">
              <Websocket
                url="ws://localhost:5000"
                onMessage={this.handleData.bind(this)}
              />
            </div>
          </div>
        </div>
        <Button
          id="home_button_compra"
          style={{
            width: "250px",
            height: "101px"
          }}
          onClick={this.handleClose}
          value="SALIR"
        />

        <div id="tira" style={{ display: "none" }}>
          <p dangerouslySetInnerHTML={{ __html: textoTiraAuditora }} />
        </div>
      </div>
    );
  }
}

Compra.propTypes = {
  reiniciarCompra: PropTypes.func.isRequired,
  registrarCompra: PropTypes.func.isRequired,
  consultarTiraAuditoria: PropTypes.func.isRequired,
  iniciarCompra: PropTypes.func.isRequired,
  beneficiario: PropTypes.object.isRequired,
  compra: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  beneficiario: state.beneficiario,
  compra: state.compra,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { reiniciarCompra, registrarCompra, consultarTiraAuditoria, iniciarCompra }
)(Compra);
