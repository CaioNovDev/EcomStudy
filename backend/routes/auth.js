const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Segredo forte para estudos 
const SECRET = 'u7$!kPz9@1bX#4qLw2eR8sV0zF3cT6hJ';

router.post('/login', (req, res) => {
  const { username, password, captcha } = req.body;

  // Valida captcha comparando com o que está salvo na sessão
  if (!captcha || captcha.toLowerCase() !== req.session.captcha?.toLowerCase()) {
    return res.status(400).json({ error: 'Captcha incorreto' });
  }

  // Limpa o captcha da sessão para evitar reutilização
  req.session.captcha = null;

  // Validação simples do usuário e senha
  if (username === 'admin@admin.com' && password === '1234') {
    const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }

  res.status(401).json({ error: 'Credenciais inválidas' });
});

module.exports = router;
