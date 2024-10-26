const express = require("express")
const upload_routes = express.Router("")
const upload_controller = require("../controllers/upload.controller")

upload_routes.post("/fichier", upload_controller.uploadFicher)

module.exports = upload_routes