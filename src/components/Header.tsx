import React from "react";
import { Link } from 'react-router-dom';

function Header() {
  return (
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/remote1">Remote App</Link>
      </li>
      <li>
        <Link to="/remote1/2">User 2</Link>
      </li>
      <li>
        <Link to="/remote1/3">User 3</Link>
      </li>
    </ul>
  );
}

export default Header;
