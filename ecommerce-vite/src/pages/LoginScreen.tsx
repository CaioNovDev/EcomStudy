import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaSvg, setCaptchaSvg] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  // Função para carregar o captcha SVG
  const loadCaptcha = () => {
    fetch('http://localhost:3001/api/captcha', { credentials: 'include' }) // 'include' para enviar cookies/sessão
      .then(res => res.text())
      .then(svg => setCaptchaSvg(svg))
      .catch(() => setErro('Erro ao carregar captcha'));
  };

  // Carrega captcha na montagem do componente
  useEffect(() => {
    loadCaptcha();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !senha || !captchaInput) {
      setErro('Preencha email, senha e captcha!');
      return;
    }

    // Passa o captchaInput para o login
    const ok = await login(email, senha, captchaInput);

    if (ok === 'captcha') {
      setErro('Captcha incorreto. Tente novamente.');
      setCaptchaInput('');
      loadCaptcha(); // recarrega o captcha
    } else if (ok) {
      setErro('');
      navigate('/home');
    } else {
      setErro('Email ou senha inválidos');
      setCaptchaInput('');
      loadCaptcha(); // recarrega o captcha para nova tentativa
    }
  };

  return (
    <div style={styles.bg}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <img
          src="https://ichef.bbci.co.uk/ace/ws/512/amz/worldservice/live/assets/images/2013/06/06/130606105632_hula_frog_512x288_sarifgafny.jpg.webp"
          alt="Mercado Livre"
          style={styles.logo}
        />
        <input
          style={styles.input}
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
        />

        {/* Mostrar o captcha SVG */}
        <div
          style={{ marginBottom: 12, cursor: 'pointer' }}
          onClick={loadCaptcha}
          dangerouslySetInnerHTML={{ __html: captchaSvg }}
          title="Clique para recarregar captcha"
        />

        {/* Input do captcha */}
        <input
          style={styles.input}
          type="text"
          placeholder="Digite o texto do captcha"
          value={captchaInput}
          onChange={e => setCaptchaInput(e.target.value)}
        />

        {erro && <div style={styles.error}>{erro}</div>}

        <button type="submit" style={styles.button}>
          Entrar
        </button>
      </form>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  // seu estilo permanece igual
  bg: {
    minHeight: '100vh',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
    padding: '40px 32px 32px 32px',
    minWidth: 330,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 18,
  },
  logo: {
    width: 170,
    marginBottom: 10,
    marginTop: -12,
  },
  input: {
    width: '100%',
    border: '1px solid #ddd',
    borderRadius: 8,
    padding: '12px 14px',
    fontSize: 16,
    outline: 'none',
    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
    background: '#f5f5f5',
    marginBottom: 4,
  },
  button: {
    width: '100%',
    background: '#ffe600',
    color: '#333',
    fontWeight: 700,
    fontSize: 16,
    border: 'none',
    borderRadius: 7,
    padding: '14px 0',
    marginTop: 8,
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.07)',
    transition: '.2s',
  },
  error: {
    color: '#b71c1c',
    background: '#fff8f8',
    fontSize: 13,
    padding: '6px 0 0 0',
    width: '100%',
    textAlign: 'left',
  },
};

export default LoginScreen;
