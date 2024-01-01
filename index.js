const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require('body-parser');
require("dotenv").config();

const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");

const systemConfig = require("./config/system")

const database = require("./config/database");

database.connect();

const app = express();
const port = process.env.PORT;

app.use(methodOverride("_method"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

// App Local Variable
app.locals.prefixAdmin = systemConfig.prefixAdmin

routeAdmin(app);
route(app);

app.listen(port, () => {
    console.log(`App is listening on ${port}`);
})