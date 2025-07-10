// src/pages/HomeScreen.tsx
import React, { useState, useEffect } from "react";
import HeaderMenu from "../components/HeaderMenu";
import ProductCard from "../components/ProductCard";
import styles from "./HomeScreen.module.css";
import { useAuth } from "../context/AuthContext";

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
}

const HomeScreen: React.FC = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const { logout } = useAuth();

  // 🔄 Carrega os produtos do backend
  useEffect(() => {
    fetch("http://localhost:3001/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Erro ao buscar produtos:", err));
  }, []);

  // 🔍 Filtra os produtos de acordo com o termo de busca
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <HeaderMenu
        search={search}
        setSearch={setSearch}
        onLogout={logout}
      />

      <div className={styles.productList}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className={styles.emptyMessage}>Nenhum produto encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;