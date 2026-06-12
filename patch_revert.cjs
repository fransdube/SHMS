const fs = require('fs');

// Revert Auth
let file = 'src/app/components/auth/ProtectedRoute.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  `  // Not logged in
  if (!isAuthenticated) {
    // bypass for testing
    // return <Navigate to="/login" state={{ from: location }} replace />;
  }`,
  `  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }`
);
content = content.replace(
  `  // Role check
  if (allowedRoles && user && !allowedRoles.includes(user.role as any)) {
    // bypass
    return <>{children}</>;`,
  `  // Role check
  if (allowedRoles && user && !allowedRoles.includes(user.role as any)) {`
);
fs.writeFileSync(file, content);

// Revert lab
file = 'src/app/pages/laboratory/Laboratory.tsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(
  "const isLabStaff = true; // user?.role === 'admin' || user?.role === 'doctor';",
  "const isLabStaff = user?.role === 'admin' || user?.role === 'doctor';"
);
fs.writeFileSync(file, content);

// Revert billing
file = 'src/app/pages/billing/Billing.tsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(
  "const isFinanceStaff = true; // user?.role === 'admin';",
  "const isFinanceStaff = user?.role === 'admin';"
);
fs.writeFileSync(file, content);
console.log("Reverted bypasses");
