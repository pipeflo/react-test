import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
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
    if (e.target.getAttribute("value") === "CANCELAR") {
      this.props.reiniciarCompra({});
    } else {
      const indexContrato = e.target.getAttribute("value");
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
              height: "180px",
              marginBottom: "30px",
              marginRight: "30px",
              fontSize: "18px",
              textAlign: "left",
              alignContent: "center"
            }}
            value={i}
            className="btn btn-primary"
            onClick={funciones.onClick}
            to="#"
          >
            Producto: {contrato.nombreCompania}
            <br />
            Plan: {contrato.nombrePlan}
            <br />
            No. Contrato: {contrato.numeroContrato}
            <br />
            Familia: {contrato.numeroFamilia}
            <br />
            Estado: {contrato.estadoUsuario}
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
            <p id="contratoSinCompra" className="message-error">
              El contrato seleccionado no requiere de la compra de Vales.
            </p>
          ) : (
            ""
          )}
          <div className="form-group" id="contract_1">
            {htmlContratos}
          </div>
          <div className="form-group" id="keyboard_2">
            <input
              style={{ width: "312px", height: "75px", fontSize: "40px" }}
              type="button"
              className="btn btn-primary"
              value="CANCELAR"
              onClick={this.onClick}
            />
          </div>
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
          <div className="form-group" id="keyboard_2">
            <input
              style={{ width: "312px", height: "75px", fontSize: "40px" }}
              type="button"
              className="btn btn-primary"
              value="CANCELAR"
              onClick={this.onClick}
            />
          </div>
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
