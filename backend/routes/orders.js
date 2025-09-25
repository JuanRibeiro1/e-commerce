const express = require('express');
const db = require('../config/db');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// Criar pedido
router.post('/', authenticateToken, (req, res) => {
  const { items } = req.body; // Array de { product_id, quantity }
  if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Itens do pedido são obrigatórios' });

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    let total = 0;
    let processedItems = 0;
    let orderItems = [];

    items.forEach((item, index) => {
      db.get('SELECT * FROM products WHERE id = ?', [item.product_id], (err, product) => {
        if (err || !product) {
          db.run('ROLLBACK');
          return res.status(404).json({ error: `Produto ${item.product_id} não encontrado` });
        }
        if (product.stock < item.quantity) {
          db.run('ROLLBACK');
          return res.status(400).json({ error: `Estoque insuficiente para ${product.name}` });
        }

        const itemTotal = product.price * item.quantity;
        total += itemTotal;
        orderItems.push({ product_id: item.product_id, quantity: item.quantity, price: product.price });

        processedItems++;
        if (processedItems === items.length) {
          db.run('INSERT INTO orders (user_id, total) VALUES (?, ?)', [req.user.id, total], function(err) {
            if (err) {
              db.run('ROLLBACK');
              return res.status(500).json({ error: 'Erro ao criar pedido' });
            }

            const orderId = this.lastID;
            let itemsProcessed = 0;

            orderItems.forEach(orderItem => {
              db.run('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, orderItem.product_id, orderItem.quantity, orderItem.price], (err) => {
                  if (err) {
                    db.run('ROLLBACK');
                    return res.status(500).json({ error: 'Erro ao adicionar item ao pedido' });
                  }

                  db.run('UPDATE products SET stock = stock - ? WHERE id = ?', [orderItem.quantity, orderItem.product_id], (err) => {
                    if (err) {
                      db.run('ROLLBACK');
                      return res.status(500).json({ error: 'Erro ao atualizar estoque' });
                    }

                    itemsProcessed++;
                    if (itemsProcessed === orderItems.length) {
                      db.run('COMMIT');
                      res.status(201).json({ id: orderId, message: 'Pedido criado com sucesso', total });
                    }
                  });
                });
            });
          });
        }
      });
    });
  });
});

// Listar pedidos
router.get('/', authenticateToken, (req, res) => {
  const query = req.user.role === 'admin' 
    ? `SELECT o.*, u.name as user_name, u.email as user_email FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC`
    : `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`;
  const params = req.user.role === 'admin' ? [] : [req.user.id];

  db.all(query, params, (err, orders) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar pedidos' });
    if (orders.length === 0) return res.json([]);

    let processedOrders = 0;
    const ordersWithItems = [];

    orders.forEach((order, index) => {
      db.all(`SELECT oi.*, p.name as product_name, p.image_url FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?`,
        [order.id], (err, items) => {
          ordersWithItems[index] = { ...order, items: items || [] };
          processedOrders++;
          if (processedOrders === orders.length) res.json(ordersWithItems);
        });
    });
  });
});

// Buscar pedido específico
router.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const query = req.user.role === 'admin'
    ? `SELECT o.*, u.name as user_name, u.email as user_email FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ?`
    : `SELECT * FROM orders WHERE id = ? AND user_id = ?`;
  const params = req.user.role === 'admin' ? [id] : [id, req.user.id];

  db.get(query, params, (err, order) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar pedido' });
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });

    db.all(`SELECT oi.*, p.name as product_name, p.image_url FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?`, [order.id],
      (err, items) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar itens do pedido' });
        res.json({ ...order, items });
      });
  });
});

module.exports = router;