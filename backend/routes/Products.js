// backend/routes/products.js
const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// Criar produto
router.post('/', async (req, res) => {
  const { name, price, image } = req.body;
  if (!name || price == null) {
    return res.status(400).json({ error: 'Nome e preço são obrigatórios' });
  }
  try {
    const product = await prisma.product.create({
      data: { name, price: parseFloat(price), image },
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

// Listar produtos
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'desc' }
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

module.exports = router;
