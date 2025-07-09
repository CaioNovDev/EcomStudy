const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middlewares/authMiddleware');

const prisma = new PrismaClient();

// 🔒 Perfil do usuário autenticado (DEVE vir antes de '/:id')
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true }
    });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
  } catch (err) {
    console.error('[ERRO AO BUSCAR USUÁRIO LOGADO]', err);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
});

// 🔍 Listar todos os usuários
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true }
    });
    res.json(users);
  } catch (err) {
    console.error('[ERRO AO LISTAR USUÁRIOS]', err);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// 👤 Buscar usuário por ID
router.get('/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true }
    });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
  } catch (err) {
    console.error('[ERRO AO BUSCAR USUÁRIO POR ID]', err);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

// 🗑️ Deletar usuário
router.delete('/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) return res.status(400).json({ error: 'ID inválido' });

  try {
    await prisma.user.delete({ where: { id: userId } });
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (err) {
    console.error('[ERRO AO DELETAR USUÁRIO]', err);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
});

module.exports = router;