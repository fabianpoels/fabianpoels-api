import express from 'express'
import authController from '../controllers/auth.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'

const router = express.Router()

router.route('/login').post(authController.login)
router.route('/refresh-token').post(authController.refreshToken)
router.route('/logout').post(authMiddleware, authController.logout)

export default router
