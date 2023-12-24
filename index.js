const express = require("express");
require("dotenv").config();

const route = require("./routes/client/index.route");

const database = require("./config/database");

const app = express();
const port = process.env.PORT;

database.connect();

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

route(app);

app.listen(port, () => {
    console.log(`App is listening on ${port}`);
})