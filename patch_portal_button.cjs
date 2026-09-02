const fs = require('fs');
let code = fs.readFileSync('components/Portal.tsx', 'utf8');

const regex = /<h1 className="text-3xl font-bold font-serif mb-2">Admin Portal<\/h1>/;

const replacement = `<div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold font-serif">Admin Portal</h1>
            <button
              onClick={async () => {
                const token = localStorage.getItem('authToken');
                try {
                  const res = await fetch('/api/init-db', { method: 'POST', headers: { 'Authorization': \`Bearer \${token}\` } });
                  if (res.ok) alert('Database Initialized Successfully! You can now save settings.');
                  else alert('Failed to initialize database: ' + (await res.text()));
                } catch(e) { alert('Error: ' + e); }
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-bold"
            >
              Repair Database Tables
            </button>
          </div>`;

code = code.replace(regex, replacement);
fs.writeFileSync('components/Portal.tsx', code);
