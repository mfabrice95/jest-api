const Publication = require('../models/Publications')
const Utilisateurs = require('../models/Utilisateurs')
const Validation = require('../class/Validation')
const PublicationsUpload = require('../class/uploads/PublicationUpload')
const IMAGES_DESTINATIONS = require("../constants/IMAGES_DESTINATIONS")
const path = require("path")


const ajoutpubli = async (req, res) => {
    try {
        const { ID_UTILISATEUR, TITLE,DESCRIPTION, DATE_PUBLICATION } = req.body
        const { IMAGE } = req.files || {}
        const data = {
            ...req.body,
            ...req.files
        }
        const validation = new Validation(data, {
            ID_UTILISATEUR: {
                required: true,
                number: true,
                exists: 'utilisateurs,ID_UTILISATEUR'
            },

            TITLE: {
                required: true,
                
            },
            DESCRIPTION: {
                required: true,
            },
               DATE_PUBLICATION: {
                 required: true,
                //  date: "DD/MM/YYYY"
             },
        },{
            ID_UTILISATEUR: {
                required: "le champ est obligatoire",
                number: "L' ID doit contenir des caractères numériques",
                exists: 'n\'existe pas'
            },
            TITLE: {
                required: "Ce champ est obligatoire",
           },
           DESCRIPTION: {
            required: "Ce champ est obligatoire"
        },
        IMAGE: {
            required: "L'image est obligatoire",
            image: "L'image est valide",
            size: "Image trop volumineuse (max: 2Mo)"
           },
        })
        await validation.run()
        const isValid = await validation.isValidate()
        if(!isValid) {
             const errors = await validation.getErrors()
             return res.status(422).json({
                  message: "La validation des données a echouée",
                  data: errors
             })
        }
         const publicationUpload = new PublicationsUpload()
         const fichier = await publicationUpload.upload(IMAGE)
          const imageUrl = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.publications}${path.sep}${fichier.fileInfo.fileName}`
        const newpublication = await Publication.create({
            ID_UTILISATEUR,
            TITLE, 
            DESCRIPTION, 
            DATE_PUBLICATION,
            IMAGE: imageUrl
            
            
        })
        res.status(201).json({
            message: "publication enregistré avec succes",
            data: newpublication
        })
    } catch (error){
        console.log(error)
        res.status(500).send("Erreur interne du serveur")
    }
}
const getmypubli = async (req, res) => {
    try {
        const publications = await Publication.findAll({
            include: {
                model: Utilisateurs,
                as: 'utilisateur',
                // required: true,
                attributes : ['NOM', 'PRENOM']
             
           },  
           where: {
                ID_UTILISATEUR: req.userId
           }       
           
        })
        
        res.status(200).json(publications)
    } catch (error){
        res.status(500).send("Erreur interne du serveur")
    }

}
const findByid = async (req, res) => {
    try{
        const { ID_PUBLICATION } = req.params
        const publications = await Publication.findOne({
        //     include: {
        //         model: Utilisateurs,
        //         as: 'utilisateur',
        //    },
            where: {
                ID_PUBLICATION: ID_PUBLICATION

            }
        })
        res.status(200).json(publications)
        } catch (error){
            console.log(error)
            res.status(500).send("erreur interne du serveur")
        }
}
const modifierpubli = async (req, res) => {
    try{
        const { ID_PUBLICATION } = req.params
        const { ID_UTILISATEUR, TITRE, DESCRIPTION, DATE_PUBLICATION} = req.body
         await Publication.update({
            ID_UTILISATEUR, 
            TITRE, 
            DESCRIPTION, 
            DATE_PUBLICATION,
        },{
            where: {
                ID_PUBLICATION: ID_PUBLICATION
            }
        })
        res.status(200).json({
            message: "modification reussi",
            data: {
                ID_UTILISATEUR,
                TITRE, 
                DESCRIPTION, 
                DATE_PUBLICATION
            }
        })
    }catch (error){
        console.log(error)
        res.status(500).send("erreur interne du serveur")
    }
}
const supprimerpubli = async (req, res) => {
    try{
        const { ID_PUBLICATION } = req.params
        await Publication.destroy({
            where: {
                ID_PUBLICATION: ID_PUBLICATION
            }
        })
        res.status(200).json({
            message: "Suppression reussi",
        })
    } catch (error){
        console.log(error)
        res.status(500).send("erreur interne du serveur")
    }
}

module.exports = {
    ajoutpubli,
    getmypubli,
    findByid,
    modifierpubli,
    supprimerpubli
}