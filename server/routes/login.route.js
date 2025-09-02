const express = require('express');
const {getUserLoginHtml, getUser, getSingleUser,getAiUser, getEmailPrompt} = require(`./login.controller`);
const route = express.Router();

route.post('/login', getUserLoginHtml);
route.post('/user', getUser);
route.post('/sendmail', getEmailPrompt);
route.get("/:id",getSingleUser);
route.get("/ai/:id",getAiUser);


module.exports={route};