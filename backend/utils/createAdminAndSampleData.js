const bcrypt = require('bcrypt');

module.exports = function createAdminAndSampleData(db) {
  const adminEmail = 'admin@gamestore.com';
  const adminPassword = bcrypt.hashSync('admin123', 10);
  
  db.get('SELECT * FROM users WHERE email = ?', [adminEmail], (err, row) => {
    if (!row) {
      db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Administrador', adminEmail, adminPassword, 'admin']);
    }
  });

  db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
    if (row.count === 0) {
      const sampleProducts = [
        ['PlayStation 5', 'Console PlayStation 5 com controle DualSense', 4999.99, '', 10, 'Console'],
        ['Xbox Series X', 'Console Xbox Series X com 1TB de armazenamento', 4699.99, '', 8, 'Console'],
        ['Nintendo Switch', 'Console portátil Nintendo Switch', 2999.99, '', 15, 'Console'],
        ['The Last of Us Part II', 'Jogo exclusivo PlayStation 4/5', 199.99, '', 25, 'Jogo'],
        ['God of War Ragnarök', 'Aventura épica de Kratos e Atreus', 249.99, '', 20, 'Jogo'],
        ['Super Mario Odyssey', 'Aventura do Mario para Nintendo Switch', 299.99, '', 18, 'Jogo']
      ];

      sampleProducts.forEach(product => {
        db.run('INSERT INTO products (name, description, price, image_url, stock, category) VALUES (?, ?, ?, ?, ?, ?)', product);
      });
    }
  });
};