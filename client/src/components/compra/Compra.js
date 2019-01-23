import React, { Component } from "react";
import PropTypes from "prop-types";
import Websocket from "react-websocket";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { iniciarCompra } from "../../actions/cantidadActions";
import { reiniciarCompra } from "../../actions/identificacionActions";

class Compra extends Component {
  constructor() {
    super();
    this.state = {
      data: "",
      pagoExitoso: false,
      beneficiario: {},
      compra: {},
      errors: {}
    };
    this.handleChange = this.handleChange.bind(this);
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
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

  onClick = e => {
    e.preventDefault();
    if (e.target.value === "BORRAR") {
      this.setState({ cantidad: "" });
    } else if (e.target.value === "ACEPTAR") {
      console.log("Iniciar compra para ", this.state.cantidad, "vales");
      const compraData = {
        cantidad: this.state.cantidad
      };

      this.props.iniciarCompra(compraData);
    } else {
      this.setState({
        cantidad: this.state.cantidad + e.target.value
      });
    }
  };

  handleData(data) {
    //let result = JSON.parse(data);
    //this.setState({ count: this.state.count + result.movement });
    const respuesta = JSON.parse(data);
    console.log("Respuesta:", respuesta);
    this.setState({ pagoExitoso: respuesta.pagoExitoso });
    this.setState({ data: respuesta.message });
  }

  render() {
    const beneficiario = this.state.beneficiario;
    const compra = this.state.compra;

    return (
      <div className="text-center fondoIdentificacion">
        <div className="otro">
          <div className="tdocumento">
            <p id="tdocumentoCompra">
              {beneficiario.nombre}, Ha iniciado la compra de {compra.cantidad}{" "}
              vales por un valor de ${compra.valorTotal}. Por favor presione el
              botón Verde del Datafono para realizar el pago, y siga las
              instrucciones del datafono.
            </p>
            <Websocket
              url="ws://localhost:5000"
              onMessage={this.handleData.bind(this)}
            />
            <p>{this.state.data}</p>

            <Link to="/identificacion" id="terminarCompra">
              Terminar
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

Compra.propTypes = {
  iniciarCompra: PropTypes.func.isRequired,
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
  { iniciarCompra, reiniciarCompra }
)(Compra);
