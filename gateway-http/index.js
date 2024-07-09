
const express = require("express");
const app = express();
const cors = require('cors');
const httpProxy = require('http-proxy');

app.use(
  cors({
    origin: process.env.REACT_APP_FRONT_URL.slice(0, -1),
    methods: ["POST", "PUT", "GET", "DELETE", "OPTIONS", "HEAD"],
    credentials: true
  })
);



var apiProxy = httpProxy.createProxyServer();

app.use("/api/exercise-production", function (req, res) {
  apiProxy.web(req, res, { target: 'http://ms-exercise:' + process.env.PORT + "/api/exercise-production" }, (err) => {})
});

app.use("/api/student-statement", function (req, res) {
  apiProxy.web(req, res, { target: 'http://ms-exercise:' + process.env.PORT + "/api/student-statement" }, (err) => {})
});

app.use("/", function (req, res) {
  apiProxy.web(req, res, { target: 'http://ms-other:' + process.env.PORT }, (err) => {})
});

app.listen(8080, () => {
  console.log('ICWS 2024 App listening on port 8080');
});
