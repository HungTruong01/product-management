const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
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

//Flash
app.use(cookieParser("FHAFALKDJLSAD"));
app.use(session({cookie: {maxAge: 60000}}));
app.use(flash());

app.use(express.static("public"));

// App Local Variable
app.locals.prefixAdmin = systemConfig.prefixAdmin

routeAdmin(app);
route(app);

app.listen(port, () => {
    console.log(`App is listening on ${port}`);
})