import { app } from './app/index.js'
import { config, logger } from './app/config/index.js'
import mongoose from 'mongoose'
import { Ascent } from './app/models/index.js'

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed')
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
}

const unexpectedErrorHandler = (error) => {
  logger.error(error)
  exitHandler()
}

let server

try {
  await mongoose.connect(config.mongodb.url, config.mongodb.options)
  logger.info('CONNECTED TO MONGODB')
  server = app.listen(config.port, () => {
    logger.info(`APP RUNNING ON PORT ${config.port}`)
    logger.info(`APP ENV: ${config.env}`)
  })
} catch (error) {
  unexpectedErrorHandler(error)
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
  logger.info('SIGTERM received')
  if (server) {
    server.close()
  }
})
