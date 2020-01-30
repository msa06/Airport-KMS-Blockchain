import React, { Component } from "react";
import Identicon from "identicon.js";

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-2 shadow">
        <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#">
          Airport System
        </a>
        <li className="nav-item text-nowrap d-none d-sm-none d-sm-block px-3">
          <span id="account" className="text-white h5">
            {this.props.accounts[this.props.account]}
          </span>

          {this.props.account ? (
            <img
              className="ml-2"
              width="30"
              height="30"
              src={`data:image/png;base64, ${new Identicon(
                this.props.account,
                30
              ).toString()}`}
            />
          ) : (
            <span></span>
          )}
        </li>
      </nav>
    );
  }
}
export default Navbar;
