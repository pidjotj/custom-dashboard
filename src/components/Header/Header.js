import React, { Component } from "react";
import photo from '../../assets/images/me.jpeg'
import logo from '../../assets/images/home.svg'
import './style/index.css'

class Header extends Component {
  render() {
    return (
      <div>
      <div className="header-div">
        <div>
          <img className="logo" src={logo} alt="logo"/>
          <span className="header-title">My Dashboard</span>
        </div>
        <div>
          <a target="_blank" href={'https://github.com/pidjotj/custom-dashboard'}>
            <span className="made-by">made by Jérémy PIDJOT</span>
            <img className="photo" src={photo} alt="me"/>
          </a>
        </div>
      </div>
        <div className="divider">
          <span/>
        </div>
      </div>
    );
  }
}

export default Header;
