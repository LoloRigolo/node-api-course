const fs = require("fs").promises;

async function readDB() {
  const data = await fs.readFile("db.json", "utf8");
  return JSON.parse(data);
}

async function writeDB(data) {
  await fs.writeFile("db.json", JSON.stringify(data, null, 2), "utf8");
}

module.exports = { readDB, writeDB };
