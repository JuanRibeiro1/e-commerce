const express = require('express');
const db = require('../config/db');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// Obter perfil do usuário
router.get('/', authenticateToken, (req, res) => {
  db.get('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
  });
});

// Atualizar perfil
router.put('/', authenticateToken, (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Nome é obrigatório' });

  db.run('UPDATE users SET name = ? WHERE id = ?', [name, req.user.id], function(err) {
    if (err) return res.status(500).json({ error: 'Erro ao atualizar perfil' });
    res.json({ message: 'Perfil atualizado com sucesso' });
  });
});

module.exports = router;