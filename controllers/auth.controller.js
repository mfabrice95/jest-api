const Validation = require("../class/Validation")
const Utilisateurs = require("../models/Utilisateurs")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

const login = async (req, res) => {
     try {
          const { EMAIL, MOT_DE_PASSE } = req.body
          const validation = new Validation(req.body, {
               EMAIL: {
                    required: true,
                    email: true
               },
               MOT_DE_PASSE: {
                    required: true
               }
          }, {
               EMAIL: {
                    required: "L'email est obligatoire",
                    email: "Email invalide"
               },
               MOT_DE_PASSE: {
                    required: "Le mot de passe est obligatoire"
               }
          })
          await validation.run()
          const isValid = await validation.isValidate()
          if (!isValid) {
               const errors = await validation.getErrors()
               return res.status(422).json({
                    message: "La validation des données a echouée",
                    data: errors
               })
          }
          const utilisateur = await Utilisateurs.findOne({
               attributes: ["ID_UTILISATEUR","NOM","PRENOM","MOT_DE_PASSE","IMAGE"],
              
               where: {
                    EMAIL: EMAIL
               }
          })
          if(utilisateur) {
               const isPasswordValid = await bcrypt.compare(MOT_DE_PASSE, utilisateur.toJSON().MOT_DE_PASSE)
               if(isPasswordValid) {
                    const payload = {
                              ID_UTILISATEUR: utilisateur.toJSON().ID_UTILISATEUR
                    }
                    console.log(payload)
                    const accessToken = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, { expiresIn: 259200 })
                    const { MOT_DE_PASSE: mdp, ...public } = utilisateur.toJSON()
                    res.status(200).json({
                         message: "Identifiants correct",
                         data: {
                              ...public,
                              token: accessToken
                         }
                    })
               } else {
                    res.status(403).json({
                         message: "Identifiants incorrects"
                    })
               }
          } else {
               res.status(403).json({
                    message: "Identifiants incorrects"
               })
          }

     } catch (error) {
          console.log(error)
          res.status(500).send("Erreur interne du serveur")
     }
}

module.exports = {
     login
}