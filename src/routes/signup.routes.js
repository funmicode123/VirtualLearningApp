const express = require('express');
const signupRouter = express.Router();
const { signupSchema } = require('../dto/request/user/signup.dto');
const validateRequest = require('../middlewares/validateRequest');
const {signup} = require('../controllers/signup.controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

signupRouter.post('/signup', upload.single('profilePic'), validateRequest(signupSchema), signup);

module.exports = signupRouter;



/**
 * @swagger
 * /api/v1/signup:
 *   post:
 *     summary: Create a new user account
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
 *         description: User created and token returned
 *       400:
 *         description: Invalid request
 */

