import httpStatus from 'http-status'
import jwt from 'jsonwebtoken'
import { User } from './../models/index.js'
import { UserSerializer } from './../serializers/serializers.js'
import { config, logger } from './../config/index.js'
import redis from './../redis/redis.js'
import crypto from 'crypto'

const login = async (req, res, next) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({
      email: email,
      active: true,
      emailVerified: true,
    }).exec()
    if (user && (await user.validPassword(password))) {
      // generate jwt
      const serializedUser = UserSerializer.serialize(user)
      const token = jwt.sign({ user: serializedUser }, config.jwtSecret, {
        expiresIn: config.jwtExpire,
      })

      // generate refresh token and put it in the cache
      // also put the reverse in the cache, so we can lookup the refresh token if we want to expire it for a user
      const randomKey = crypto.randomBytes(16).toString('hex')
      await redis.set(randomKey, user._id.toString(), { EX: config.refreshTokenExpiration })
      await redis.set(user._id.toString(), randomKey, { EX: config.refreshTokenExpiration })

      // set the refresh token as cookie
      res.cookie('refreshToken', randomKey, {
        httpOnly: true,
        sameSite: 'strict',
        expires: new Date(Date.now() + config.refreshTokenExpiration * 1000),
      })

      res.status(200)
      return res.send({
        user: serializedUser,
        jwt: token,
      })
    } else {
      res.status(401)
      res.send()
    }
  } catch (e) {
    logger.error(e)
    res.status(401)
    res.send()
  }
}

const refreshToken = async (req, res, next) => {
  if (req.cookies.refreshToken) {
    try {
      // get the token value from the cache
      const userId = await redis.get(req.cookies.refreshToken)
      if (userId) {
        // lookup the user in the db
        const user = await User.findOne({
          _id: userId,
          active: true,
          emailVerified: true,
        }).exec()
        if (user) {
          // generate new JWT
          const serializedUser = UserSerializer.serialize(user)
          const token = jwt.sign({ user: serializedUser }, config.jwtSecret, {
            expiresIn: config.jwtExpire,
          })
          res.status(200)
          res.send({
            user: serializedUser,
            jwt: token,
          })
          return
        }
      }
    } catch (e) {
      logger.error(e)
      res.status(401)
      res.send()
    }
  }
  res.status(401)
  res.send()
}

const logout = async (req, res, next) => {
  if (req.user) {
    try {
      // delete redis keys associated with the refresh token
      const refreshToken = await redis.get(req.user.id)
      await redis.del(req.user.id)
      await redis.del(refreshToken)

      res.status(200)
      res.send()
    } catch (e) {
      logger.error(e)
      res.status(401)
      res.send()
    }
  } else {
    res.status(401)
    res.send()
  }
}

export default { login, refreshToken, logout }
