

const cluster = require('cluster');

if (cluster.isMaster) {

  cluster.fork();

  cluster.on('disconnect', (worker) => {
    console.error(`Worker ${worker.id} disconnected`);
    cluster.fork();
  });

} else {
  

  const domain = require('domain');



  const debug = require("debug")("index");
  const express = require("express");
  const fileUpload = require("express-fileupload");
  const pg = require("pg");
  const cors = require("cors");

  const pool = new pg.Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    ssl: false
  });  

  // Config files
  const ConfServ = require("./config/ConfServ");
  const i18n = require("i18n-2");

  const ControllerLibrary = require("./controller/ControllerLibrary");

  const access = require("./middlewares/accessControl");

  //Used for swagger
  const swaggerUI = require("swagger-ui-express");
  const openApiDocumentation = require("./doc/API/openApiDocumentation");

  var app = express();

  // Domain
  app.use((req, res, next) => {
    const d = domain.create();
    d.on('error', (er) => {
      debug(`error ${er.stack}`);
      try {
        // Make sure we close down within 30 seconds
        debug("Killing process in 30s")
        const killtimer = setTimeout(() => {
          process.exit(1);
        }, 30000);
        // But don't keep the process open just for that!
        killtimer.unref();
        cluster.worker.disconnect();

        // Try to send an error to the request that triggered the problem
        res.statusCode = 500;
        res.end('Oops, there was a problem!');
      } catch (er2) {
        // Oh well, not much we can do at this point.
        debug(`Error sending 500! ${er2.stack}`);
      }
    });

    
    d.add(req);
    d.add(res);

    // Now run the handler function in the domain.
    d.run(() => {
      next()
    });
  })

  //Used for swagger
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(openApiDocumentation));

  
  // Init static routes
  app.use("/css", express.static(__dirname + "/static/css"));
  app.use("/img", express.static(__dirname + "/static/img"));
  app.use("/js", express.static(__dirname + "/static/js"));
  app.use("/files", express.static(__dirname + "/static/files"));

  //CORS:
  app.all("*", (req, res, next) => {
    debug("origin " + req.get('origin'))
    next()
  })

  // Debug function
  app.all("*", function (req, rep, next) {
    debug(req.method + " " + req.url);
    next();
  });

  app.use(
    cors({
      origin: process.env.REACT_APP_FRONT_URL.slice(0, -1), // remove slash at the end
      methods: ["POST", "PUT", "GET", "DELETE", "OPTIONS", "HEAD"],
      credentials: true
    })
  );

  

  // MORE RECENT Middleware PARSERS
  app.use(express.json({ limit: "1mb" })); // <==== parse request body as JSON
  app.use(
    express.urlencoded({
      extended: true
    })
  );

  app.use(fileUpload());

  i18n.expressBind(app, {

    // setup some locales - other locales default to vi silently
    locales: ["en", "fr"],

    // set the default locale
    defaultLocale: "en",
    directory: "./locale",
    extension: ".json"
  });

  // Application middleware
  // This middleware will fire for any incoming request

  // Setting a default locale
  app.use(function (req, res, next) {
    req.i18n.setLocale(req.headers["content-language"]);
    next();
  });

  // Init view engine
  app.set("view engine", "ejs");
  app.set("views", __dirname + "/view");

  debug("Booting app");

  //debug("Booting ShellOnYou app");

  // ========== Download ==========
  // Get PlageLib.py
  app.get("/lib/getPlagePythonLib", function (req, res) {
    ControllerLibrary.getPlageLibPy(req, res);
  });

  // ---------- ExerciseProduction Routes ----------
  app.use(require("./routes/exerciseProduction"));

  // ---------- StudentStatement routes ----------
  app.use(require("./routes/studentStatement"));

  // ---------- No Cookies ----------
  app.get("/noCookies", function (req, res) {
    res.render("common/noCookies.ejs");
  });

  // ---------- Default route / Error 404 ----------
  
  app.use(function (req, res) {
    debug("UNEXPECTED ROUTE");
    res.status(404);
    res.render("Error/404", { pageTitle: "Resource not found" });
  });

  // ---------- Start server ----------
  app.listen(process.env.MS_PORT || 5001, function () {
    debug("ICWS 2024 App back listening on port " + (process.env.MS_PORT || 5001));
    require("./model/ModelDB");
  });
}
