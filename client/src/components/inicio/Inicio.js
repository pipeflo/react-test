import React, { Component } from "react";
import { Link } from "react-router-dom";

class Inicio extends Component {
  render() {
    return (
      <Link to="/identificacion">
        <div className="principal">
          <img
            id="fondo_principal"
            src="../../img/colsanitas_soft-pag_1.jpg"
            width="748"
            height="1366"
            alt=""
          />
          <p id="texto_1"> Toque para</p>
          <p id="texto_2">INICIAR</p>
        </div>
      </Link>
    );
  }
}

export default Inicio;
