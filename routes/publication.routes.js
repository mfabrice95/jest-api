const express = require('express')
const publications_routes = express.Router();
const publications_controller = require('../controllers/publications.controller')
const requireAuth = require("../middlewares/requireAuth")

publications_routes.post('/publications', publications_controller.ajoutpubli);
publications_routes.get('/publications', requireAuth, publications_controller.getmypubli);
publications_routes.get('/publications/:ID_PUBLICATION', requireAuth, publications_controller.findByid)
publications_routes.put('/publications/:ID_PUBLICATION', requireAuth, publications_controller.modifierpubli)
publications_routes.delete('/publications/:ID_PUBLICATION', requireAuth, publications_controller.supprimerpubli)


module.exports = publications_routes