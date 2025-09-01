const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const {route} = require('./routes/login.route');

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api",route);
app.get('/',(req,res)=>{
    res.send("got response");
})


module.exports=app;