import React from 'react';
import styles from './Navbar.module.scss';
import { NavLink } from 'react-router';  // Corrected import for react-router-dom

const Navbar = () => {
  return (
    <nav className={styles.hi}>
      <ul>
        <li>
          <NavLink
            to="/"
            style={({ isActive }) => ({
              color: isActive ? "black" : "white", // Change color based on active state
              fontWeight: isActive ? "bold" : "normal",
              textDecoration: "none",
              backgroundColor: isActive? "white": "",
              padding: "0.4rem",
              borderRadius: "50%",
            })}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/projects"
            style={({ isActive }) => ({
              color: isActive ? "black" : "white", // Change color based on active state
              fontWeight: isActive ? "bold" : "normal",
              textDecoration: "none",
              backgroundColor: isActive? "white": "",
              padding: "0.4rem",
              borderRadius: "50%",
            })}
          >
            Projects
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
