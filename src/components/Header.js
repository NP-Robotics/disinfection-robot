import React from "react";

import "./Header.css";
import ngeeAnnLogo from "../assets/NgeeAnn.jfif";

const Header = () => {
  return (
    <div>
      <section>
        <image src={ngeeAnnLogo} alt="Ngee Ann Logo" />
      </section>
      <section>MENU</section>
    </div>
  );
};

export default Header;
