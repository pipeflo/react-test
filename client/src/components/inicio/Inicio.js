import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  traerTiposIdentificacion,
  asignarTipoIdentificacion
} from "../../actions/inicioActions";
import Spinner from "../common/Spinner";

class Inicio extends Component {
  constructor() {
    super();
    this.state = {
      errors: {},
      timeOut: null
    };
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    if (this.props.tiposIdentificacion.tipos.length === 0) {
      this.props.traerTiposIdentificacion();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
      const props = this.props;
      if (nextProps.errors.mensaje) {
        this.setState({
          timeOut: setTimeout(function() {
            props.history.push("/");
          }, 10000)
        });
      }
    }

    if (nextProps.beneficiario.tipoIdentificacion) {
      this.props.history.push("/identificacion");
    }
  }

  handleTimeOut() {
    this.props.history.push("/");
  }

  onClick(e) {
    e.preventDefault();

    const codTipoIdentificacion = e.target.getAttribute("value");

    this.props.asignarTipoIdentificacion(
      this.props.tiposIdentificacion.tipos[codTipoIdentificacion]
    );
  }

  render() {
    const { tipos, cargando } = this.props.tiposIdentificacion;
    const funciones = { onClick: this.onClick };
    const { errors } = this.state;
    let contenido;
    let htmlTiposIdentificacion;
    if (errors.mensaje) {
      htmlTiposIdentificacion = (
        <div id="error_message_inicio" className="alert alert-info">
          {errors.mensaje}
        </div>
      );
    } else {
      htmlTiposIdentificacion = tipos.map(function(tipo, i) {
        return (
          <Link
            key={tipo.codTipoIdentificacion}
            style={{
              width: "250px",
              height: "180px",
              marginBottom: "30px",
              marginRight: "30px",
              fontSize: "24px",
              alignContent: "center",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              paddingTop: "8%"
            }}
            value={i}
            className="btn btn-primary"
            onClick={funciones.onClick}
            to="#"
          >
            {tipo.descripcion}
          </Link>
        );
      });
    }

    if (cargando) {
      contenido = (
        <div className="principal">
          <Spinner />
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
          <p id="nombre_cliente">
            Por favor seleccione su Tipo de Identificación para Iniciar
          </p>
          <div className="form-group" id="tipos_identificacion">
            {htmlTiposIdentificacion}
          </div>
        </div>
      );
    }
    return contenido;
  }
}

Inicio.propTypes = {
  traerTiposIdentificacion: PropTypes.func.isRequired,
  asignarTipoIdentificacion: PropTypes.func.isRequired,
  tiposIdentificacion: PropTypes.object.isRequired,
  beneficiario: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  tiposIdentificacion: state.tiposIdentificacion,
  beneficiario: state.beneficiario,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { traerTiposIdentificacion, asignarTipoIdentificacion }
)(Inicio);
