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
      beneficiario: {},
      compra: {},
      cantidad: 0,
      valorTotal: 0,
      errors: {}
    };
  }

  componentDidMount() {
    console.log(this.props.compra.valorVale);
    if (this.props.compra.valorVale === 0) {
      this.props.history.push("/identificacion");
    }
    this.setState({
      beneficiario: this.props.beneficiario,
      compra: this.props.compra
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

    if (nextProps.beneficiario.contratos.length === 0) {
      this.props.history.push("/");
    }
  }

  onKeyPress = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onClick = e => {
    e.preventDefault();
    if (e.target.value === "BORRAR") {
      this.setState({ cantidad: 0 });
    } else if (e.target.value === "ACEPTAR") {
      console.log("Iniciar compra para ", this.state.compra.cantidad, "vales");
      const compraData = {
        cantidad: this.state.cantidad,
        valorVale: this.state.compra.valorVale,
        valorTotal:
          parseInt(this.state.cantidad) * parseInt(this.state.compra.valorVale)
      };

      this.props.iniciarCompra(compraData);
    } else if (e.target.value === "SALIR") {
      this.props.reiniciarCompra({});
    } else {
      if (this.state.cantidad === 0) {
        this.setState({
          cantidad: e.target.value
        });
      } else {
        this.setState({
          cantidad: this.state.cantidad + e.target.value
        });
      }
    }
  };

  render() {
    const { errors } = this.state;
    const { beneficiario } = this.state;
    const compra = this.props.compra;
    const cantidad = this.state.cantidad;
    const styleNumber = {
      width: "75px",
      height: "75px",
      marginBottom: "20px",
      marginRight: "20px",
      fontSize: "45px"
    };

    return (
      <div>
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
        <hr id="hr_1" color="white" size="2" width="600" />
        <p id="vale">Valor del vale: ${compra.valorVale}</p>
        <p id="cantidad">Cantidad: {cantidad}</p>
        <hr id="hr_2" color="white" size="2" width="600" />
        <p id="total">
          TOTAL: ${parseInt(cantidad) * parseInt(compra.valorVale)}
        </p>
        <p id="tcompra">Indique el número de vales a comprar</p>
        <img id="imarkCantidad" src="../../img/input_mark.png" alt="" />
        <input
          type="text"
          className={classnames("form-control", {
            "is-invalid": errors.cantidad
          })}
          id="usrCantidad"
          placeholder="Cantidad de Vales"
          name="cantidad"
          value={this.state.cantidad}
          onChange={this.onChange}
          onKeyPress={this.onKeyPress}
        />
        {errors.cantidad && (
          <div className="invalid-feedback">{errors.cantidad}</div>
        )}
        <div id="keyboardCantidad" className="form-group">
          <input
            style={styleNumber}
            type="button"
            className="btn btn-primary"
            value="1"
            onClick={this.onClick}
          />
          <input
            style={styleNumber}
            type="button"
            className="btn btn-primary"
            value="2"
            onClick={this.onClick}
          />
          <input
            style={styleNumber}
            type="button"
            className="btn btn-primary"
            value="3"
            onClick={this.onClick}
          />
          <br />
          <input
            style={styleNumber}
            type="button"
            className="btn btn-primary"
            value="4"
            onClick={this.onClick}
          />
          <input
            style={styleNumber}
            type="button"
            className="btn btn-primary"
            value="5"
            onClick={this.onClick}
          />
          <input
            style={styleNumber}
            type="button"
            className="btn btn-primary"
            value="6"
            onClick={this.onClick}
          />
          <br />
          <input
            style={styleNumber}
            type="button"
            className="btn btn-primary"
            value="7"
            onClick={this.onClick}
          />
          <input
            style={styleNumber}
            type="button"
            className="btn btn-primary"
            value="8"
            onClick={this.onClick}
          />
          <input
            style={styleNumber}
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
          />
          <input
            style={{
              width: "75px",
              height: "75px",
              marginBottom: "3px",
              marginRight: "20px",
              fontSize: "45px"
            }}
            type="button"
            className="btn btn-primary"
            value="0"
            onClick={this.onClick}
          />
          <button
            id="invisible"
            style={{ width: "75px", height: "75px", marginBottom: "3px" }}
            type="button"
            className="btn btn-primary"
          />
        </div>
        <div className="form-group" id="keyboard_2">
          <input
            style={{ width: "312px", height: "75px", fontSize: "40px" }}
            type="button"
            className="btn btn-primary"
            value="ACEPTAR"
            onClick={this.onClick}
          />
          <input
            style={{ width: "312px", height: "75px", fontSize: "40px" }}
            type="button"
            className="btn btn-primary"
            value="BORRAR"
            onClick={this.onClick}
          />
        </div>
        <div className="form-group" id="keyboard_2Cantidad">
          <input
            style={{ width: "312px", height: "75px", fontSize: "40px" }}
            type="button"
            className="btn btn-primary"
            value="SALIR"
            onClick={this.onClick}
          />
        </div>
      </div>
    );
  }
}

Cantidad.propTypes = {
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
)(Cantidad);
