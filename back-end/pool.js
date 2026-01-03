const { Pool } = require("pg");

const pool = new Pool({
   user: 'postgres',
   host: 'localhost',
   database: 'Otvoreno racunarstvo vjezba',
   password: 'bazepodataka',
   port: 5432
});

module.exports = { pool };