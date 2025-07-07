const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const captchaRouter = require('./routes/captcha');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',  // seu frontend
  credentials: true,                // importante para sessão/cookies
}));

app.use(session({
  secret: 'xfy38A2f@fklkjasdfruio3@38#',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(bodyParser.json());

app.use('/api', captchaRouter);
app.use('/api', authRoutes);

app.listen(3001, () => console.log('Servidor rodando na porta 3001'));
