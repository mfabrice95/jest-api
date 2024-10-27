const express = require('express')
const all_utilisateur_router = express.Router()
const all_utilisateur_routes = require("./utilisateurs.routes")

all_utilisateur_router.use('/', all_utilisateur_routes)

module.exports = all_utilisateur_router