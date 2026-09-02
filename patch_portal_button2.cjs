const fs = require('fs');
let code = fs.readFileSync('components/Portal.tsx', 'utf8');

const regex = /<button \n            onClick={handleLogout}\n            className="text-sm border border-white\/20 px-4 py-2 rounded-lg hover:bg-white\/10 transition-colors"\n          >\n            Logout\n          <\/button>/;

const replacement = `<button 
            onClick={async () => {
              const token = localStorage.getItem('authToken');
              try {
                const res = await fetch('/api/init-db', { method: 'POST', headers: { 'Authorization': \`Bearer \${token}\` } });
                if (res.ok) alert('Database Initialized Successfully! You can now save settings.');
                else alert('Failed to initialize database: ' + (await res.text()));
              } catch(e) { alert('Error: ' + e); }
            }}
            className="text-sm bg-red-500 hover:bg-red-600 font-bold px-4 py-2 rounded-lg transition-colors mr-2"
          >
            Repair Database
          </button>
          <button 
            onClick={handleLogout}
            className="text-sm border border-white/20 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            Logout
          </button>`;

code = code.replace(regex, replacement);
fs.writeFileSync('components/Portal.tsx', code);
