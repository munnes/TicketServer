
const express = require('express');
const cors = require('cors');
const { model } = require('mongoose');
const app = express();

const whitelist = ['http://localhost:3000', 'https://localhost:3443','http://SISLaptop:3001','http://localhost:3001'];
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };// allow origin to access
    }
    else {
        corsOptions = { origin: false };//access to allow origin not return
    }
    callback(null, corsOptions);
};

exports.cors=cors();// with *

exports.corsWithOptions=cors(corsOptionsDelegate);

