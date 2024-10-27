const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");

const Utilisateurs = sequelize.define(
  "utilisateurs",
  {
    ID_UTILISATEUR: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    NOM: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    PRENOM: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    TELEPHONE: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    EMAIL: {
      type: DataTypes.STRING(155),
      allowNull: false,
      defaultValue: null,
    },
    MOT_DE_PASSE: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: null,
    },
    IMAGE: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    DATE_NAISSANCE: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    DATE_INSERTION: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
  },
  {
    freezeTableName: true,
    tableName: "utilisateurs",
    timestamps: false,
  }
);
// Utilisateurs.removeAttribute('id')
module.exports = Utilisateurs;
