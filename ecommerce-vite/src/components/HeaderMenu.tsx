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
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleAvatarClick = () => {
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
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
          style={{ cursor: "pointer" }}
          onClick={handleAvatarClick}
          title={isAuthenticated ? "Ir para o perfil" : "Fazer login"}
        />

        {isAuthenticated ? (
          <>
            <span className={styles.userName}>
              {user?.name || user?.email}
            </span>
            <button className={styles.logout} onClick={handleLogout}>
              Sair
            </button>
          </>
        ) : (
          <button
            className={styles.login}
            onClick={() => navigate("/login")}
          >
            Entrar
          </button>
        )}
      </div>
    </header>
  );
};

export default HeaderMenu;