const express = require('express');
const bcrypt = require('bcrypt');
const prisma = require('../prismaClient');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    res.status(201).json({ message: 'Usuário criado com sucesso', user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

module.exports = router;
