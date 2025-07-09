const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const prisma = require('../prismaClient');

// Segredo forte para estudos
const SECRET = 'u7$!kPz9@1bX#4qLw2eR8sV0zF3cT6hJ';

router.post('/login', async (req, res) => {
  const { username, password, captcha } = req.body;

  // Valida captcha
  if (!captcha || captcha.toLowerCase() !== req.session.captcha?.toLowerCase()) {
    return res.status(400).json({ error: 'Captcha incorreto' });
  }

  // Limpa o captcha da sessão
  req.session.captcha = null;

  try {
    // Busca o usuário no banco
    const user = await prisma.user.findUnique({ where: { email: username } });
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

    // Compara a senha
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Credenciais inválidas' });

    // Gera o token JWT
    const token = jwt.sign({ username: user.email }, SECRET, { expiresIn: '1h' });
    return res.json({ token });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

module.exports = router;
