
const express = require('express');
const Router = express.Router();

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

const checkAuth = require('./Auth/checkAuth');
const Auth = require('./Auth');
const Create = require('./Create');
const Read = require('./Read');
const Update = require('./Update');
const Delete = require('./Delete');

Router.post('/register', Auth);

Router.post('/', checkAuth, multipartMiddleware, Create);

Router.get('/:id', checkAuth, Read.one);
Router.get('/', checkAuth, Read.list);

Router.put('/', checkAuth, Update);
Router.delete('/:id', checkAuth, Delete);

module.exports = Router;
