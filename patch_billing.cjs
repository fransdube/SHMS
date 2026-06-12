const fs = require('fs');
const file = 'src/app/contexts/BillingContext.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetGenerateBill = `  const generateBill = async (bill: Omit<Invoice, 'id'>) => {
    try {
      const { data, error } = await supabase.from("invoices").insert({
        service: bill.service,
        amount: bill.amount,
        invoice_date: new Date().toISOString().split('T')[0],
        status: bill.status
      }).select();

      if (!error && data) {
        const newInvoice: Invoice = {
          id: data[0].id,
          service: data[0].service,
          amount: data[0].amount,
          date: new Date(data[0].invoice_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          status: data[0].status as any
        };
        setInvoices(prev => [...prev, newInvoice]);
      }
    } catch (e) {
      console.error("Error generating bill:", e);
    }
  };`;

const replacementGenerateBill = `  const generateBill = async (bill: Omit<Invoice, 'id'>) => {
    try {
      const { data, error } = await supabase.from("invoices").insert({
        service: bill.service,
        amount: bill.amount,
        invoice_date: new Date().toISOString().split('T')[0],
        status: bill.status
      }).select();

      if (!error && data) {
        const newInvoice: Invoice = {
          id: data[0].id,
          service: data[0].service,
          amount: data[0].amount,
          date: new Date(data[0].invoice_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          status: data[0].status as any
        };
        setInvoices(prev => [...prev, newInvoice]);
      } else {
        throw error || new Error("Failed to insert into Supabase");
      }
    } catch (e) {
      console.error("Error generating bill:", e);
      // Fallback for mock data when Supabase is down/missing
      const newInvoice: Invoice = {
        id: Date.now(),
        service: bill.service,
        amount: bill.amount,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        status: bill.status
      };
      setInvoices(prev => [newInvoice, ...prev]);
    }
  };`;

const startIdx = content.indexOf(`  const generateBill = async (bill: Omit<Invoice, 'id'>) => {`);
const endStr = `  useEffect(() => {`;
const endIdx = content.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + replacementGenerateBill + '\n\n' + content.substring(endIdx);
  fs.writeFileSync(file, content);
  console.log("Success patching BillingContext");
} else {
  console.log("Could not find start or end index in BillingContext");
}
