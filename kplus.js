async function filterOnlyKPLUSmail(data){
    const filteredMails = data.threads.filter(thread => thread.snippet.includes("K PLUS"));
    return filteredMails;
}

async function convertMailToJSON(data) {
    const transferRegex = /เรื่อง แจ้งผลการทำรายการโอนเงิน/;
    const paymentRegex = /เรื่อง แจ้งผลการทำรายการชำระค่าสินค้าและบริการ/;

    const isTransfer = transferRegex.test(data);
    const isPayment = paymentRegex.test(data);

    let type, to, name;

    if (isTransfer) {
        type = 'transfer';
        to = data.match(/ธนาคารผู้รับเงิน: ([^\n]+)/)[1];
        name = data.match(/ชื่อบัญชี: ([^\n]+)/)[1];
    } else if (isPayment) {
        type = 'payment';
        to = data.match(/เพื่อเข้าบัญชีบริษัท: ([^\n]+)/)[1];
        name = null; // No name for payment type
    }

    const dateRegex = /วันที่ทำรายการ: ([^\n]+)/;
    const amountRegex = /จำนวนเงิน \(บาท\): ([^\n]+)/;
    const availableAmountRegex = /ยอดถอนได้ \(บาท\): ([^\n]+)/;

    const dateMatch = data.match(dateRegex);
    const amountMatch = data.match(amountRegex);
    const availableAmountMatch = data.match(availableAmountRegex);

    const date = dateMatch ? dateMatch[1] : null;
    const amount = amountMatch ? parseFloat(amountMatch[1]) : null;
    const available_amount = availableAmountMatch ? parseFloat(availableAmountMatch[1]) : null;

    return { type, to, name, date, amount, available_amount };
}




module.exports={
    filterOnlyKPLUSmail,
    convertMailToJSON
}