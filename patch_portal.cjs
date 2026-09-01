const fs = require('fs');
let code = fs.readFileSync('components/Portal.tsx', 'utf8');

const regex = /useEffect\(\(\) => \{[\s\S]*?\/\/ eslint-disable-next-line react-hooks\/exhaustive-deps\s*\}, \[\]\);/;

const replacement = `useEffect(() => {
    setRole('admin');
    setMyUserId(1);
    setMyName('Admin');
    fetchRetreats();
    fetchSettings();
    fetchReservations();
    fetchProducts();
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);`;

code = code.replace(regex, replacement);
fs.writeFileSync('components/Portal.tsx', code);
