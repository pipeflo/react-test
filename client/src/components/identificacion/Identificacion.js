import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import { buscarBenediciario } from "../../actions/identificacionActions";
import Spinner from "../common/Spinner";

class Identificacion extends Component {
  constructor() {
    super();
    this.state = {
      nombre: "",
      tipoIdentificacion: "",
      codTipoIdentificacion: "",
      numeroIdentificacion: "",
      contratos: [],
      cargando: false,
      errors: {}
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.beneficiario.contratos.length > 0) {
      this.props.history.push("/contratos");
    }
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
    if (event.target.value === "CC") {
      console.log("TIpo identificacion CC");
      this.setState({ codTipoIdentificacion: "01" });
    } else {
      this.setState({ codTipoIdentificacion: "02" });
    }
  }

  onClick = e => {
    e.preventDefault();
    if (e.target.value === "BORRAR") {
      this.setState({ numeroIdentificacion: "" });
    } else if (e.target.value === "ACEPTAR") {
      const identificacionData = {
        numeroIdentificacion: this.state.numeroIdentificacion,
        tipoIdentificacion: this.state.tipoIdentificacion,
        codTipoIdentificacion: this.state.codTipoIdentificacion
      };

      this.props.buscarBenediciario(identificacionData);
    } else {
      console.log("Pico en numero");
      this.setState({
        numeroIdentificacion: this.state.numeroIdentificacion + e.target.value
      });
    }
  };

  render() {
    const { errors } = this.state;
    const { cargando } = this.props.beneficiario;

    let numeroStyle = {
      width: "75px",
      height: "75px",
      marginBottom: "20px",
      marginRight: "20px",
      fontSize: "45px"
    };

    let contenido;

    if (cargando) {
      contenido = (
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
      contenido = (
        <div>
          <img
            id="fondo_principal"
            src="../../img/colsanitas_soft-pag_2.jpg"
            width="748"
            height="1366"
            alt=""
          />
          <p id="tdocumento">Escoja su tipo de documento</p>
          <div className="row text-center" id="checkbox_1">
            <label id="checkbox" htmlFor="primary" className="btn btn-primary">
              Cédula de Ciudadanía{" "}
              <input
                type="radio"
                id="primary"
                className="badgebox"
                value="CC"
                checked={this.state.tipoIdentificacion === "CC"}
                onChange={this.handleChange}
              />
              <span className="badge">&#10004;</span>
            </label>
            <label id="checkbox" htmlFor="second" className="btn btn-primary">
              Cédula de Extranjería{" "}
              <input
                type="radio"
                id="second"
                className="badgebox"
                value="CE"
                checked={this.state.tipoIdentificacion === "CE"}
                onChange={this.handleChange}
              />
              <span className="badge">&#10004;</span>
            </label>
            <label id="checkbox" htmlFor="third" className="btn btn-primary">
              Nit{" "}
              <input
                type="checkbox"
                id="third"
                className="badgebox"
                value="NIT"
                checked={this.state.tipoIdentificacion === "NIT"}
                onChange={this.handleChange}
              />
              <span className="badge">&#10004;</span>
            </label>
            {errors.tipoIdentificacion && (
              <div className="error-message">{errors.tipoIdentificacion}</div>
            )}
          </div>

          <p id="tcedula">Digite su número de Identificación</p>
          <img id="imark" src="../../img/input_mark.png" alt="" />
          <div className="form-group">
            <form name="login">
              <label htmlFor="usr">
                <input
                  type="text"
                  className={classnames("form-control identificacion", {
                    "is-invalid": errors.numeroIdentificacion
                  })}
                  id="usr"
                  placeholder="Identificación"
                  name="identificacion"
                  value={this.state.numeroIdentificacion}
                  onChange={this.onChange}
                  onKeyPress={this.onKeyPress}
                />
              </label>
              {errors.numeroIdentificacion && (
                <div className="error-message" id="error-identificacion">
                  {errors.numeroIdentificacion}
                </div>
              )}
              {errors.mensaje && (
                <div className="error-message" id="error-identificacion">
                  {errors.mensaje}
                </div>
              )}
              <div id="keyboard" className="form-group">
                <input
                  style={numeroStyle}
                  type="button"
                  className="btn btn-primary"
                  value="1"
                  onClick={this.onClick}
                />
                <input
                  style={numeroStyle}
                  type="button"
                  className="btn btn-primary"
                  value="2"
                  onClick={this.onClick}
                />
                <input
                  style={numeroStyle}
                  type="button"
                  className="btn btn-primary"
                  value="3"
                  onClick={this.onClick}
                />
                <br />
                <input
                  style={numeroStyle}
                  type="button"
                  className="btn btn-primary"
                  value="4"
                  onClick={this.onClick}
                />
                <input
                  style={numeroStyle}
                  type="button"
                  className="btn btn-primary"
                  value="5"
                  onClick={this.onClick}
                />
                <input
                  style={numeroStyle}
                  type="button"
                  className="btn btn-primary"
                  value="6"
                  onClick={this.onClick}
                />
                <br />
                <input
                  style={numeroStyle}
                  type="button"
                  className="btn btn-primary"
                  value="7"
                  onClick={this.onClick}
                />
                <input
                  style={numeroStyle}
                  type="button"
                  className="btn btn-primary"
                  value="8"
                  onClick={this.onClick}
                />
                <input
                  style={numeroStyle}
                  type="button"
                  className="btn btn-primary"
                  value="9"
                  onClick={this.onClick}
                />
                <br />
                <button
                  id="invisible"
                  style={{
                    width: "75px",
                    height: "75px",
                    marginBottom: "3px",
                    marginRight: "20px"
                  }}
                  type="button"
                  className="btn btn-primary"
                >
                  0
                </button>
                <input
                  style={numeroStyle}
                  type="button"
                  className="btn btn-primary"
                  value="0"
                  onClick={this.onClick}
                />
                <button
                  id="invisible"
                  style={{
                    width: "75px",
                    height: "75px",
                    marginBottom: "3px"
                  }}
                  type="button"
                  className="btn btn-primary"
                >
                  0
                </button>
              </div>
              <div className="form-group" id="keyboard_2">
                <input
                  style={{
                    width: "312px",
                    height: "75px",
                    marginBottom: "3px",
                    fontSize: "40px"
                  }}
                  type="button"
                  className="btn btn-primary"
                  value="ACEPTAR"
                  onClick={this.onClick}
                />
                <br />
                <input
                  style={{ width: "312px", height: "75px", fontSize: "40px" }}
                  type="button"
                  className="btn btn-primary"
                  value="BORRAR"
                  onClick={this.onClick}
                />
              </div>
            </form>
          </div>
        </div>
      );
    }

    return contenido;
  }
}

Identificacion.propTypes = {
  buscarBenediciario: PropTypes.func.isRequired,
  beneficiario: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  beneficiario: state.beneficiario,
  cargando: state.cargando,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { buscarBenediciario }
)(Identificacion);
