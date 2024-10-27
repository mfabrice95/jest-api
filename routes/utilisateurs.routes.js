const express = require("express");
const utilisateurs_routes = express.Router();
const utilisateurs_controller = require("../controllers/utilisateurs.controller");
const requireAuth = require("../middlewares/requireAuth");

utilisateurs_routes.post("/create", utilisateurs_controller.createUtilisateur);
utilisateurs_routes.get("/all", utilisateurs_controller.getusers);
utilisateurs_routes.get('/getOne/:ID_UTILISATEUR', utilisateurs_controller.findByid)
utilisateurs_routes.put('/update/:ID_UTILISATEUR', utilisateurs_controller.modifieruser)
utilisateurs_routes.delete('/delete/:ID_UTILISATEUR', utilisateurs_controller.supprimeruser)

module.exports = utilisateurs_routes;
