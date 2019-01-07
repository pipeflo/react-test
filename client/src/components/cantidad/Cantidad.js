import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import { iniciarCompra } from "../../actions/cantidadActions";
import { reiniciarCompra } from "../../actions/identificacionActions";

class Cantidad extends Component {
  constructor() {
    super();
    this.state = {
      numero: "",
      tipoIdentificacion: "",
      beneficiarios: [],
      beneficiario: {},
      cantidad: "",
      compra: {},
      errors: {}
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (
      !this.props.identificacion.beneficiarios ||
      this.props.identificacion.beneficiarios.length === 0
    ) {
      this.props.history.push("/identificacion");
    }
    this.setState({
      numero: this.props.identificacion.numero,
      tipoIdentificacion: this.props.identificacion.tipoIdentificacion,
      beneficiarios: this.props.identificacion.beneficiarios,
      beneficiario: this.props.identificacion.beneficiarios[1]
    });
    console.log("si entró con props", this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.compra.inicioCompra) {
      console.log("Populo compra");
      this.props.history.push("/compra");
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

  render() {
    const { errors } = this.state;
    const beneficiario = this.state.beneficiario;

    return (
      <div className="text-center fondoIdentificacion">
        <div className="otro">
          <div className="tdocumento">
            <p>
              Hola {beneficiario.nombre}, Por Favor Ingrese el número de Vales a
              comprar
            </p>
          </div>

          <div className="inputIdentificacion">
            <input
              type="text"
              className={classnames("form-control identificacion", {
                "is-invalid": errors.cantidad
              })}
              placeholder="Cantidad de Vales"
              name="cantidad"
              value={this.state.cantidad}
              onChange={this.onChange}
              onKeyPress={this.onKeyPress}
            />
            {errors.cantidad && (
              <div className="invalid-feedback">{errors.cantidad}</div>
            )}
          </div>

          <div className="row keyboard">
            <div className="row">
              <div className="col">
                <input
                  type="button"
                  className="btn btn-primary float-right numero"
                  value="1"
                  onClick={this.onClick}
                />
              </div>
              <div className="col">
                <input
                  type="button"
                  className="btn btn-primary numero"
                  value="2"
                  onClick={this.onClick}
                />
              </div>
              <div className="col">
                <input
                  type="button"
                  className="btn btn-primary float-left numero"
                  value="3"
                  onClick={this.onClick}
                />
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col">
                <input
                  type="button"
                  className="btn btn-primary float-right numero"
                  value="4"
                  onClick={this.onClick}
                />
              </div>
              <div className="col">
                <input
                  type="button"
                  className="btn btn-primary numero"
                  value="5"
                  onClick={this.onClick}
                />
              </div>
              <div className="col">
                <input
                  type="button"
                  className="btn btn-primary float-left numero"
                  value="6"
                  onClick={this.onClick}
                />
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col">
                <input
                  type="button"
                  className="btn btn-primary float-right numero"
                  value="7"
                  onClick={this.onClick}
                />
              </div>
              <div className="col">
                <input
                  type="button"
                  className="btn btn-primary numero"
                  value="8"
                  onClick={this.onClick}
                />
              </div>
              <div className="col">
                <input
                  type="button"
                  className="btn btn-primary float-left numero"
                  value="9"
                  onClick={this.onClick}
                />
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col" />
              <div className="col">
                <input
                  type="button"
                  className="btn btn-primary numero"
                  value="0"
                  onClick={this.onClick}
                />
              </div>
              <div className="col" />
            </div>
          </div>

          <div className="form-group keyboard_2">
            <input
              className="btn btn-primary aceptar"
              type="button"
              value="ACEPTAR"
              onClick={this.onClick}
            />
            <br />
            <input
              className="btn btn-primary eliminar"
              type="button"
              value="BORRAR"
              onClick={this.onClick}
            />
          </div>
        </div>
      </div>
    );
  }
}

Cantidad.propTypes = {
  iniciarCompra: PropTypes.func.isRequired,
  reiniciarCompra: PropTypes.func.isRequired,
  identificacion: PropTypes.object.isRequired,
  compra: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  identificacion: state.identificacion,
  compra: state.compra,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { iniciarCompra, reiniciarCompra }
)(Cantidad);
