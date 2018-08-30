import express from 'express'
import devBundle from './devBundle' // Only for development purposes
import path from 'path'
import template from './../template'
import {MongoClient} from 'mongodb'
import config from './../config/config'
import app from './express'
import mongoose from 'mongoose'


devBundle.compile(app); // Only for development purposes

const CURRENT_WORKING_DIR = process.cwd();
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, '/dist')));


app.get('/', (req, res) => {
    res.status(200).send(template())
});


app.listen(config.port, function onStart(err) {
    if (err) {
        console.log(err);
    }
    console.info('Server started on port %s.', config.port);
});

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUri);

mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${mongoUri}`)
});
