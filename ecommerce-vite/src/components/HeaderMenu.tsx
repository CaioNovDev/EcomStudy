// src/components/HeaderMenu.tsx
import React from "react";
import styles from "./HeaderMenu.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface HeaderMenuProps {
  search: string;
  setSearch: (value: string) => void;
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({ search, setSearch }) => {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();

  const isAuthenticated = !!user;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleAvatarClick = () => {
    if (isLoading) return; // evita navegação antes de confirmar autenticação
    navigate(isAuthenticated ? "/profile" : "/login");
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
          src={
            isAuthenticated && user?.avatar
              ? user.avatar
              : "https://randomuser.me/api/portraits/men/32.jpg"
          }
          alt="Avatar"
          className={styles.avatar}
          style={{ cursor: "pointer", opacity: isLoading ? 0.5 : 1 }}
          onClick={handleAvatarClick}
          title={
            isLoading
              ? "Verificando sessão..."
              : isAuthenticated
              ? "Ir para o perfil"
              : "Fazer login"
          }
        />

        {isAuthenticated ? (
          <>
            <span className={styles.userName}>
              {user?.name || user.email}
            </span>
            <button className={styles.logout} onClick={handleLogout}>
              Sair
            </button>
          </>
        ) : (
          !isLoading && (
            <button className={styles.login} onClick={() => navigate("/login")}>
              Entrar
            </button>
          )
        )}
      </div>
    </header>
  );
};

export default HeaderMenu;
