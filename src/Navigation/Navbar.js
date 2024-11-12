// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">AES Generator</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;