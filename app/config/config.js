import 'dotenv/config'

const config = Object.freeze({
  env: process.env.ENV,
  port: process.env.PORT,
  mongodb: {
    url: process.env.MONGODB_URL,
    options: {},
  },
  corsWhitelist: process.env.ENV === 'development' ? ['http://localhost:9000'] : ['http://fabianpoels.com'],
})

export default config
