const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const SECRET = 'u7$!kPz9@1bX#4qLw2eR8sV0zF3cT6hJ';

// Registro de novo usuário
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser)
      return res.status(409).json({ error: 'E-mail já está em uso' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword }
    });

    res.status(201).json({ message: 'Usuário criado com sucesso', userId: newUser.id });
  } catch (error) {
    console.error('[ERRO AO CRIAR USUÁRIO]', error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// Login do usuário
router.post('/login', async (req, res) => {
  const { email, password, captcha } = req.body;

  // Verificações básicas
  if (!email || !password || !captcha)
    return res.status(400).json({ error: 'Email, senha e captcha são obrigatórios' });

  if (captcha !== req.session.captcha)
    return res.status(400).json({ error: 'Captcha inválido' });

  req.session.captcha = null; // limpa captcha da sessão

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user)
      return res.status(401).json({ error: 'Usuário não encontrado' });

    const senhaCorreta = await bcrypt.compare(password, user.password);

    if (!senhaCorreta)
      return res.status(401).json({ error: 'Senha incorreta' });

    // Geração do token JWT
    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' });

    // Retorna apenas os dados essenciais
    res.json({
      message: 'Login bem-sucedido',
      token,
      user: { id: user.id, email: user.email }
    });
  } catch (err) {
    console.error('[ERRO NO LOGIN]', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

module.exports = router;