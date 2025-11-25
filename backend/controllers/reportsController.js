const PDFDocument = require("pdfkit");
const { Sale, SaleItem, Product, User } = require("../models");
const sequelize = require("../config/database");

exports.salesReport = async (req, res) => {
  try {
    const vendas = await Sale.findAll({
      include: [
        {
          model: User,
          attributes: ["name", "email"],
        },
        {
          model: SaleItem,
          include: [{ model: Product }],
        }
      ],
      order: [["createdAt", "DESC"]],
    });

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=vendas.pdf");

    doc.pipe(res);

    doc
      .fontSize(22)
      .text("Relatório de Vendas", { align: "center" })
      .moveDown();

    vendas.forEach((venda) => {
      doc
        .fontSize(14)
        .text(`Venda #${venda.id}`, { bold: true })
        .fontSize(12)
        .text(`Data: ${new Date(venda.createdAt).toLocaleString()}`)
        .text(`Cliente: ${venda.User?.name || "Não informado"}`)
        .text(`Email: ${venda.User?.email || "—"}`)
        .text(`Total: R$ ${venda.total.toFixed(2)}`)
        .moveDown();

      doc.fontSize(12).text("Itens:");
      venda.SaleItems.forEach((item) => {
        doc.text(
          `• ${item.Product.name} — ${item.quantity} un — R$ ${(item.price * item.quantity).toFixed(2)}`
        );
      });

      doc.moveDown().moveDown();
    });

    doc.end();
  } catch (err) {
    console.error("Erro ao gerar relatório de vendas:", err);
    return res.status(500).json({ error: "Erro ao gerar relatório" });
  }
};


exports.financialReport = async (req, res) => {
  try {
    const totalGeral = await Sale.sum("total");
    const ultimasVendas = await Sale.findAll({
      limit: 10,
      order: [["createdAt", "DESC"]],
    });

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=financeiro.pdf");

    doc.pipe(res);

    doc
      .fontSize(22)
      .text("Relatório Financeiro", { align: "center" })
      .moveDown();

    doc.fontSize(16).text(`Total Geral Faturado: R$ ${Number(totalGeral).toFixed(2)}`);
    doc.moveDown();

    doc.fontSize(14).text("Últimas Vendas:");
    doc.moveDown();

    ultimasVendas.forEach((v) => {
      doc.fontSize(12).text(
        `Venda #${v.id} — R$ ${v.total.toFixed(2)} — ${new Date(v.createdAt).toLocaleString()}`
      );
    });

    doc.end();
  } catch (err) {
    console.error("Erro ao gerar relatório financeiro:", err);
    return res.status(500).json({ error: "Erro ao gerar relatório financeiro" });
  }
};