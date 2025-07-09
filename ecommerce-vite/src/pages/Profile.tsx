// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";

interface User {
  id: number;
  email: string;
  // outros campos opcionais
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/api/users/me", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) {
          // Usuário não autenticado, redireciona para login
          navigate("/login");
          return null;
        }
        if (!res.ok) {
          throw new Error("Erro ao buscar perfil");
        }
        return res.json();
      })
      .then((data) => {
        if (data) setUser(data);
      })
      .catch((err) => {
        console.error("Erro ao carregar perfil:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [navigate]);

  if (isLoading) {
    return <p>Carregando perfil...</p>;
  }

  if (!user) {
    return <p>Você precisa estar autenticado para ver esta página.</p>;
  }

  return (
    <div className={styles.profile}>
      <h1>Perfil do Usuário</h1>
      <div className={styles.info}>
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
    </div>
  );
};

export default Profile;