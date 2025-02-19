import React from "react";
import ProductList from "./ProductList";

function App() {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Product Listing</h1>
      <ProductList />
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Avenir-Book",
    margin: "0 auto",
    maxWidth: 1200,
    padding: "1rem",
    fontSize: 45
  },
  header: {
    fontSize: 45,
    textAlign: "center",
  }
};

export default App;
