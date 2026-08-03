import postgres from 'postgres';
import fs from 'fs';

// Read .env.local manually to load variables
const envLocalContent = fs.readFileSync('.env.local', 'utf8');
const dbUrlMatch = envLocalContent.match(/DATABASE_URL=["']?([^"'\n]+)/);
const connectionString = dbUrlMatch ? dbUrlMatch[1] : null;

if (!connectionString) {
  console.error('No DATABASE_URL found in .env.local');
  process.exit(1);
}

console.log('Connecting to:', connectionString);
const sql = postgres(connectionString, {
  connect_timeout: 5,
});

async function test() {
  try {
    const result = await sql`SELECT 1 as connected`;
    console.log('Database connection successful:', result);
    process.exit(0);
  } catch (err) {
    console.error('Connection failed:', err);
    process.exit(1);
  }
}

test();
