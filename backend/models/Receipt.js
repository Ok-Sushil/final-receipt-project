const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
    customerId: String,
    name: String,
    amount: Number,
    receiptNumber: String,
    transactionId: String,
     enteredBy: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Receipt', receiptSchema);
