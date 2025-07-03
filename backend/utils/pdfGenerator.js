const PDFDocument = require('pdfkit');
const path = require('path');
const { toWords } = require('number-to-words');

const generateReceiptPDF = ({ receiptNumber, customerId, name, amount, transactionId }, res) => {
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Receipt_${receiptNumber}.pdf`);

    doc.pipe(res);

    const fontPath = path.join(__dirname, '../fonts/NotoSansDevanagari-Regular.ttf');
    const logo1Path = path.join(__dirname, '../public/logo1.png');
    const logo2Path = path.join(__dirname, '../public/logo2.png');

    doc.registerFont('HindiFont', fontPath);

    // Header logos
    doc.image(logo1Path, 50, 30, { width: 80 });
    doc.image(logo2Path, 460, 30, { width: 80 });

    doc.moveDown(2);
    doc.font('HindiFont').fontSize(18).text('दक्षिणांचल विद्युत वितरण निगम लिमिटेड', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(14).text('( भुगतान पावती मूल प्रति )', { align: 'center' });

    doc.moveDown(2);
    doc.fontSize(12);

    const leftX = 50;
    const rightX = 280;
    const labelWidth = 130;
    const colonGap = 5;
    const valueGap = 10;
    let y = 200;
    const lineHeight = 20;

    function drawFieldPair(label1, value1, label2, value2) {
        doc.text(label1, leftX, y);
        doc.text(':', leftX + labelWidth, y);
        doc.text(value1, leftX + labelWidth + colonGap + valueGap, y);

        if (label2) {
            doc.text(label2, rightX, y);
            doc.text(':', rightX + labelWidth, y);
            doc.text(value2, rightX + labelWidth + colonGap + valueGap, y);
        }
        y += lineHeight;
    }

    drawFieldPair('रसीद संख्या', receiptNumber, 'द.वि.वि.नि.लि. संदर्भ संख्या', '96242');
    drawFieldPair('भुगतान प्रकार', 'Wallet (CSC)', 'भुगतान तिथि', formatDate());
    drawFieldPair('खाता संख्या', customerId, 'उपभोक्ता का नाम', name);
    drawFieldPair('कुल देय राशि', `₹ ${amount}`, '', '');
    drawFieldPair('प्राप्त धनराशि (अंकों में)', `₹ ${amount}`, '', '');
    drawFieldPair('शब्दों में', `${toWords(parseInt(amount)).replace(/,/g, '')} Rupees`, '', '');
    drawFieldPair('बकाया राशि', '₹ 0.00', 'छूट', '₹ 0.00');
    drawFieldPair('भुगतान प्राप्तकर्ता की आई. डी.', '475334150013', '', '');
    drawFieldPair('रसीद छापने वाले की आई. डी.', '475334150013', 'रसीद छापने की तिथि', formatDate());

    y += 40;
    doc.text('यह एक कंप्यूटर जनित रसीद है, अतः हस्ताक्षर की आवश्यकता नहीं है |', 0, y, { align: 'center' });
    y += 15;
    doc.text('राष्ट्र एवम् स्वहित में बिजली बचायें', { align: 'center' });
    y += 30;
    doc.text('कृपया विद्युत बिल का ऑनलाइन भुगतान अपने निकटतम जन सुविधा केंद्र पर करें |', { align: 'center' });
    y += 20;
    doc.text(`CSC Transaction Id : ${transactionId}`, { align: 'center' });

    doc.end();
};

module.exports = { generateReceiptPDF };

function formatDate() {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // 0 -> 12

    return `${day}-${month}-${year}  ${hours}:${minutes} ${ampm}`;
}

