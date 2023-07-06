import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import { useStateStore } from 'login_mfe/store';
import styles from '../styles/home.module.css';

function Home() {
  const [count, setCount] = useStateStore('CART', 0);
  return (
    <>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/login">Remote App 1</Link>
      </li>
      <li>
        <Link to="/login/1">Remote App 1.1</Link>
      </li>
        {/* <li>
          <Link to="/remote1/2">User 2</Link>
        </li>
        <li>
          <Link to="/remote1/3">User 3</Link>
        </li>
        <li>
          <Link to="/remote2">Remote App 2</Link>
        </li>
        <li>
          <Link to="/remote3">Remote App 3</Link>
        </li> */}
    </ul>
      <h1 className={styles.headingText}>My App</h1>
      <button onClick={() => setCount((v:any) => v + 1)}>Cart ({count})</button>
    </>
  );
}

export default Home;
