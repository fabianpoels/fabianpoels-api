import { config, logger } from './../config/index.js'
import { createClient } from 'redis'

const redis = createClient({
  socket: {
    host: config.redis.host,
    port: config.redis.port,
  },
})

redis.on('error', (err) => logger.error(err))
redis.on('connect', () =>
  logger.info(`CONNECTED TO REDIS ON ${config.redis.host}:${config.redis.port}`)
)
redis.on('ready', () => logger.info('REDIS READY'))

await redis.connect()

export default redis
