interface MailThread {
    snippet: string;
  }
  
  interface MailData {
    threads: MailThread[];
  }
  
  interface ConvertedMail {
    type: string;
    to: string | null;
    name: string | null;
    date: string | null;
    amount: number | null;
    available_amount: number | null;
  }
  
  function filterOnlyKPLUSmail(data: MailData): MailThread[] {
    const filteredMails: MailThread[] = data.threads.filter(thread => thread.snippet.includes("K PLUS"));
    return filteredMails;
  }
  
  function convertMailToJSON(data: string): ConvertedMail {
    const transferRegex = /เรื่อง แจ้งผลการทำรายการโอนเงิน/;
    const paymentRegex = /เรื่อง แจ้งผลการทำรายการชำระค่าสินค้าและบริการ/;
  
    const isTransfer: boolean = transferRegex.test(data);
    const isPayment: boolean = paymentRegex.test(data);
  
    let type: string, to: string | null, name: string | null, date: string | null, amount: number | null, available_amount: number | null;
  
    if (isTransfer) {
      type = 'transfer';
      to = findMatch(data, /ธนาคารผู้รับเงิน: ([^\n]+)/);
      name = findMatch(data, /ชื่อบัญชี: ([^\n]+)/);
    } else if (isPayment) {
      type = 'payment';
      to = findMatch(data, /เพื่อเข้าบัญชีบริษัท: ([^\n]+)/);
      name = null; // No name for payment type
    }
  
    date = findMatch(data, /วันที่ทำรายการ: ([^\n]+)/);
    amount = findFloatMatch(data, /จำนวนเงิน \(บาท\): ([^\n]+)/);
    available_amount = findFloatMatch(data, /ยอดถอนได้ \(บาท\): ([^\n]+)/);
  
    return { type, to, name, date, amount, available_amount };
  }
  
  function findMatch(data: string, regex: RegExp): string | null {
    const match = data.match(regex);
    return match ? match[1] : null;
  }
  
  function findFloatMatch(data: string, regex: RegExp): number | null {
    const match = data.match(regex);
    return match ? parseFloat(match[1]) : null;
  }
  
  export {
    filterOnlyKPLUSmail,
    convertMailToJSON
  };
  