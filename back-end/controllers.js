const pool = require("./pool").pool;
const e = require("express");
const { Parser } = require("json2csv");

function ok(res, code, codeMessage, message, data) {
   res.status(code).json({
      status: codeMessage,
      message,
      response: data
   });
}

function fail(res, code, codeMessage, message) {
   res.status(code).json({
      status: codeMessage,
      message,
      response: null
   });
}

async function getFiltered(search, atribut) {
   const r = await pool.query(
      "SELECT * FROM zupanije NATURAL JOIN gradovi ORDER BY ime_zupanije, ime_grada"
   );

   let rows = r.rows;

   if (search) {
      const s = search.toLowerCase();
      rows = rows.filter(row =>
         atribut === "svi"
         ? Object.values(row).some(v =>
               String(v).toLowerCase().includes(s)
            )
         : String(row[atribut]).toLowerCase().includes(s)
      );
   }

   return rows;
}

exports.getZupanije = async (req, res) => {
   try {
      const r = await pool.query(
         "SELECT ime_zupanije FROM zupanije ORDER BY ime_zupanije"
      );

      let rows = r.rows;
      ok(res, 200, "OK", "Dohvaćene županije", rows);
   } catch {
      fail(res, 500, "Internal Server Error", "Internal Server Error");
   }
};

exports.getGradovi = async (req, res) => {
   try {
      const r = await pool.query(
         "SELECT * FROM zupanije NATURAL JOIN gradovi ORDER BY ime_zupanije, ime_grada"
      );

      let rows = r.rows;
      ok(res, 200, "OK", "Dohvaćeni gradovi", rows);
   } catch {
      fail(res, 500, "Internal Server Error", "Internal Server Error");
   }
};

exports.getByIme = async (req, res) => {
   try {
      const ime = req.params.ime;
      const r = await pool.query(
         "SELECT * FROM zupanije NATURAL JOIN gradovi WHERE ime_grada = $1",
         [ime]
      );
      if (r.rows.length === 0) {
         fail(res, 404, "Not Found", "Grad nije pronađen");
         return;
      }
      ok(res, 200, "OK", "Dohvaćen grad", r.rows);
   } catch {
      fail(res, 500, "Internal Server Error", "Internal Server Error");
   }
};

exports.getFiltrirano = async (req, res) => {
   try {
      const { search = "", atribut = "svi" } = req.query;
      const rows = await getFiltered(search, atribut);
      if (rows.length === 0) {
         fail(res, 404, "Not Found", "Nema podataka koji odgovaraju kriterijima pretraživanja");
         return;
      }
      ok(res, 200, "OK", "Dohvaćeni filtrirani podaci", rows);
   } catch {
      fail(res, 500, "Internal Server Error", "Internal Server Error");
   }
};

exports.getJson = async (req, res) => {
   try {
      const { search = "", atribut = "svi" } = req.query;
      const rows = await getFiltered(search, atribut);
      ok(res, 200, "OK", "Dohvaćen JSON", rows);
   } catch {
      fail(res, 500, "Internal Server Error", "Internal Server Error");
   }
};

exports.getCsv = async (req, res) => {
   try {
      const { search = "", atribut = "svi" } = req.query;
      const rows = await getFiltered(search, atribut);

      const parser = new Parser();
      const csv = parser.parse(rows);

      ok(res, 200, "OK", "Dohvaćen CSV", csv);
   } catch {
      fail(res, 500, "Internal Server Error", "Internal Server Error");
   }
};

exports.createGrad = async (req, res) => {
   try {
      const { ime_grada, ime_zupanije } = req.body;

      const r = await pool.query(
         "SELECT * FROM zupanije NATURAL JOIN gradovi WHERE ime_grada = $1",
         [ime_grada]
      );
      if (r.rows.length !== 0) {
         fail(res, 409, "Conflict", "Grad već postoji");
         return;
      }

      const r2 = await pool.query(
         "INSERT INTO gradovi (ime_grada, ime_zupanije) VALUES ($1, $2) RETURNING *",
         [ime_grada, ime_zupanije]
      );
      ok(res, 201, "OK", "Grad uspješno dodan", r2.rows[0]);
   } catch (err) {
      fail(res, 500, "Internal Server Error", "Internal Server Error");
   }
};

exports.updateGrad = async (req, res) => {
   try {
      const ime_grada_staro = req.params.ime;
      const { ime_grada_novo } = req.body;
      const r = await pool.query(
         "UPDATE gradovi SET ime_grada = $1 WHERE ime_grada = $2 RETURNING *",
         [ime_grada_novo, ime_grada_staro]
      );
      if (r.rows.length === 0) {
         fail(res, 404, "Not Found", "Grad ne postoji");
         return;
      }
      ok(res, 200, "Created", "Grad uspješno ažuriran", r.rows[0]);
   } catch (err) {
      fail(res, 500, "Internal Server Error", "Internal Server Error");
   }
};

exports.deleteGrad = async (req, res) => {
   try {
      const ime_grada = req.params.ime;
      const r = await pool.query(
         "DELETE FROM gradovi WHERE ime_grada = $1 RETURNING *",
         [ime_grada]
      );
      if (r.rows.length === 0) {
         fail(res, 404, "Not Found", "Grad ne postoji");
         return;
      }
      ok(res, 200, "OK", "Grad uspješno uklonjen", r.rows[0]);
   } catch (err) {
      fail(res, 500, "Internal Server Error", "Internal Server Error");
   }
};

module.exports = exports;