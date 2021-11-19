const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate')
const mongoose = require('mongoose');
const Cards = require('../models/cards')
const cors = require('./cors')
const cardRouter = express.Router();
cardRouter.use(bodyParser.json());
cardRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200 })
    .get(cors.cors, (req, res, next) => {
        //find method from mongoose
        Cards.find(req.query)
            .then((cards) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(cards)// it takes as input json string and send it to client as json response
            }, (err) => next(err))
            .catch((err) => next(err)); //if error eeturn pass to over all error handeler of application
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Cards.create(req.body)
            .then((card) => {
                console.log('card Created', card);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(card)
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.sendStatus = 403;
        res.end("PUT operation not supported in cards");
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Cards.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp)
            }, (err) => next(err))
            .catch((err) => next(err));
    });
cardRouter.route('/:cardId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200 })
    .get(cors.cors, (req, res, next) => {
        Cards.findById(req.params.cardId)
            .then((card) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(card)
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.sendStatus = 403;
        res.end("POS operation not supported in cards/" + req.params.cardId);

    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Cards.findByIdAndUpdate(req.params.cardId, {
            $set: req.body
        }, { new: true })// return the updated card
            .then((card) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(card)
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Cards.findByIdAndRemove(req.params.cardId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp)
            }, (err) => next(err))
            .catch((err) => next(err));
    })

module.exports = cardRouter;

