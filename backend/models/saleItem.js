module.exports = (sequelize, DataTypes) => {
  const SaleItem = sequelize.define("SaleItem", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    saleId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false }, // preço unitário da venda
  });

  return SaleItem;
};