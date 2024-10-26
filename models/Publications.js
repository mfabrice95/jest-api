const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize');
const Utilisateurs = require('./Utilisateurs');


const Publication = sequelize.define('publications', {
    ID_PUBLICATION: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primarykey: true,
        autoincrement: true
    },
    ID_UTILISATEUR: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    TITLE:  {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    DESCRIPTION:  {
        type: DataTypes.TEXT,
        allowNull: false
    },
    DATE_PUBLICATION:  {
        type: DataTypes.DATE,
        allowNull: false
    },
    IMAGE: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
   },
    },
    {
        freezeTableName: true,
        tableName: 'publications',
        timestamps: false
    }
)
Publication.belongsTo(Utilisateurs, { as: 'utilisateur', foreignKey: "ID_UTILISATEUR", targetKey: 'ID_UTILISATEUR'})
Publication.removeAttribute('id');
module.exports = Publication