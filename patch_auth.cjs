// Expose a way to force mock login
const fs = require('fs');
const file = 'src/app/contexts/AuthContext.tsx';
let content = fs.readFileSync(file, 'utf8');

// We don't want to change the production code, let's just make sure the python test hits the right thing.
// The python test is probably redirecting to login because `isAuthenticated` in AuthContext is false.
// `isAuthenticated` is `!!user`.
// The problem is `localStorage` updates are not immediately picked up by AuthContext if we do it after load.
// We should do it before `goto` using `add_init_script`.
