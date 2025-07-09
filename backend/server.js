const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

// 📦 Rotas da aplicação
const authRoutes = require('./routes/auth');         // Login + Registro
const captchaRouter = require('./routes/captcha');   // Geração de captcha SVG
const productRoutes = require('./routes/products');  // CRUD de produtos
const userRoutes = require('./routes/users');        // Listar, buscar, deletar usuários

const app = express();
const PORT = process.env.PORT || 3001;

// 🔐 CORS: permite frontend se comunicar com backend com cookies
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// 🔄 Transforma JSON no corpo das requisições em objetos JS
app.use(express.json());

// 🧠 Sessão (usada para armazenar captcha)
app.use(session({
  secret: process.env.SESSION_SECRET || 'changeme-in-env',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  }
}));

// 🔁 Conecta as rotas
app.use('/api/auth', authRoutes);        // POST /login e /register
app.use('/api/captcha', captchaRouter);  // GET /api/captcha → retorna imagem SVG
app.use('/api/products', productRoutes); // GET e POST de produtos
app.use('/api/users', userRoutes);       // GET, GET/:id e DELETE usuários

// ⚠️ Middleware global de erro
app.use((err, req, res, next) => {
  console.error('[UNEXPECTED ERROR]', err);
  res.status(500).json({ error: 'Erro inesperado no servidor.' });
});

// 🚀 Liga o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
