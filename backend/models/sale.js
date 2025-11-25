module.exports = (sequelize, DataTypes) => {
  const Sale = sequelize.define("Sale", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    total: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: "pendente" }, // <-- FALTAVA
  });

  return Sale;
};