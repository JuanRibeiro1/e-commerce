const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const UserModel = require('./user');
const ProductModel = require('./product');
const CartItemModel = require('./cartItem');
const SupplierModel = require('./supplier');
const SaleModel = require('./sale');
const SaleItemModel = require('./saleItem');

const User = UserModel(sequelize, Sequelize.DataTypes);
const Product = ProductModel(sequelize, Sequelize.DataTypes);
const CartItem = CartItemModel(sequelize, Sequelize.DataTypes);
const Supplier = SupplierModel(sequelize, Sequelize.DataTypes);
const Sale = SaleModel(sequelize, Sequelize.DataTypes);
const SaleItem = SaleItemModel(sequelize, Sequelize.DataTypes);

// relações
User.hasMany(CartItem, { foreignKey: 'userId', onDelete: 'CASCADE' });
CartItem.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(CartItem, { foreignKey: 'productId', onDelete: 'CASCADE' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });

Supplier.hasMany(Product, { foreignKey: 'supplierId', onDelete: 'SET NULL' });
Product.belongsTo(Supplier, { foreignKey: 'supplierId' });

User.hasMany(Sale, { foreignKey: "userId" });
Sale.belongsTo(User, { foreignKey: "userId" });

Sale.hasMany(SaleItem, { foreignKey: "saleId", onDelete: "CASCADE" });
SaleItem.belongsTo(Sale, { foreignKey: "saleId" });

Product.hasMany(SaleItem, { foreignKey: "productId" });
SaleItem.belongsTo(Product, { foreignKey: "productId" });

sequelize.sync()
  .then(() => console.log("Banco sincronizado com sucesso!"))
  .catch(err => console.error("Erro ao sincronizar banco:", err));

module.exports = {
  sequelize,
  Sequelize,
  User,
  Product,
  CartItem,
  Supplier,
  Sale,
  SaleItem,
};