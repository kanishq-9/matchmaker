const express = require('express');
const {
  getUserLoginHtml,
  getUser,
  getSingleUser,
  getAiUser,
  getAdvancedAiUser,
  getEmailPrompt,
  setNotes
} = require("./login.controller");

const route = express.Router();

route.post('/login', getUserLoginHtml);
route.post('/user', getUser);
route.post('/sendmail', getEmailPrompt);
route.post('/notes', setNotes);

// Specific first
route.get("/ai/:id", getAiUser);
route.get("/google/ai/:id", getAdvancedAiUser);

// Generic last
route.get("/:id", getSingleUser);

module.exports = { route };
