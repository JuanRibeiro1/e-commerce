const express = require('express');
const db = require('../config/db');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');
const upload = require('../config/multer');

const router = express.Router();

// Listar produtos (público)
router.get('/', (req, res) => {
  db.all('SELECT * FROM products WHERE stock > 0', (err, products) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar produtos' });
    res.json(products);
  });
});

// Buscar produto por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar produto' });
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(product);
  });
});

// Criar produto (admin)
router.post('/', authenticateToken, requireAdmin, upload.single('image'), (req, res) => {
  const { name, description, price, stock, category } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : '';

  if (!name || !price) return res.status(400).json({ error: 'Nome e preço são obrigatórios' });

  db.run('INSERT INTO products (name, description, price, image_url, stock, category) VALUES (?, ?, ?, ?, ?, ?)',
    [name, description, parseFloat(price), image_url, parseInt(stock) || 0, category], function(err) {
      if (err) return res.status(500).json({ error: 'Erro ao criar produto' });
      res.status(201).json({ id: this.lastID, message: 'Produto criado com sucesso' });
    });
});

// Atualizar produto (admin)
router.put('/:id', authenticateToken, requireAdmin, upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, category } = req.body;

  db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
    if (err || !product) return res.status(404).json({ error: 'Produto não encontrado' });

    const image_url = req.file ? `/uploads/${req.file.filename}` : product.image_url;

    db.run('UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, stock = ?, category = ? WHERE id = ?',
      [name, description, parseFloat(price), image_url, parseInt(stock), category, id], (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao atualizar produto' });
        res.json({ message: 'Produto atualizado com sucesso' });
      });
  });
});

// Deletar produto (admin)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: 'Erro ao deletar produto' });
    if (this.changes === 0) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json({ message: 'Produto deletado com sucesso' });
  });
});

module.exports = router;