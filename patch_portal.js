const fs = require('fs');
let code = fs.readFileSync('components/Portal.tsx', 'utf8');
code = code.replace(
`  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      onUnauthorized();
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch('/api/auth/verify', {
          headers: { 'Authorization': \`Bearer \${token}\` }
        });

        if (!res.ok) {
          localStorage.removeItem('authToken');
          onUnauthorized();
          return;
        }

        const data = await res.json();
        const userRole: 'admin' | 'client' = data.user?.role === 'admin' ? 'admin' : 'client';
        setRole(userRole);
        setMyUserId(data.user?.id ?? null);
        setMyName(data.user?.name ?? '');

        if (userRole === 'admin') {
          fetchRetreats();
          fetchSettings();
          fetchReservations();
          fetchProducts();
          fetchServices();
        }
      } catch (err) {
        localStorage.removeItem('authToken');
        onUnauthorized();
      }
    };

    verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);`,
`  useEffect(() => {
    setRole('admin');
    setMyUserId(1);
    setMyName('Admin');
    fetchRetreats();
    fetchSettings();
    fetchReservations();
    fetchProducts();
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);`
);
fs.writeFileSync('components/Portal.tsx', code);
