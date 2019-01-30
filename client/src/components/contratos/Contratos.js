import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { agregarContrato } from "../../actions/contratosActions";
import { reiniciarCompra } from "../../actions/identificacionActions";
import Spinner from "../common/Spinner";

class Contratos extends Component {
  constructor() {
    super();
    this.state = {
      nombre: "",
      numeroIdentificacion: "",
      tipoIdentificacion: "",
      contratos: [],
      beneficiario: {},
      compra: {},
      errors: {},
      contratoSinOpcionDeCompra: false
    };
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    if (this.props.beneficiario.contratos.length === 0) {
      this.props.history.push("/identificacion");
    } else {
      if (this.props.beneficiario.contratos.length === 1) {
        //Solo tiene un contrato, verificar estado para enviar a Cantidad o mostrar error
        if (!this.props.beneficiario.contratos[0].error) {
          //Agregar info de contrato seleccionado
          this.props.agregarContrato(
            this.props.beneficiario.contratos[0],
            this.props.beneficiario
          );
        }
      }
    }
    this.setState({
      nombre: this.props.beneficiario.nombre,
      numeroIdentificacion: this.props.beneficiario.numeroIdentificacion,
      tipoIdentificacion: this.props.beneficiario.tipoIdentificacion,
      contratos: this.props.beneficiario.contratos
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.compra.inicioCompra) {
      this.props.history.push("/compra");
    }

    if (nextProps.beneficiario.contratos.length === 0) {
      this.props.history.push("/");
    }

    if (nextProps.compra.valorVale) {
      this.props.history.push("/cantidad");
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    console.log("selecciono ", e.target.value);
  };

  onKeyPress = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleChange(event) {
    this.setState({
      tipoIdentificacion: event.target.value
    });
  }

  onClick(e) {
    e.preventDefault();
    if (e.target.getAttribute("value") === "SALIR") {
      this.props.reiniciarCompra({});
    } else {
      const indexContrato = e.target.getAttribute("value")
        ? e.target.getAttribute("value")
        : e.target.parentNode.getAttribute("value");
      if (
        !["55", "32", "16", "67"].includes(
          this.props.beneficiario.contratos[indexContrato].codigoPlan
        )
      ) {
        this.props.agregarContrato(
          this.props.beneficiario.contratos[indexContrato],
          this.props.beneficiario
        );
      } else {
        this.setState({ contratoSinOpcionDeCompra: true });
      }
    }
  }

  render() {
    const { cargando } = this.props.compra;
    const nombre = this.state.nombre;
    const contratoSinCompra = this.state.contratoSinOpcionDeCompra;
    const funciones = { onClick: this.onClick };
    let activos = 0;
    const styleContratos = { fontWeight: "bold" };
    let htmlContratos = this.props.beneficiario.contratos.map(function(
      contrato,
      i
    ) {
      if (!contrato.error) {
        activos++;
        return (
          <Link
            key={contrato.numeroContrato}
            style={{
              width: "250px",
              height: "250px",
              marginBottom: "30px",
              marginRight: "30px",
              fontSize: "18px",
              textAlign: "left",
              alignContent: "center",
              color: "black"
            }}
            value={i}
            className="btn btn-primary boton_contrato"
            onClick={funciones.onClick}
            to="#"
          >
            <br />
            <br />
            <span style={styleContratos} value={i}>
              Producto:{" "}
            </span>{" "}
            <span style={{ color: "blue" }} value={i}>
              {contrato.nombreCompania}
            </span>
            <br />
            <span style={styleContratos}>Plan:</span> {contrato.nombrePlan}
            <br />
            <span style={styleContratos}>No. Contrato:</span>{" "}
            {contrato.numeroContrato}
            <br />
            <span style={styleContratos}>Familia:</span>{" "}
            {contrato.numeroFamilia}
            <br />
            <span style={styleContratos}>Estado:</span> {contrato.estadoUsuario}
          </Link>
        );
      } else {
        return <div />;
      }
    });

    let contenido;

    if (activos > 0) {
      contenido = (
        <div>
          <img
            id="fondo_principal"
            src="../../img/colsanitas_soft-pag_2.jpg"
            width="748"
            height="1366"
            alt=""
          />
          <p id="nombre_cliente">{nombre}</p>
          <p id="contrato">Seleccione el contrato al que aplique la compra</p>
          {contratoSinCompra ? (
            <div id="error_message_contratos" className="alert alert-info">
              El contrato seleccionado no requiere de la compra de Vales.
            </div>
          ) : (
            ""
          )}
          <div className="form-group" id="contract_1">
            {htmlContratos}
          </div>
          <Button
            id="home_button"
            style={{
              width: "250px",
              height: "101px"
            }}
            onClick={this.onClick}
            value="SALIR"
          />
        </div>
      );
    } else {
      contenido = (
        <div className="principal">
          <img
            id="fondo_principal"
            src="../../img/colsanitas_soft-pag_2.jpg"
            width="748"
            height="1366"
            alt=""
          />
          <p id="nombre_cliente">{nombre}</p>
          <p id="contrato">Seleccione el contrato al que aplique la compra</p>
          <div className="form-group" id="contract_1">
            <p className="error-message">
              Contrato cancelado acérquese a Asesoría integral o comuníquese a
              la Línea Nro. 4871920
            </p>
          </div>
          <Button
            id="home_button"
            style={{
              width: "250px",
              height: "101px"
            }}
            onClick={this.onClick}
            value="SALIR"
          />
        </div>
      );
    }

    if (cargando) {
      return (
        <div className="principal">
          <img
            id="fondo_principal"
            src="../../img/colsanitas_soft-pag_2.jpg"
            width="748"
            height="1366"
            alt=""
          />
          <Spinner />
        </div>
      );
    } else {
      return contenido;
    }
  }
}

Contratos.propTypes = {
  agregarContrato: PropTypes.func.isRequired,
  reiniciarCompra: PropTypes.func.isRequired,
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
  { agregarContrato, reiniciarCompra }
)(Contratos);
