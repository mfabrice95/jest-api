const request = require('supertest');
const { createUtilisateur, getusers, findByid, modifieruser, supprimeruser } = require('../controllers/utilisateurs.controller');
const Utilisateurs = require('../models/Utilisateurs');
const Validation = require('../class/Validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../models/Utilisateurs');
jest.mock('../class/Validation');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Tests des fonctions de l\'API Utilisateurs', () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        body: {},
        params: {},
        protocol: 'http',
        get: jest.fn().mockReturnValue('localhost:3000'),
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
    describe('createUtilisateur', () => {
        it('doit créer un utilisateur avec succès', async () => {
            req.body = {
                NOM: 'Doe',
                PRENOM: 'John',
                TELEPHONE: '0123456789',
                DATE_NAISSANCE: '1990-01-01',
                EMAIL: 'john.doe@example.com',
                MOT_DE_PASSE: 'password123',
            };
            Validation.prototype.run = jest.fn().mockResolvedValue();
            Validation.prototype.isValidate = jest.fn().mockResolvedValue(true);
            Validation.prototype.getErrors = jest.fn().mockResolvedValue([]);
            bcrypt.genSalt.mockResolvedValue('salt');
            bcrypt.hash.mockResolvedValue('hashedPassword');
            Utilisateurs.create.mockResolvedValue({ toJSON: () => ({ ID_UTILISATEUR: 1 }) });
            jwt.sign.mockReturnValue('token');
    
            await createUtilisateur(req, res);
    
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'utilisateurs enregistré avec succes',
                data: {
                    ID_UTILISATEUR: 1,
                    token: 'token',
                },
            });
        });
    
        it('doit retourner une erreur de validation pour NOM vide', async () => {
            req.body = {
                NOM: '',
                PRENOM: 'John',
                TELEPHONE: '0123456789',
                DATE_NAISSANCE: '1990-01-01',
                EMAIL: 'john.doe@example.com',
                MOT_DE_PASSE: 'password123',
            };
    
            Validation.prototype.run = jest.fn().mockResolvedValue();
            Validation.prototype.isValidate = jest.fn().mockResolvedValue(false);
            Validation.prototype.getErrors = jest.fn().mockResolvedValue([{
                field: 'NOM',
                message: "Ce champ est obligatoire",
            }]);
    
            await createUtilisateur(req, res);
    
            expect(res.status).toHaveBeenCalledWith(422);
            expect(res.json).toHaveBeenCalledWith({
                message: 'La validation des données a echouée',
                data: [{ field: 'NOM', message: "Ce champ est obligatoire" }],
            });
        });
    
        it('doit gérer une erreur interne', async () => {
            req.body = { NOM: 'Doe' };
            Validation.prototype.run = jest.fn().mockRejectedValue(new Error('Erreur'));
    
            await createUtilisateur(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Erreur interne du serveur');
        });
    });
    describe('getusers', () => {
        it('doit récupérer tous les utilisateurs', async () => {
          const utilisateursMock = [{ id: 1, NOM: 'Doe' }];
          Utilisateurs.findAll.mockResolvedValue(utilisateursMock);
    
          await getusers(req, res);
    
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith(utilisateursMock);
        });
    
        it('doit gérer une erreur interne', async () => {
          Utilisateurs.findAll.mockRejectedValue(new Error('Erreur'));
    
          await getusers(req, res);
    
          expect(res.status).toHaveBeenCalledWith(500);
          expect(res.send).toHaveBeenCalledWith('Erreur interne du serveur');
        });
      });
    
      describe('findByid', () => {
        it('doit trouver un utilisateur par ID', async () => {
          req.params.ID_UTILISATEUR = '1';
          const utilisateurMock = { id: 1, NOM: 'Doe' };
          Utilisateurs.findOne.mockResolvedValue(utilisateurMock);
    
          await findByid(req, res);
    
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith(utilisateurMock);
        });
    
        it('doit gérer une erreur interne', async () => {
          req.params.ID_UTILISATEUR = '1';
          Utilisateurs.findOne.mockRejectedValue(new Error('Erreur'));
    
          await findByid(req, res);
    
          expect(res.status).toHaveBeenCalledWith(500);
          expect(res.send).toHaveBeenCalledWith('erreur interne du serveur');
        });
      });
    
      describe('modifieruser', () => {
        it('doit modifier un utilisateur avec succès', async () => {
          req.params.ID_UTILISATEUR = '1';
          req.body = {
            NOM: 'Doe',
            PRENOM: 'John',
            TELEPHONE: '0123456789',
            DATE_NAISSANCE: '1990-01-01',
          };
          Utilisateurs.update.mockResolvedValue([1]);
    
          await modifieruser(req, res);
    
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith({
            message: 'modification reussi',
            data: req.body,
          });
        });
    
        it('doit gérer une erreur interne', async () => {
          req.params.ID_UTILISATEUR = '1';
          Utilisateurs.update.mockRejectedValue(new Error('Erreur'));
    
          await modifieruser(req, res);
    
          expect(res.status).toHaveBeenCalledWith(500);
          expect(res.send).toHaveBeenCalledWith('erreur interne du serveur');
        });
      });
    
      describe('supprimeruser', () => {
        it('doit supprimer un utilisateur avec succès', async () => {
          req.params.ID_UTILISATEUR = '1';
          Utilisateurs.destroy.mockResolvedValue(1);
    
          await supprimeruser(req, res);
    
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith({
            message: 'Suppression reussi',
          });
        });
    
        it('doit gérer une erreur interne', async () => {
          req.params.ID_UTILISATEUR = '1';
          Utilisateurs.destroy.mockRejectedValue(new Error('Erreur'));
    
          await supprimeruser(req, res);
    
          expect(res.status).toHaveBeenCalledWith(500);
          expect(res.send).toHaveBeenCalledWith('erreur interne du serveur');
        });
      });
    });  