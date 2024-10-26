const express = require("express");
const utilisateurs_routes = express.Router();
const utilisateurs_controller = require("../controllers/utilisateurs.controller");
const requireAuth = require("../middlewares/requireAuth");

utilisateurs_routes.post("/users", utilisateurs_controller.createUtilisateur);
utilisateurs_routes.get("/users", utilisateurs_controller.getusers);
// utilisateurs_routes.get('/users/:ID_UTILISATEUR', utilisateurs_controller.findByid)
// utilisateurs_routes.put('/users/:ID_UTILISATEUR', utilisateurs_controller.modifieruser)
// utilisateurs_routes.delete('/users/:ID_UTILISATEUR', utilisateurs_controller.supprimeruser)

module.exports = utilisateurs_routes;
