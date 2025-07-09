// server.js

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');

// Rotas modularizadas
const authRoutes = require('./routes/auth');          // Login/Registro
const captchaRouter = require('./routes/captcha');    // Captcha SVG
const productRoutes = require('./routes/products');   // CRUD de produtos
const userRoutes = require('./routes/users');         // CRUD de usuários

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de CORS: permite frontend acessar backend via cookies
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// Middleware para interpretar JSON
app.use(express.json());

// Middleware de sessão (armazenamento temporário, ex: captcha)
app.use(session({
  secret: process.env.SESSION_SECRET || 'changeme-in-env',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use HTTPS em prod
    httpOnly: true,
    sameSite: 'lax',
  }
}));

// Conecta rotas principais
app.use('/api/auth', authRoutes);
app.use('/api/captcha', captchaRouter);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error('[UNEXPECTED ERROR]', err);
  res.status(500).json({ error: 'Erro inesperado no servidor.' });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});