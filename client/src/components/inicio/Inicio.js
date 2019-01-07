import React, { Component } from "react";
import { Link } from "react-router-dom";

class Inicio extends Component {
  render() {
    return (
      <Link to="/identificacion">
        <div className="principal">
          <p className="texto_inicio">
            {" "}
            Toque para <br /> INICIAR
          </p>
        </div>
      </Link>
    );
  }
}

export default Inicio;
