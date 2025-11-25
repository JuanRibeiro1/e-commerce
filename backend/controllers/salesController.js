const { Sale, SaleItem, Product } = require("../models");

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, total } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ error: "Pedido inválido." });

    const sale = await Sale.create({ userId, total });

    for (const item of items) {
      await SaleItem.create({
        saleId: sale.id,
        productId: item.product_id,
        quantity: item.quantity,
        price: item.price,
      });

      const product = await Product.findByPk(item.product_id);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        await product.save();
      }
    }

    return res.json({ orderId: sale.id });
  } catch (err) {
    console.error("Erro ao criar pedido:", err);
    return res.status(500).json({ error: "Erro ao criar pedido" });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Sale.findAll({
      where: { userId: req.user.id },
      include: [{ model: SaleItem }],
      order: [["createdAt", "DESC"]],
    });

    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Sale.findAll({
      include: [{ model: SaleItem }],
      order: [["createdAt", "DESC"]],
    });

    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
};