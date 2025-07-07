import React, { useState } from "react";
import HeaderMenu from "../components/HeaderMenu";
import ProductCard from "../components/ProductCard";
import productsData from "../services/productService";
import styles from "./HomeScreen.module.css";

const HomeScreen: React.FC = () => {
  const [search, setSearch] = useState("");
  const filteredProducts = productsData.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    // lógica de logout
    alert("Logout!");
  };

  return (
    <div className={styles.container}>
      <HeaderMenu search={search} setSearch={setSearch} onLogout={handleLogout} />
      <div className={styles.productList}>
        {filteredProducts.map(product => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;