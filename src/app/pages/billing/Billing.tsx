import { useState } from "react";
import { DollarSign, Download, Eye, Calendar, Plus, CheckCircle } from "lucide-react";
import { useBilling, Invoice } from "../../contexts/BillingContext";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";

export default function Billing() {
  const { invoices, generateBill, markAsPaid } = useBilling();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isFinanceStaff = true; // user?.role === 'admin';

  const [isAdding, setIsAdding] = useState(false);
  const [newService, setNewService] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const handleGenerateBill = () => {
    const amount = parseFloat(newAmount);
    if (newService.trim() && !isNaN(amount) && amount > 0) {
      generateBill({
        service: newService,
        amount: amount,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: "Pending"
      });
      setIsAdding(false);
      setNewService("");
      setNewAmount("");
    }
  };

  const handlePayNow = (invoice: Invoice) => {
    // Store the selected invoice amount in sessionStorage to pass to Payments page
    sessionStorage.setItem("payment_invoice_id", invoice.id.toString());
    sessionStorage.setItem("payment_invoice_amount", invoice.amount.toString());
    sessionStorage.setItem("payment_invoice_service", invoice.service);
    navigate("/payments");
  };

  const totalPaid = invoices.filter(inv => inv.status === "Paid").reduce((sum, inv) => sum + inv.amount, 0);
  const totalPending = invoices.filter(inv => inv.status === "Pending").reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Billing & Invoices</h1>
          <p className="text-slate-600 mt-2">Manage your healthcare bills and payments</p>
        </div>
        {isFinanceStaff && (
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Generate Bill
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{invoices.length}</span>
          </div>
          <h3 className="text-slate-600 text-sm">Total Invoices</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">KES {totalPaid.toLocaleString()}</span>
          </div>
          <h3 className="text-slate-600 text-sm">Total Paid</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">KES {totalPending.toLocaleString()}</span>
          </div>
          <h3 className="text-slate-600 text-sm">Pending Payment</h3>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl border border-blue-200 mb-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Create New Invoice</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Service Description (e.g., Blood Test)"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              className="flex-[2] px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="number"
              placeholder="Amount (KES)"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button onClick={handleGenerateBill} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Create
            </button>
            <button onClick={() => setIsAdding(false)} className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Invoices</h2>
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100 hover:shadow-sm transition-shadow">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    invoice.status === "Paid" ? "bg-green-100" : "bg-orange-100"
                  }`}>
                    <DollarSign className={`w-6 h-6 ${
                      invoice.status === "Paid" ? "text-green-600" : "text-orange-600"
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{invoice.service}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {invoice.date}
                      </span>
                      <span className="font-semibold text-slate-800">KES {invoice.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto">
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    invoice.status === "Paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}>
                    {invoice.status}
                  </span>

                  <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors" title="View Details">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors" title="Download Invoice">
                    <Download className="w-5 h-5" />
                  </button>

                  {invoice.status === "Pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePayNow(invoice)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Pay Now
                      </button>
                      {isFinanceStaff && (
                        <button
                          onClick={() => markAsPaid(invoice.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                          title="Manually confirm payment"
                        >
                          Confirm
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {invoices.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No invoices found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
