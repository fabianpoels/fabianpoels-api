import { app } from './app/index.js'
import { config, logger } from './app/config/index.js'
import mongoose from 'mongoose'
// import fs from 'fs'
// import csv from 'fast-csv'
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

// const createAscent = async function(row) {
//   const a = new Ascent({
//     number: parseInt(row.N),
//     date: row.Date,
//     country: row.Country,
//     countryCode: row.Code,
//     area: row.Area,
//     city: row.City,
//     crag: row.Crag,
//     sector: row.Sector,
//     name: row.Name,
//     grade: row.Grade,
//     style: row.Style
//   })
//   try {
//     await a.save()
//   } catch (e) {
//     console.log(row)
//     console.error(e)
//   }
// }

// fs.createReadStream('ascents.csv')
//   .pipe(csv.parse({ headers: true }))
//   .on('error', error => console.error(error))
//   .on('data', row => createAscent(row))
//   .on('end', rowCount => console.log(`Parsed ${rowCount} rows`))

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
  logger.info('SIGTERM received')
  if (server) {
    server.close()
  }
})
