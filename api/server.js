const express = require('express')
const server = express()
const Users = require('./user-model')

server.use(express.json())

server.get('/', (req, res) => {
    res.status(200).json({ "hallo": "world"})
})

server.get('/users', (req, res) => {
    Users.get()
    .then(u => {
        res.json(u)
    }) .catch(error => {
        res.status(500).json(error);
    })
})

server.get('/users/:id', (req, res) => {
    Users.getById(req.params.id)
    .then(u => {
        res.json(u)
    }) .catch(error => {
        res.status(500).json(error);
    })
})

server.post('/users', (req, res) => {
    Users.create(req.body)
    .then(u => {
        res.json(u)
    }) .catch(error => {
        res.status(500).json(error);
    })
})
server.post('/users/:id', (req, res) => {
    Users.update(req.params.id, req.body)
    .then(u => {
        res.json(u)
    }) .catch(error => {
        res.status(500).json(error);
    })
})

module.exports = server