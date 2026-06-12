const fs = require('fs');
const file = 'src/app/contexts/LaboratoryContext.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetAddTest = `  const addTest = async (test: Omit<LabTest, 'id'>) => {
    try {
      const { data, error } = await supabase.from("lab_tests").insert({
        test_name: test.test,
        test_date: new Date().toISOString().split('T')[0],
        status: test.status,
        result: test.result
      }).select();

      if (!error && data) {
        const newTest: LabTest = {
          id: data[0].id,
          test: data[0].test_name,
          date: new Date(data[0].test_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          status: data[0].status as any,
          result: data[0].result || '-'
        };
        setTests(prev => [...prev, newTest]);
      }
    } catch (e) {
      console.error("Error adding lab test:", e);
    }
  };`;

const replacementAddTest = `  const addTest = async (test: Omit<LabTest, 'id'>) => {
    try {
      const { data, error } = await supabase.from("lab_tests").insert({
        test_name: test.test,
        test_date: new Date().toISOString().split('T')[0],
        status: test.status,
        result: test.result
      }).select();

      if (!error && data) {
        const newTest: LabTest = {
          id: data[0].id,
          test: data[0].test_name,
          date: new Date(data[0].test_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          status: data[0].status as any,
          result: data[0].result || '-'
        };
        setTests(prev => [...prev, newTest]);
      } else {
        throw error || new Error("Failed to insert into Supabase");
      }
    } catch (e) {
      console.error("Error adding lab test:", e);
      // Fallback for mock data when Supabase is down/missing
      const newTest: LabTest = {
        id: Date.now(),
        test: test.test,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        status: test.status,
        result: test.result || '-'
      };
      setTests(prev => [newTest, ...prev]);
    }
  };`;

// replace directly using indexOf just to be safe if indentation doesn't match perfectly
const startIdx = content.indexOf(`  const addTest = async (test: Omit<LabTest, 'id'>) => {`);
const endStr = `  useEffect(() => {`;
const endIdx = content.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + replacementAddTest + "\\n\\n" + content.substring(endIdx);
  fs.writeFileSync(file, content);
  console.log("Success");
} else {
  console.log("Could not find start or end index");
}
