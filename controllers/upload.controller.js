const path = require("path")

const uploadFicher = async (req, res) => {
     try {
          if (req.files) {
               const fichier = req.files.fichier
               const dossier = path.resolve('./') + path.sep + 'public' + path.sep
               const nomFichier = fichier.name
               const destination = dossier + nomFichier
               await fichier.mv(destination)
               res.status(200).json({ 
                    message: "Votre fichier a été enregistré"   
               })
          } else {
               res.status(422).send("Aucun fichier envoyé")
          }
     } catch (error) {
          console.log(error)
          res.status(500).send("Erreur interne du serveur")
     }
}
module.exports = {
     uploadFicher
}
