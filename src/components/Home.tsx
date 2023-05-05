import React from "react";
import { useStateStore } from 'remote1/store';
import styles from '../styles/home.module.css';

function Home() {
  const [count, setCount] = useStateStore('CART', 0);

  return (
    <>
      <h1 className={styles.headingText}>My App</h1>
      <button onClick={() => setCount(v => v + 1)}>Cart ({count})</button>
    </>
  );
}

export default Home;
