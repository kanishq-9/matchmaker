const express = require('express');
const {
  getUserLoginHtml,
  getUser,
  getSingleUser,
  getAiUser,
  getAdvancedAiUser,
  getEmailPrompt,
  setNotes,
  getJourney,
  getJourneyUpdated,
  getJourneyAll
} = require("./login.controller");

const route = express.Router();

route.post('/login', getUserLoginHtml);
route.post('/user', getUser);
route.post('/sendmail', getEmailPrompt);
route.post('/notes', setNotes);
route.post("/journey/update", getJourneyUpdated);
route.post("/journey/all", getJourneyAll);
route.post("/journey", getJourney);

route.get("/ai/:id", getAiUser);
route.get("/google/ai/:id", getAdvancedAiUser);

route.get("/:id", getSingleUser);

module.exports = { route };
