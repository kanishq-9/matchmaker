const express = require('express');
const {getUserLoginHtml, getUser, getSingleUser} = require(`./login.controller`);
const route = express.Router();

route.post('/login', getUserLoginHtml);
route.post('/user', getUser);
route.get("/:id",getSingleUser);


module.exports={route};