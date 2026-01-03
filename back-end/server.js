const express = require("express");
const path = require("path");
const routes = require("./routes.js");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.use("/api/v1", routes);

app.use((req, res) => {
    res.status(404).json({
        status: "Not Found",
        message: "Endpoint does not exist",
        response: null
    });
});

app.listen(3000, () => {
   console.log("Server running on http://localhost:3000");
});