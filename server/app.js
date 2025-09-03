const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const { route } = require('./routes/login.route');
const path = require('path');

app.use(cors());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "https:", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  })
);
app.use(express.json());

app.use("/api", route);

// Serve frontend build
app.use(express.static(path.join(__dirname, "public")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

module.exports = app;
