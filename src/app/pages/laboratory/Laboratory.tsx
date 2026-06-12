import { useState } from "react";
import { TestTube, Download, Eye, Calendar, Plus, CheckCircle, Edit } from "lucide-react";
import { useLaboratory, LabTest } from "../../contexts/LaboratoryContext";
import { useAuth } from "../../contexts/AuthContext";

export default function Laboratory() {
  const { tests, processTest, addTest } = useLaboratory();
  const { user } = useAuth();
  const isLabStaff = true; // user?.role === 'admin' || user?.role === 'doctor';

  const [isProcessing, setIsProcessing] = useState<number | null>(null);
  const [resultInput, setResultInput] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newTestName, setNewTestName] = useState("");

  const handleProcess = (testId: number) => {
    setIsProcessing(testId);
    setResultInput("");
  };

  const submitResult = (testId: number) => {
    if (resultInput.trim()) {
      processTest(testId, "Completed", resultInput);
      setIsProcessing(null);
    }
  };

  const handleAddTest = () => {
    if (newTestName.trim()) {
      addTest({
        test: newTestName,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: "Pending",
        result: "-"
      });
      setIsAdding(false);
      setNewTestName("");
    }
  };

  const completedTests = tests.filter(t => t.status === "Completed").length;
  const inProgressTests = tests.filter(t => t.status === "In Progress" || t.status === "Pending").length;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Laboratory</h1>
          <p className="text-slate-600 mt-2">View and manage lab test results</p>
        </div>
        {isLabStaff && (
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Request Test
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TestTube className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{tests.length}</span>
          </div>
          <h3 className="text-slate-600 text-sm">Total Tests</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{completedTests}</span>
          </div>
          <h3 className="text-slate-600 text-sm">Completed</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TestTube className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{inProgressTests}</span>
          </div>
          <h3 className="text-slate-600 text-sm">Pending / In Progress</h3>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl border border-blue-200 mb-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Request New Lab Test</h3>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Test Name (e.g., Blood Glucose)"
              value={newTestName}
              onChange={(e) => setNewTestName(e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button onClick={handleAddTest} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Submit
            </button>
            <button onClick={() => setIsAdding(false)} className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Lab Tests & Results</h2>
        <div className="space-y-4">
          {tests.map((test) => (
            <div key={test.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100 hover:shadow-sm transition-shadow">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    test.status === "Completed" ? "bg-green-100" : "bg-blue-100"
                  }`}>
                    <TestTube className={`w-6 h-6 ${
                      test.status === "Completed" ? "text-green-600" : "text-blue-600"
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{test.test}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {test.date}
                      </span>
                      {test.result !== "-" && test.status === "Completed" && (
                        <span className={`px-2 py-1 text-xs rounded font-medium ${
                          test.result.toLowerCase().includes("normal") && !test.result.toLowerCase().includes("abnormal")
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          Result: {test.result}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto">
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    test.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : test.status === "In Progress"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-orange-100 text-orange-700"
                  }`}>
                    {test.status}
                  </span>

                  {test.status === "Completed" ? (
                    <>
                      <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors" title="View Result">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors" title="Download Report">
                        <Download className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    isLabStaff && isProcessing !== test.id && (
                      <button
                        onClick={() => handleProcess(test.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                      >
                        <Edit className="w-4 h-4" />
                        Enter Result
                      </button>
                    )
                  )}
                </div>
              </div>

              {isProcessing === test.id && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200 flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Enter Test Result</label>
                    <input
                      type="text"
                      value={resultInput}
                      onChange={(e) => setResultInput(e.target.value)}
                      placeholder="e.g. Normal, High Glucose, etc."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <button
                    onClick={() => submitResult(test.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsProcessing(null)}
                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
          {tests.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No lab tests found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
