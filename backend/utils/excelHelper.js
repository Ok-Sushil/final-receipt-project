const XLSX = require('xlsx');
const path = require('path');

const getCustomerName = (customerId) => {
    const workbook = XLSX.readFile(path.join(__dirname, '../data/customerData.xlsx'));
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    const customer = data.find(c => String(c.ACCT_id) === String(customerId));
    return customer ? customer.Name : null;
};

module.exports = { getCustomerName };
