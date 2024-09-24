import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import morgan from 'morgan';
import blogRoutes from './routes/blogRoutes.js'

const app = express();
const DB_URL = process.env.DB_URL === "test"
? "mongodb://localhost:27017/api-blog-test"
: process.env.DB_URL || "mongodb://localhost:27017/api-blog";

mongoose.connect(DB_URL)
.then(() => console.log(`conected to ${DB_URL}`))
.catch(err => console.error("Failed to conect to MongoDB", err));

//middlewares
app.use(morgan('dev'));
app.use(express.json());

app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
})

app.get('/', (req, res) =>{
    res.status(200).send('My first API blog');
});

app.use('/api/', blogRoutes);

export default app;