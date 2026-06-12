const fs = require('fs');
const file = 'src/app/contexts/LaboratoryContext.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\\n\\n/g, '\n\n');
fs.writeFileSync(file, content);
