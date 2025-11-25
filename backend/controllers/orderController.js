const { Sale, SaleItem, Product } = require("../models");

exports.createOrder = async (req, res) => {
  const userId = req.user.id;
  const { items, total } = req.body;

  try {
    if (!items || !items.length) {
      return res.status(400).json({ error: "Carrinho vazio" });
    }

    const sale = await Sale.create({ userId, total, status: "pendente" });

    for (const item of items) {
      const product = await Product.findByPk(item.product_id);

      if (!product) {
        return res
          .status(400)
          .json({ error: `Produto ${item.product_id} não encontrado` });
      }

      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ error: `Estoque insuficiente para ${product.name}` });
      }

      await SaleItem.create({
        saleId: sale.id,
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });

      product.stock -= item.quantity;
      await product.save();
    }

    return res
      .status(201)
      .json({ message: "Pedido criado com sucesso", orderId: sale.id });
  } catch (err) {
    console.error("Erro ao criar pedido:", err);
    return res.status(500).json({ error: "Erro ao criar pedido" });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Sale.findAll({
      where: { userId: req.user.id },
      include: [{ model: SaleItem, include: [Product] }],
      order: [["createdAt", "DESC"]],
    });
    return res.json(orders);
  } catch (err) {
    console.error("Erro ao buscar pedidos do cliente:", err);
    return res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Sale.findAll({
      include: [{ model: SaleItem, include: [Product] }],
      order: [["createdAt", "DESC"]],
    });
    return res.json(orders);
  } catch (err) {
    console.error("Erro ao buscar pedidos:", err);
    return res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
};