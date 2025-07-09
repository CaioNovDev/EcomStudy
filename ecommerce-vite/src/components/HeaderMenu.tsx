// src/components/HeaderMenu.tsx
import React from "react";
import styles from "./HeaderMenu.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Ajuste o caminho se necessário

interface HeaderMenuProps {
  search: string;
  setSearch: (value: string) => void;
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({ search, setSearch }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <img
        src="https://http2.mlstatic.com/frontend-assets/ml-web-navigation/ui-navigation/6.6.7/mercadolivre/logo__large_plus.png"
        alt="Logo"
        className={styles.logo}
      />
      <input
        type="text"
        placeholder="Buscar produtos..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className={styles.search}
      />
      <div className={styles.right}>
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Avatar"
          className={styles.avatar}
        />
        <button className={styles.logout} onClick={handleLogout}>
          Sair
        </button>
      </div>
    </header>
  );
};

export default HeaderMenu;