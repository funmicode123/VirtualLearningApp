const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const authenticate = require('../middlewares/authMiddleware'); 
const validateRequest = require('../middlewares/validateRequest');
const createSessionDto  = require('../dto/request/session/createSession.dto');
const joinSessionDto = require('../dto/request/session/joinSession.dto')
const updateSessionDto = require('../dto/request/session/updateSession.dto')

router.post('/', authenticate, validateRequest(createSessionDto), sessionController.createSession);

router.patch('/:id/join', authenticate, validateRequest(joinSessionDto), sessionController.joinSession);

router.get('/', authenticate, sessionController.getAllSessions);
router.get('/:id', authenticate, sessionController.getSessionById);

router.put('/:id', authenticate, validateRequest(updateSessionDto), sessionController.updateSession);

router.delete('/:id', authenticate, sessionController.deleteSession);

module.exports = router;



/**
 * @swagger
 * /sessions:
 *   post:
 *     summary: Create a new session
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topic
 *               - startTime
 *               - endTime
 *             properties:
 *               topic:
 *                 type: string
 *                 example: "How might we track participant attention?"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-06-03T10:00:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-06-03T12:00:00Z"
 *               attendeeList:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: objectId
 *                   example: "a5d3210b-87de-41e9-a4c9-835ed342bd30"
 *     responses:
 *       201:
 *         description: Session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: "e1aabf3e-5f4d-4fcb-b14a-cab6dc69a317"
 *                 topic:
 *                   type: string
 *                 startTime:
 *                   type: string
 *                   format: date-time
 *                 endTime:
 *                   type: string
 *                   format: date-time
 *                 host:
 *                   type: string
 *                   format: uuid
 *                   example: "8e1acb13-1ad8-4539-9309-58a1c5552193"
 *                 attendeeList:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: uuid
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       500:
 *         description: Internal server error
 */




/**
 * @swagger
 * /sessions:
 *   get:
 *     summary: Retrieve a list of all sessions
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   topic:
 *                     type: string
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                   endTime:
 *                     type: string
 *                     format: date-time
 *                   attendeeList:
 *                     type: array
 *                     items:
 *                       type: string
 *       401:
 *         description: Unauthorized - missing or invalid token
 */


/**
 * @swagger
 * /sessions/{id}:
 *   get:
 *     summary: Get a session by ID
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the session to retrieve
 *     responses:
 *       200:
 *         description: Session retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 topic:
 *                   type: string
 *                 startTime:
 *                   type: string
 *                   format: date-time
 *                 endTime:
 *                   type: string
 *                   format: date-time
 *                 attendeeList:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       404:
 *         description: Session not found
 */


/**
 * @swagger
 * /sessions/{id}:
 *   put:
 *     summary: Update a session by ID
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the session to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topic:
 *                 type: string
 *                 example: "Updated session topic"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Session updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       404:
 *         description: Session not found
 */


/**
 * @swagger
 * /sessions/{id}/join:
 *   patch:
 *     summary: Join a session as an attendee
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The ID of the session to join
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 example: "6497a47c-d056-44b6-822a-6c0113acba37"
 *     responses:
 *       200:
 *         description: Successfully joined the session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User successfully joined the session."
 *                 session:
 *                   $ref: '#/components/schemas/Session'
 *       400:
 *         description: Invalid input or already joined
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       404:
 *         description: Session not found
 */




/**
 * @swagger
 * /sessions/{id}:
 *   delete:
 *     summary: Delete a session by ID
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the session to delete
 *     responses:
 *       204:
 *         description: Session successfully deleted (No Content)
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       404:
 *         description: Session not found
 */
