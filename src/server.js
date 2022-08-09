import express from "express";
import bodyParser from "body-parser";
import viewEngine from './config/viewEngine';
import initWebRoutes from './route/web';
import connectDB from './config/connectDB';
require('dotenv').config();

const app = express();

//config app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

viewEngine(app);
initWebRoutes(app);

connectDB().then(r => console.log(r));

//port === undefined => port = 2018
const port = process.env.PORT || 2018;

app.listen(port, () => {
    console.log('Backend NodeJS is running on port ' + port);
});