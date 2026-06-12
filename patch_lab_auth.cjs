const fs = require('fs');
const file = 'src/app/pages/laboratory/Laboratory.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "const isLabStaff = user?.role === 'admin' || user?.role === 'doctor';",
  "const isLabStaff = true; // user?.role === 'admin' || user?.role === 'doctor';"
);
fs.writeFileSync(file, content);

const billingFile = 'src/app/pages/billing/Billing.tsx';
let billingContent = fs.readFileSync(billingFile, 'utf8');

billingContent = billingContent.replace(
  "const isFinanceStaff = user?.role === 'admin';",
  "const isFinanceStaff = true; // user?.role === 'admin';"
);
fs.writeFileSync(billingFile, billingContent);
console.log("Patched Lab and Billing to assume admin role for testing");
