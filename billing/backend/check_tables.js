const db = require('./models');

async function checkTable() {
  try {
    const [results, metadata] = await db.sequelize.query("SELECT name FROM sqlite_master WHERE type='table';");
    console.log('Tables:', results);
  } catch (error) {
    console.error('Error checking tables:', error);
  }
  process.exit();
}

checkTable();
