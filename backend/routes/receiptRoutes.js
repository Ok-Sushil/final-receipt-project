const express = require('express');
const { getCustomerDetails, generateReceipt, getAllReceipts, getUniqueUsers  } = require('../controllers/receiptController');

const router = express.Router();
router.post('/getCustomer', getCustomerDetails);
router.post('/generate', generateReceipt);
router.get('/', getAllReceipts);
router.get('/users', getUniqueUsers);


module.exports = router;
