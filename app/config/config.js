import 'dotenv/config'
import argon2 from 'argon2'

const config = Object.freeze({
  env: process.env.ENV,
  port: process.env.PORT,
  mongodb: {
    url: process.env.MONGODB_URL,
    options: {},
  },
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: '15m',
  refreshTokenExpiration: 24 * 60 * 60, // 1 day in seconds
  corsWhitelist:
    process.env.ENV === 'development' ? ['http://localhost:9000'] : ['http://fabianpoels.com'],
  passwordValidationRegexes: [
    { expr: /.{8,}/ }, // min 8 letters,
    { expr: /[0-9]/ }, // numbers from 0 - 9
    { expr: /[a-z]/ }, // letters from a - z (lowercase)
    { expr: /[A-Z]/ }, // letters from A-Z (uppercase),
    { expr: /[^A-Za-z0-9]/ }, // special characters
  ],
  argon2hashConfig: {
    type: argon2.argon2id,
    memoryCost: 47104,
    timeCost: 2,
    parallelism: 1,
  },
})

export default config
