import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import { buscarBenediciario } from "../../actions/identificacionActions";

class Identificacion extends Component {
  constructor() {
    super();
    this.state = {
      numero: "",
      tipoIdentificacion: "",
      beneficiarios: [],
      errors: {}
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.identificacion.numero) {
      console.log("Entro aca");
      this.props.history.push("/cantidad");
    }
  }

  componentDidUpdate(nextProps) {}

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
      this.setState({ numero: "" });
    } else if (e.target.value === "ACEPTAR") {
      const identificacionData = {
        numero: this.state.numero,
        tipoIdentificacion: this.state.tipoIdentificacion
      };

      this.props.buscarBenediciario(identificacionData);
    } else {
      this.setState({
        numero: this.state.numero + e.target.value
      });
    }
  };

  render() {
    const { errors } = this.state;
    console.log("Errors:", errors);

    return (
      <div className="text-center">
        <img
          className="fondo_principal"
          src="img/colsanitas_soft-pag_2.jpg"
          width="748"
          height="1366"
          alt=""
        />
        <p id="tdocumento">Escoja su tipo de documento</p>
        <div className="row text-center" id="checkbox_1">
          <label id="checkbox" for="primary" className="btn btn-primary">
            Cedula de Ciudadanía{" "}
            <input type="checkbox" id="primary" className="badgebox" />
            <span className="badge">&check;</span>
          </label>
          <label id="checkbox" for="second" className="btn btn-primary">
            Cedula de Extranjería{" "}
            <input type="checkbox" id="second" className="badgebox" />
            <span className="badge">&check;</span>
          </label>
          <label id="checkbox" for="third" className="btn btn-primary">
            Pasaporte <input type="checkbox" id="third" className="badgebox" />
            <span className="badge">&check;</span>
          </label>
        </div>
        <p id="tcedula">Digite su número de cedula</p>
        <img id="imark" src="../../img/input_mark.png" alt="" />
        <div className="form-group">
          <form name="login">
            <label for="usr" />
            <input
              type="text"
              className="form-control"
              id="usr"
              name="display"
              onkeypress="return solonumeros(event)"
            />
            <div id="keyboard" className="form-group">
              <input
                style={{
                  width: "75px",
                  height: "75px",
                  marginBottom: "3px",
                  fontSize: "45px"
                }}
                type="button"
                className="btn btn-primary"
                value="1"
                onClick="login.display.value +='1'"
              />
              <input
                style={{
                  width: "75px",
                  height: "75px",
                  marginBottom: "3px",
                  fontSize: "45px"
                }}
                type="button"
                className="btn btn-primary"
                value="2"
                onClick="login.display.value +='2'"
              />
              <input
                style={{
                  width: "75px",
                  height: "75px",
                  marginBottom: "3px",
                  fontSize: "45px"
                }}
                type="button"
                className="btn btn-primary"
                value="3"
                onClick="login.display.value +='3'"
              />
              <br />
              <input
                style={{
                  width: "75px",
                  height: "75px",
                  marginBottom: "3px",
                  fontSize: "45px"
                }}
                type="button"
                className="btn btn-primary"
                value="4"
                onClick="login.display.value +='4'"
              />
              <input
                style={{
                  width: "75px",
                  height: "75px",
                  marginBottom: "3px",
                  fontSize: "45px"
                }}
                type="button"
                className="btn btn-primary"
                value="5"
                onClick="login.display.value +='5'"
              />
              <input
                style={{
                  width: "75px",
                  height: "75px",
                  marginBottom: "3px",
                  fontSize: "45px"
                }}
                type="button"
                className="btn btn-primary"
                value="6"
                onClick="login.display.value +='6'"
              />
              <br />
              <input
                style={{
                  width: "75px",
                  height: "75px",
                  marginBottom: "3px",
                  fontSize: "45px"
                }}
                type="button"
                className="btn btn-primary"
                value="7"
                onClick="login.display.value +='7'"
              />
              <input
                style={{
                  width: "75px",
                  height: "75px",
                  marginBottom: "3px",
                  fontSize: "45px"
                }}
                type="button"
                className="btn btn-primary"
                value="8"
                onClick="login.display.value +='8'"
              />
              <input
                style={{
                  width: "75px",
                  height: "75px",
                  marginBottom: "3px",
                  fontSize: "45px"
                }}
                type="button"
                className="btn btn-primary"
                value="9"
                onClick="login.display.value +='9'"
              />
              <br />
              <button
                id="invisible"
                style={{ width: "75px", height: "75px", marginBottom: "3px" }}
                type="button"
                className="btn btn-primary"
              >
                0
              </button>
              <input
                style={{
                  width: "75px",
                  height: "75px",
                  marginBottom: "3px",
                  fontSize: "45px"
                }}
                type="button"
                className="btn btn-primary"
                value="0"
                onClick="login.display.value +='0'"
              />
              <button
                id="invisible"
                style={{ width: "75px", height: "75px", marginBottom: "3px" }}
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
                value=" ACEPTAR"
                onclick="#"
              />
              <br />
              <input
                style={{ width: "312px", height: "75px", fontSize: "40px" }}
                type="button"
                className="btn btn-primary"
                value="BORRAR"
                onclick="eliminar()"
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

Identificacion.propTypes = {
  buscarBenediciario: PropTypes.func.isRequired,
  identificacion: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  identificacion: state.identificacion,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { buscarBenediciario }
)(Identificacion);
