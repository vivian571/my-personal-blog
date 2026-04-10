import postgres from 'postgres';

const sql = postgres('postgresql://postgres.ynaipebxobelevsswupi:15066458562Y@aws-1-eu-west-1.pooler.supabase.com:6543/postgres', {
  connect_timeout: 60,
});

async function test() {
  try {
    const result = await sql`SELECT count(*) FROM "user"`;
    console.log('Table "user" exists, count:', result);
    process.exit(0);
  } catch (err) {
    console.error('Connection failed:', err);
    process.exit(1);
  }
}

test();
