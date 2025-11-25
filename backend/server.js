const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const ordersRoutes = require("./routes/ordersRoutes"); // OK
const supplierRoutes = require('./routes/supplierRoutes');
const adminDashboardRoutes = require('./routes/adminDashboardRoutes');
const reportRoutes = require("./routes/reportRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/dashboard', adminDashboardRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/reports", reportRoutes);
app.get('/', (req, res) => res.json({ status: 'ok' }));
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // manter até criar banco
    console.log('Banco sincronizado');

    app.listen(PORT, () =>
      console.log(`Server rodando em http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('Erro ao iniciar:', err);
  }
})();