
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./cors')
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const Locations = require('../models/locations');
const Tickets = require('../models/tickets');
const locationRouter = express.Router();
locationRouter.use(bodyParser.json());
locationRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200 })
    .get(cors.cors, (req, res, next) => {
        //find method from mongoose
        Locations.find(req.query)
            .then((locations) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(locations)// it takes as input json string and send it to client as json response
            }, (err) => next(err))
            .catch((err) => next(err)); //if error eeturn pass to over all error handeler of application
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Locations.create(req.body)
            .then((location) => {
                console.log('Location Created', location);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(location)
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.sendStatus = 403;
        res.end("PUT operation not supported in locations");
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Tickets.find({})
            .then((tickets) => {
                if (tickets != null) {
                    var err = new Error(`You can't delete all, because some locations are in tickets!`);
                    err.status = 500;
                    next(err)
                }
                else {
                    Locations.remove({})
                        .then((resp) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(resp)
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });
locationRouter.route('/:locationId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200 })
    .get(cors.cors, (req, res, next) => {
        Locations.findById(req.params.locationId)
            .then((location) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(location)
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.sendStatus = 403;
        res.end("POS operation not supported in locations/" + req.params.locationId);

    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Locations.findByIdAndUpdate(req.params.locationId, {
            $set: req.body
        }, { new: true })// return the updated location
            .then((location) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(location)
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Tickets.findOne({ from: req.params.locationId })
            .then((ticket) => {
                if (ticket != null) {
                    var err = new Error(`You can't delete this location, it's used in tickets!`);
                    err.status = 500;
                    next(err)
                }
                else {
                    Tickets.findOne({ to: req.params.locationId })
                        .then((ticket) => {
                            if (ticket != null) {
                                var err = new Error(`You can't delete this location, it's used in tickets!`);
                                err.status = 500;
                                next(err)
                            }
                            else {
                                Locations.findByIdAndRemove(req.params.locationId)
                                    .then((resp) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(resp)
                                    }, (err) => next(err))
                                    .catch((err) => next(err));
                            }
                        }, (err) => next(err))
                        .catch((err) => next(err));

                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

module.exports = locationRouter;

