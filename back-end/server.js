const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const { Parser } = require('json2csv');

const app = express();

app.use(express.static(path.join(__dirname)));

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Otvoreno racunarstvo vjezba',
  password: 'bazepodataka',
  port: 5432
});

async function filtrirano(search, atribut) {
  const rezultat = await pool.query(`SELECT * FROM zupanije NATURAL JOIN gradovi`);

  let redovi = rezultat.rows;

  if (search) {
    const searchLower = search.toLowerCase();
    redovi = redovi.filter(red => {
      if (atribut === "svi") {
        return Object.values(red).some(vrijednost =>
          String(vrijednost).toLowerCase().includes(searchLower)
        );
      } else {
        return String(red[atribut]).toLowerCase().includes(searchLower);
      }
    });
  }

  return redovi;
};

app.get('/api', async (req, res) => {
  try {
    const { search = "", atribut = "svi" } = req.query;
    const redovi = await filtrirano(search, atribut);
    res.json(redovi);
  } catch (err) {
    console.error(err);
    res.status(500).send("Greška pri generiranju JSON-a");
  }
});

app.get('/api/csv', async (req, res) => {
  try {
    const { search = "", atribut = "svi" } = req.query;
    const redovi = await filtrirano(search, atribut);

    const parser = new Parser();
    const csv = parser.parse(redovi);

    res.header("Content-Type", "text/csv");
    res.attachment("podaci.csv");
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).send("Greška pri generiranju CSV-a");
  }
});

app.listen(3000);
