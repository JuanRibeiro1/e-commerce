const { Sale, SaleItem, Product, Sequelize } = require("../models");
const { Op } = require("sequelize");

exports.getDashboardData = async (req, res) => {
  try {
    const agora = new Date();
    const primeiroDia = new Date(agora.getFullYear(), agora.getMonth(), 1);
    const ultimoDia = new Date(agora.getFullYear(), agora.getMonth() + 1, 0);

    const totalVendasMes = await Sale.sum("total", {
      where: { createdAt: { [Op.between]: [primeiroDia, ultimoDia] } }
    });

    const produtoMaisVendido = await SaleItem.findOne({
      attributes: [
        "productId",
        [Sequelize.fn("SUM", Sequelize.col("quantity")), "totalVendido"]
      ],
      include: [{ model: Product, attributes: ["id", "name"] }],
      group: ["productId"],
      order: [[Sequelize.literal("totalVendido"), "DESC"]],
    });

    const baixoEstoque = await Product.findAll({
      where: { stock: { [Op.lte]: 5 } },
      order: [["stock", "ASC"]]
    });

    res.json({
      totalVendasMes: totalVendasMes || 0,
      produtoMaisVendido: produtoMaisVendido
        ? {
            id: produtoMaisVendido.Product.id,
            name: produtoMaisVendido.Product.name,
            totalVendido: produtoMaisVendido.dataValues.totalVendido,
          }
        : null,
      baixoEstoque
    });

  } catch (err) {
    console.error("Erro no dashboard:", err);
    res.status(500).json({ error: "Erro ao carregar dashboard" });
  }
};