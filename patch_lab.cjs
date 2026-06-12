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
      setTests(prev => [...prev, newTest]);
    }
  };`;

content = content.replace(targetAddTest, replacementAddTest);
fs.writeFileSync(file, content);
