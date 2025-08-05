const conn = require('../config/db.config');
const fs = require('fs');
const path = require('path');

async function install() {
    const queryPath = path.join(__dirname, 'sql', 'initial-queries.sql');
    let queries = [];
    let finalMessage = {};
    let tempLine = '';

    // Read the SQL file
    const fileContent = fs.readFileSync(queryPath, 'utf-8');
    const lines = fileContent.split('\n');

    // Parse queries
    await new Promise((resolve, reject) => {
        lines.forEach((line) => {
            if (line.trim().startsWith('--') || line.trim() === "") {
                return;
            }
            tempLine += line + '\n';
            if (line.trim().endsWith(';')) {
                queries.push(tempLine.trim());
                tempLine = '';
            }
        });
        resolve("Queries added");
    });

    // Execute queries
    for (let i = 0; i < queries.length; i++) {
        try {
            await conn.query(queries[i]);
            console.log("Table created");
        } catch (error) {
            console.error("Query failed:", error.message);
            finalMessage.message = "Not all tables were created.";
        }
    }

    if (!finalMessage.message) {
        finalMessage.message = "All tables are created.";
        finalMessage.status = 200;
    } else {
        finalMessage.status = 500;
    }

    return finalMessage;
}

module.exports = { install };
