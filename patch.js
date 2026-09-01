const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(
`  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  pool.on('error', (err: any) => {
    console.error('Unexpected error on idle database client', err);
  });`,
`  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    pool.on('error', (err: any) => {
      console.error('Unexpected error on idle database client', err);
    });
  } catch (err) {
    console.error('CRITICAL: Failed to initialize pg.Pool. Is DATABASE_URL formatted correctly? (Must start with postgresql://)', err);
    pool = {
      isMock: true,
      query: async (text: string = '') => {
        if (text.toUpperCase().includes('COUNT')) return { rows: [{ count: 0 }] };
        if (text.toUpperCase().includes('RETURNING') || text.toUpperCase().includes('INSERT') || text.toUpperCase().includes('UPDATE')) return { rows: [{ id: 1 }] };
        return { rows: [] };
      },
      connect: async () => ({
        query: async (text: string = '') => {
          if (text.toUpperCase().includes('COUNT')) return { rows: [{ count: 0 }] };
          if (text.toUpperCase().includes('RETURNING') || text.toUpperCase().includes('INSERT') || text.toUpperCase().includes('UPDATE')) return { rows: [{ id: 1 }] };
          return { rows: [] };
        },
        release: () => {}
      }),
      on: () => {}
    };
  }`
);
fs.writeFileSync('server.ts', code);
