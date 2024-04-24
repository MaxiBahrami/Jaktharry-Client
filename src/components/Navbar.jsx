import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Logo from "../img/JaktHarryLogo.png";
import adsett from "../img/adsett.png";
import admin from "../img/admin.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, NavDropdown, Container, Nav } from "react-bootstrap";
import { AuthContext } from "../context/authContext";

function CustomNavbar() {
  const { currentUser, logout } = useContext(AuthContext);

  // Check if currentUser is admin
  const isAdmin = currentUser && currentUser.role === 1;
  const isModerator = currentUser && currentUser.role === 2;

  // Define kretsarList
  const kretsarList = [
    "StockholmCentrala",
    "Hallstavik",
    "HaningeTyresö",
    "Lidingö",
    "Mälarö",
    "Norrort",
    "NorrtäljeNorra",
    "NorrtäljeSödra",
    "Nynäshamn",
    "Rimbo",
    "SolnaSundbyberg",
    "Söderort",
    "Södertälje",
    "UpplandsBro",
    "WermdöNacka",
    "VäsbySollentunaJärfälla",
    "Västerort",
    "ÖsteråkerVaxholm",
  ];

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-dark navbar-dark">
      <Container>
        <Navbar.Brand>
          <Link to="/">
            <img src={Logo} alt="" className="imgClass" />
          </Link>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto navClass">
            <NavDropdown title="NYHETER" id="collapsible-nav-dropdown">
              <NavDropdown.Item className="item">
                <Link to="/" className="nav-link itemClass">
                  alla nyheter
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Item className="item">
                <Link to="/?cat=open" className="nav-link itemClass">
                  Öppen
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Item className="item">
                <Link to="/?cat=riks" className="nav-link itemClass">
                  RIKS
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Item className="item">
                <Link to="/?cat=lans" className="nav-link itemClass">
                  LÄNS
                </Link>
              </NavDropdown.Item>
              <NavDropdown
                title="KRETSAR"
                id="kretsar-dropdown"
                className="item"
              >
                {kretsarList.map((krets, index) => (
                  <NavDropdown.Item key={index}>
                    <Link to={`/?cat=${krets}`} className="nav-link itemClass2">
                      {krets}
                    </Link>
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            </NavDropdown>
            <Link to="/?cat=aktiviteter" className="nav-link">
              AKTIVITETER
            </Link>
            {currentUser ? (
              <>
                <Link to="/profile" className="nav-link">
                  {currentUser?.username} Profil
                </Link>
                <Link className="nav-link" onClick={logout} to="/">
                  LoggaUt
                </Link>
              </>
            ) : (
              <Link className="nav-link" to="/login">
                loggaIN
              </Link>
            )}
            {currentUser &&
              (currentUser.role === 1 || currentUser.role === 2) && (
                <Link to="/write" className="nav-link write">
                  Skriva
                </Link>
              )}
          </Nav>
        </Navbar.Collapse>
      </Container>

      {isAdmin && (
        <Link to="/panel" className="linkClass">
          <img src={adsett} alt="" className="adClass" />
          <h6>Adminpanel</h6>
        </Link>
      )}
      {isModerator && (
        <Link to="/moderatorPanel" className="linkClass">
          <img src={admin} alt="" className="adClass" />
          <h6>Moderator</h6>
        </Link>
      )}


    </Navbar>
  );
}

export default CustomNavbar;
