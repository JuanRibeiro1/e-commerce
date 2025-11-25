const { Supplier } = require('../models');

exports.list = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({ order: [['createdAt', 'DESC']] });
    return res.json(suppliers); // ✅ Retorna um array direto
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar fornecedores' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const id = req.params.id;
    const supplier = await Supplier.findByPk(id);
    if (!supplier) return res.status(404).json({ error: 'Fornecedor não encontrado' });
    return res.json(supplier);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar fornecedor' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, contact, email, phone } = req.body;
    const supplier = await Supplier.create({ name, contact, email, phone });
    return res.status(201).json(supplier);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao criar fornecedor' });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, contact, email, phone } = req.body;

    const supplier = await Supplier.findByPk(id);
    if (!supplier) return res.status(404).json({ error: 'Fornecedor não encontrado' });

    supplier.name = name ?? supplier.name;
    supplier.contact = contact ?? supplier.contact;
    supplier.email = email ?? supplier.email;
    supplier.phone = phone ?? supplier.phone;

    await supplier.save();
    return res.json(supplier);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao atualizar fornecedor' });
  }
};

exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    const supplier = await Supplier.findByPk(id);
    if (!supplier) return res.status(404).json({ error: 'Fornecedor não encontrado' });

    await supplier.destroy();
    return res.json({ message: 'Fornecedor excluído' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao excluir fornecedor' });
  }
};