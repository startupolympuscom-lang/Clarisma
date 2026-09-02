const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code += `\napp.post('/api/init-db', requireAdmin, async (req, res) => {
  try {
    await initDB();
    res.json({ message: 'Database initialized successfully!' });
  } catch (err) {
    console.error('Init DB Error:', err);
    res.status(500).json({ error: String(err) });
  }
});\n`;

fs.writeFileSync('server.ts', code);
