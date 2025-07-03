const Receipt = require('../models/Receipt');
const { getCustomerName } = require('../utils/excelHelper');
const { generateReceiptPDF } = require('../utils/pdfGenerator');

exports.getCustomerDetails = (req, res) => {
    const { customerId } = req.body;
    const name = getCustomerName(customerId);

    if (!name) return res.status(404).json({ message: 'Customer not found' });
    res.json({ name });
};

exports.generateReceipt = async (req, res) => {
    const { customerId, amount, enteredBy} = req.body;
    const name = getCustomerName(customerId);

    if (!name) return res.status(404).json({ message: 'Customer not found' });

    const receiptNumber = customerId * 100;
    const transactionId = customerId * 100;

    const newReceipt = await Receipt.create({
        customerId,
        name,
        amount,
        receiptNumber,
        transactionId,
        enteredBy  // 🔥 यहां जोड़ा
    });

    generateReceiptPDF(newReceipt, res);
};

exports.getAllReceipts = async (req, res) => {
    const receipts = await Receipt.find().sort({ createdAt: -1 });
    res.json(receipts);
};

exports.getUniqueUsers = async (req, res) => {
    const users = await Receipt.distinct('enteredBy');
    res.json(users);
};
