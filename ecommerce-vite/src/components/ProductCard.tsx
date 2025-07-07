import React from "react";
import styles from "./ProductCard.module.css";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
  <div className={styles.card}>
    <img src={product.image} alt={product.name} className={styles.image} />
    <div className={styles.info}>
      <span className={styles.name}>{product.name}</span>
      <span className={styles.price}>R$ {product.price.toFixed(2)}</span>
    </div>
  </div>
);

export default ProductCard;