const db = require('./models');

async function checkSchema() {
  try {
    const [results, metadata] = await db.sequelize.query("PRAGMA table_info(UsageLogs);");
    console.log('UsageLogs table columns:', results);
  } catch (error) {
    console.error('Error checking schema:', error);
  }
  process.exit();
}

checkSchema();
