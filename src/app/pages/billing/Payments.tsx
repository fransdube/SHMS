import { useState, useEffect } from "react";
import { CreditCard, Smartphone, DollarSign, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { useBilling } from "../../contexts/BillingContext";

export default function Payments() {
  const navigate = useNavigate();
  const { markAsPaid } = useBilling();

  const [invoiceId, setInvoiceId] = useState<number | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [serviceName, setServiceName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [phone, setPhone] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const serviceCharge = amount > 0 ? 100 : 0;
  const totalAmount = amount + serviceCharge;

  useEffect(() => {
    const id = sessionStorage.getItem("payment_invoice_id");
    const amt = sessionStorage.getItem("payment_invoice_amount");
    const srv = sessionStorage.getItem("payment_invoice_service");

    if (id && amt && srv) {
      setInvoiceId(parseInt(id, 10));
      setAmount(parseFloat(amt));
      setServiceName(srv);
    } else {
      // If accessed directly without an invoice context, go back to billing
      navigate("/billing");
    }
  }, [navigate]);

  const handlePayment = () => {
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
  };

  if (paymentSuccess) {
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate("/billing")}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Billing
        </button>
        <h1 className="text-3xl font-bold text-slate-900">Make Payment</h1>
        <p className="text-slate-600 mt-2">Complete payment for {serviceName}</p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Payment Summary</h2>
          <div className="p-5 bg-slate-50 rounded-lg border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-600">{serviceName}</span>
              <span className="font-semibold text-slate-900">KES {amount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-600">Service Charge</span>
              <span className="font-semibold text-slate-900">KES {serviceCharge.toLocaleString()}</span>
            </div>
            <div className="border-t border-slate-300 mt-4 pt-4 flex items-center justify-between">
              <span className="text-lg font-bold text-slate-900">Total Amount</span>
              <span className="text-2xl font-bold text-blue-600">KES {totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Select Payment Method</h2>

          <label className="relative block">
            <input type="radio" name="payment" className="peer sr-only" defaultChecked />
            <div className="p-5 border-2 border-slate-200 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">M-Pesa</h3>
                  <p className="text-sm text-slate-600">Pay securely using M-Pesa mobile money</p>
                </div>
              </div>
            </div>
          </label>

          <label className="relative block">
            <input type="radio" name="payment" className="peer sr-only" />
            <div className="p-5 border-2 border-slate-200 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Card Payment</h3>
                  <p className="text-sm text-slate-600">Pay using credit or debit card</p>
                </div>
              </div>
            </div>
          </label>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone Number (for M-Pesa prompt)
            </label>
            <input
              type="tel"
              placeholder="+254 7XX XXX XXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            />
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full py-3.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Payment...
              </>
            ) : (
              `Complete Payment - KES ${totalAmount.toLocaleString()}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
