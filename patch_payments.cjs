const fs = require('fs');
const file = 'src/app/pages/billing/Payments.tsx';
let content = fs.readFileSync(file, 'utf8');

// We need to add a receipt state and a CheckCircle icon, and modify the returned JSX.

content = content.replace(
  'import { CreditCard, Smartphone, DollarSign, ArrowLeft, Loader2 } from "lucide-react";',
  'import { CreditCard, Smartphone, DollarSign, ArrowLeft, Loader2, CheckCircle } from "lucide-react";'
);

// Add receipt state
const targetState = `  const [phone, setPhone] = useState("");`;
const replacementState = `  const [phone, setPhone] = useState("");\n  const [paymentSuccess, setPaymentSuccess] = useState(false);`;
content = content.replace(targetState, replacementState);

// Replace handlePayment logic
const targetHandlePayment = `  const handlePayment = () => {
    if (!invoiceId) return;

    setIsProcessing(true);

    // Simulate network delay for Daraja API payment
    setTimeout(() => {
      markAsPaid(invoiceId);
      setIsProcessing(false);

      // Clean up session storage
      sessionStorage.removeItem("payment_invoice_id");
      sessionStorage.removeItem("payment_invoice_amount");
      sessionStorage.removeItem("payment_invoice_service");

      // Go back to billing
      navigate("/billing");
    }, 2000);
  };`;

const replacementHandlePayment = `  const handlePayment = () => {
    if (!invoiceId) return;

    setIsProcessing(true);

    // Simulate network delay for Daraja API payment
    setTimeout(() => {
      markAsPaid(invoiceId);
      setIsProcessing(false);
      setPaymentSuccess(true);

      // Clean up session storage
      sessionStorage.removeItem("payment_invoice_id");
      sessionStorage.removeItem("payment_invoice_amount");
      sessionStorage.removeItem("payment_invoice_service");
    }, 2000);
  };`;
content = content.replace(targetHandlePayment, replacementHandlePayment);

// Add success view JSX
const targetReturn = `  return (
    <div className="max-w-4xl mx-auto">`;

const replacementReturn = `  if (paymentSuccess) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-xl border border-green-200 shadow-sm text-center max-w-md mx-auto mt-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
          <p className="text-slate-600 mb-8">Your payment has been successfully processed.</p>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-left mb-8">
            <h3 className="font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-2">Receipt Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt No:</span>
                <span className="font-medium text-slate-900">REC-{Math.floor(Math.random() * 100000).toString().padStart(6, '0')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Service:</span>
                <span className="font-medium text-slate-900">{serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date:</span>
                <span className="font-medium text-slate-900">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between pt-2 mt-2 border-t border-slate-200 font-bold">
                <span className="text-slate-900">Total Paid:</span>
                <span className="text-green-600">KES {totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/billing")}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Return to Billing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">`;
content = content.replace(targetReturn, replacementReturn);

fs.writeFileSync(file, content);
console.log("Success patching Payments");
