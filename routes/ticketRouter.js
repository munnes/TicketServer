
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./cors')
const mongoose = require('mongoose');
const Tickets = require('../models/tickets')
const Trips = require('../models/trips')
const authenticate = require('../authenticate')
const ticketRouter = express.Router();
ticketRouter.use(bodyParser.json());
ticketRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200 })
    .get(cors.cors, (req, res, next) => {
        //find method from mongoose
        Tickets.find(req.query)
            .populate('from')
            .populate('to')
            .then((tickets) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(tickets)// it takes as input json string and send it to client as json response
            }, (err) => next(err))
            .catch((err) => next(err)); //if error eeturn pass to over all error handeler of application
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Tickets.findOne({ from: req.body.from, to: req.body.to })
            .then((ticket) => {
                if (ticket != null) {
                    var err = new Error('Ticket already added!');
                    err.status = 500;
                    next(err)
                }
                else {
                    Tickets.create(req.body)
                        .then((ticket) => {
                            console.log('Ticket Created', ticket);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(ticket)
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
            }, (err) => next(err))
            .catch((err) => next(err));

    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.sendStatus = 403;
        res.end("PUT operation not supported in tickets");
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Trips.find({})
            .then((trips) => {
                if (trips != null) {
                    var err = new Error(`You can't delete all, because some tickets are in  trips!`);
                    err.status = 500;
                    next(err);
                }
                else {
                    Tickets.remove({})
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
ticketRouter.route('/:ticketId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200 })
    .get(cors.cors, (req, res, next) => {
        Tickets.findById(req.params.ticketId)
            .then((ticket) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(ticket)
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.sendStatus = 403;
        res.end("POS operation not supported in tickets/" + req.params.ticketId);

    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Tickets.findByIdAndUpdate(req.params.ticketId, {
            $set: req.body
        }, { new: true })// return the updated ticket
            .then((ticket) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(ticket)
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Trips.findOne({ ticketId: req.params.ticketId })
            .then((trip) => {
                if (trip != null) {
                    var err = new Error(`You can't delete this ticket, it's used in trips!`);
                    err.status = 500;
                    next(err)
                }
                else {
                    Tickets.findByIdAndRemove(req.params.ticketId)
                        .then((resp) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(resp)
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
            }, (err) => next(err))
            .catch((err) => next(err));


    })

module.exports = ticketRouter;

