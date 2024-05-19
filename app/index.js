import express from 'express'
import morgan from './config/morgan.js'
import helmet from 'helmet'
import xss from 'xss-clean'
import compression from 'compression'
import cors from 'cors'
import mongoSanitize from 'express-mongo-sanitize'
import cookieParser from 'cookie-parser'

import routes from './routes/index.js'
import { config } from './config/index.js'

const app = express()

// logging middleware
app.use(morgan.successHandler)
app.use(morgan.errorHandler)

// security HTTP headers
app.use(helmet())

// parse json request body
app.use(express.json())

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }))

app.use(xss())
app.use(mongoSanitize())
app.use(compression())
app.use(cookieParser())

const corsOptions = {
  origin: (origin, cb) => {
    if (origin && config.corsWhitelist.includes(origin)) {
      cb(null, true)
    } else {
      cb(origin, false)
    }
  },
  credentials: true,
}

// enable cors
app.options('*', cors(corsOptions))
app.use(cors(corsOptions))

// API routes
app.use('/api', routes)

export { app }
