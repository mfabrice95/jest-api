const Utilisateurs = require("../models/Utilisateurs");
const Validation = require("../class/Validation");
const UtilisateurUpload = require("../class/uploads/UtilisateurUpload");
const IMAGES_DESTINATIONS = require("../constants/IMAGES_DESTINATIONS");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const createUtilisateur = async (req, res) => {
  try {
    const { NOM, PRENOM, TELEPHONE, DATE_NAISSANCE, EMAIL, MOT_DE_PASSE } =
      req.body;
    // const { IMAGE } = req.files || {};
    const data = {
      ...req.body,
      // ...req.files,
    };

    const validation = new Validation(
      data,
      {
        NOM: {
          required: true,
          alpha: true,
          length: [2, 20],
        },
        PRENOM: {
          required: true,
          alpha: true,
          length: [2, 20],
        },
        TELEPHONE: {
          required: true,
          number: true,
          length: [8, 20],
        },

        DATE_NAISSANCE: {
          required: true,
        },
        // IMAGE: {
        //   // required: true,
        //   image: 2000000,
        // },
        EMAIL: {
          required: true,
          email: true,
        },
        EMAIL: {
          required: true,
          email: true,
          unique: "utilisateurs,EMAIL",
        },
        MOT_DE_PASSE: {
          required: true,
          length: [8],
        },
      },
      {
        NOM: {
          required: "Ce champ est obligatoire",
          alpha: "Le nom doit contenir des caractères alphanumériques",
          length: "Le nom doit comporter entre 2 et 20 caractères",
        },
        PRENOM: {
          required: "Ce champ est obligatoire",
          alpha: "Le prénom doit contenir des caractères alphanumériques",
          length: "Le prénom doit comporter entre 2 et 20 caractères",
        },
        TELEPHONE: {
          required: "Le profil est obligatoire",
          number: "Ce champ doit contenir un nombre valide",
          length: "Le nom doit comporter entre 2 et 20 caractères",
        },
        DATE_NAISSANCE: {
          required: "ce champ est obligatoire",
        },
        // IMAGE: {
        //   // required: "L'image de l'utilisateur est obligatoire",
        //   image: "L'image est valide",
        //   size: "Image trop volumineuse (max: 2Mo)",
        // },
        EMAIL: {
          required: "L'email est obligatoire",
          email: "Email invalide",
          unique: "Email déjà utilisé",
        },
        MOT_DE_PASSE: {
          required: "Le mot de passe est obligatoire",
          length: "Le mot de passe doit contenir au moins 8 caracteres",
        },
      }
    );
    await validation.run();
    const isValid = await validation.isValidate();
    if (!isValid) {
      const errors = await validation.getErrors();
      return res.status(422).json({
        message: "La validation des données a echouée",
        data: errors,
      });
    }
    // const utilisateurUpload = new UtilisateurUpload();
    // const fichier = await utilisateurUpload.upload(IMAGE);
    // const imageUrl = `${req.protocol}://${req.get("host")}${
    //   IMAGES_DESTINATIONS.utilisateurs
    // }${path.sep}${fichier.fileInfo.fileName}`;

    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(MOT_DE_PASSE, salt);
    const newuser = await Utilisateurs.create({
      NOM: NOM,
      PRENOM: PRENOM,
      TELEPHONE: TELEPHONE,
      DATE_NAISSANCE: DATE_NAISSANCE,
      EMAIL: EMAIL,
      MOT_DE_PASSE: password,
      // IMAGE: imageUrl,
    });
    const payload = {
      ID_UTILISATEUR: newuser.toJSON().ID_UTILISATEUR,
    };
    const accessToken = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
      expiresIn: 259200,
    });
    const { MOT_DE_PASSE: mdp, ...public } = newuser.toJSON();
    res.status(201).json({
      message: "utilisateurs enregistré avec succes",
      data: {
        ...public,
        token: accessToken,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Erreur interne du serveur");
  }
};
const getusers = async (req, res) => {
  try {
    const utilisateurs = await Utilisateurs.findAll();

    res.status(200).json(utilisateurs);
  } catch (error) {
    console.log(error)
    res.status(500).send("Erreur interne du serveur");
  }
};
module.exports = {
  createUtilisateur,
  getusers,
  // findByid,
  // modifieruser,
  // supprimeruser
};
