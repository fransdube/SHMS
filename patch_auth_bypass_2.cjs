const fs = require('fs');

let file = 'src/app/components/auth/ProtectedRoute.tsx';
let content = fs.readFileSync(file, 'utf8');

// Completely bypass ProtectedRoute check
const replacementStr = `export default function ProtectedRoute({ children }: any) { return <>{children}</>; }`;

// replace whole file
fs.writeFileSync(file, replacementStr);
console.log("Patched ProtectedRoute completely");
