const express = require('express');
const loginRouter = express.Router();
const loginRequestDto = require('../dto/request/user/login.dto');
const validateRequest = require('../middlewares/validateRequest');
const {login} = require('../controllers/login.controller');

loginRouter.post('/login', validateRequest(loginRequestDto), login);

module.exports = loginRouter;



/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Log in existing user account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User login and token returned
 *       400:
 *         description: Invalid credential
 */

