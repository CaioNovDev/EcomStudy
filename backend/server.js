const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const captchaRouter = require('./routes/captcha');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');


const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'changeme-in-env',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/captcha', captchaRouter); // Agora responde corretamente em /api/captcha
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);


// Middleware global de erro
app.use((err, req, res, next) => {
  console.error('[UNEXPECTED ERROR]', err);
  res.status(500).json({ error: 'Erro inesperado no servidor.' });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});