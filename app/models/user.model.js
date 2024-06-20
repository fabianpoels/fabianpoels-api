import mongoose from 'mongoose'
import argon2 from 'argon2'
import { config } from './../config/index.js'

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = doc._id
        delete ret._id
      },
    },
    toObject: {
      transform: (doc, ret) => {
        ret.id = doc._id
        delete ret._id
      },
    },
  }
)

userSchema.methods.validPassword = async function (passwordToVerify) {
  if (
    passwordToVerify !== null &&
    passwordToVerify !== '' &&
    this.password !== null &&
    this.password !== ''
  ) {
    return await argon2.verify(this.password, passwordToVerify)
  } else {
    return false
  }
}

userSchema.statics.getHashedPassword = async function (passwordToHash) {
  if (!validCandidate(passwordToHash)) throw new Error('Invalid password candidate')
  return await argon2.hash(passwordToHash, config.argon2hashConfig)
}

function validCandidate(password) {
  if (!password) return false
  if (!password instanceof String) return false
  return config.passwordValidationRegexes.every((regex) => regex.expr.test(password))
}

const User = mongoose.model('User', userSchema)

export default User
