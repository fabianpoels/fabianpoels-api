import express from 'express'
const router = express.Router()

// CONTROLLERS
import publicController from './../controllers/public.controller.js'

// MIDDLEWARE
import authMiddleware from './../middleware/auth.middleware.js'

router.route('/public/ascents').get(publicController.ascents)

// FROM HERE ON, AUTH IS REQUIRED SO INJECT THE USER IN THE REQ
router.use(authMiddleware)

export default router
