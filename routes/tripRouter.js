const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate')
const mongoose = require('mongoose');
const Trips = require('../models/trips');
const cors = require('./cors');
const tripRouter = express.Router();
tripRouter.use(bodyParser.json());
tripRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200 })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        //find method from mongoose
        Trips.find({ passenger: req.user._id })
            .populate('ticketId')
            .then((trips) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(trips)// it takes as input json string and send it to client as json response
            }, (err) => next(err))
            .catch((err) => next(err)); //if error eeturn pass to over all error handeler of application
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        req.body.passenger = req.user._id;
        Trips.create(req.body)
            .then((trip) => {
                console.log('Trip Created', trip);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(trip)
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.sendStatus = 403;
        res.end("PUT operation not supported in trips");
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Trips.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp)
            }, (err) => next(err))
            .catch((err) => next(err));
    });
tripRouter.route('/:tripId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200 })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Trips.findById(req.params.tripId)
            .populate('ticketId')
            .then((trip) => {
                if (trip != null && !trip.passenger.equals(req.user._id)) {
                    err = new Error("You are not authorized to view this trip ")
                    err.status = 403;
                    return next(err);
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(trip)

            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.sendStatus = 403;
        res.end("POS operation not supported in trips/" + req.params.tripId);

    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        Trips.findById(req.params.tripId)
            .then((trip) => {
                if (trip != null) {
                    if (!trip.passenger.equals(req.user._id)) {
                        err = new Error("You are not authorized to update this trip ")
                        err.status = 403;
                        return next(err);
                    }
                    else {
                        if (req.body.ticketId) {
                            trip.ticketId = req.body.ticketId;
                        }
                        trip.save()
                            .then((trip) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(trip)
                            }, (err) => next(err))
                            .catch((err) => next(err));
                    }
                }
                else {
                    err = new Error('Trip ' + req.params.tripId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));

    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Trips.findById(req.params.tripId)
            .then((trip) => {
                if (trip != null) {
                    if (!trip.passenger.equals(req.user._id)) {
                        err = new Error("You are not authorized to delete this trip ")
                        err.status = 403;
                        return next(err);
                    }
                    trip.remove();
                    trip.save()
                        .then((resp) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(resp)
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
                else {
                    err = new Error('Trip ' + req.params.tripId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

module.exports = tripRouter;

