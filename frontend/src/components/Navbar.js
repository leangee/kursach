import React from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaCar, FaToolbox, FaImages, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaClipboardList, FaTachometerAlt } from 'react-icons/fa';

const AppNavbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <FaCar className="me-2" />
          Detailing126
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/services">
              <FaToolbox className="me-1" /> Услуги
            </Nav.Link>
            <Nav.Link as={Link} to="/portfolio">
              <FaImages className="me-1" /> Портфолио
            </Nav.Link>
            {isAuthenticated && (
              <Nav.Link as={Link} to="/orders">
                <FaClipboardList className="me-1" /> Мои заказы
              </Nav.Link>
            )}
            {user?.role === 'admin' && (
              <Nav.Link as={Link} to="/admin">
                <FaTachometerAlt className="me-1" /> Админ-панель
              </Nav.Link>
            )}
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-light" as="button" className="btn-outline-light d-flex align-items-center">
                  <FaUser className="me-2" />
                  {user?.username}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile">
                    <FaUser className="me-2" /> Профиль
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    <FaSignOutAlt className="me-2" /> Выйти
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Button as={Link} to="/login" variant="outline-light" size="sm" className="me-2">
                  <FaSignInAlt className="me-1" /> Вход
                </Button>
                <Button as={Link} to="/register" variant="primary" size="sm">
                  <FaUserPlus className="me-1" /> Регистрация
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;