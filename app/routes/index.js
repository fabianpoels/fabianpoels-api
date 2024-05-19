import express from 'express'
const router = express.Router()

// CONTROLLERS
import publicController from './../controllers/public.controller.js'

router.route('/public/ascents').get(publicController.ascents)

export default router
