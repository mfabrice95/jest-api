// Le code importe le module Express.js et le stocke dans la variable express
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");

// creation d'Une instance de l'application.
//Cette instance représente l'application web
const app = express();
const dotenv = require("dotenv");
const utilisateurs_routes = require("./routes/utilisateurs.routes");
const publications_routes = require("./routes/publication.routes");
const upload_routes = require("./routes/upload.routes");
const auth_routes = require("./routes/auth.routes");
const bindUser = require("./middlewares/bindUser");
dotenv.config();

const PORT = process.env.PORT;

//connfuguration d'un port d'ecoute
//le port sur lequel le server ecoutera
// const PORT = 8080;
var corsOptions = {
  origin: "http://localhost:5173",
};

app.use(cors(corsOptions));

// Middleware intégré pour le traitement des données JSON
app.use(express.json());

// Middleware intégré pour le traitement des formulaires HTML
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.use(fileUpload());

//middleware specifique a une route
app.all("*", bindUser);
app.use("/", utilisateurs_routes);
app.use("/", publications_routes);
app.use("/upload", upload_routes);
app.use("/auth", auth_routes);

//definition d'une route pour la methode HTTP GET sur la racine de l'application
app.get("/", (req, res) => {
  res.send("Bienvenu dans votre application");
});

//lancement de serveur
app.listen(PORT, () => {
  console.log(`le serveur ecoute sur le port ${PORT}`);
});
