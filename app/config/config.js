import 'dotenv/config'

const config = Object.freeze({
  env: process.env.ENV,
  port: process.env.PORT,
  mongodb: {
    url: process.env.MONGODB_URL,
    options: {},
  },
  corsWhitelist: ['http://localhost:9000'],
})

export default config
