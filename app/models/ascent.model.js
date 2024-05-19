import mongoose from 'mongoose'

const ascentSchema = mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
      index: true,
      unique: true
    },
    date: { type: String, required: true },
    country: { type: String, required: true },
    countryCode: { type: String, required: true },
    area: String,
    city: String,
    crag: { type: String, required: true },
    sector: String,
    name: { type: String, required: true },
    grade: { type: String, required: true },
    style: { type: String, required: true }
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

const Ascent = mongoose.model('Ascent', ascentSchema)

export default Ascent
