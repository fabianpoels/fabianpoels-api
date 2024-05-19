import { Ascent } from '../models/index.js'
import { ArraySerializer, AscentSerializer } from './../serializers/serializers.js'

const ascents = async (req, res, next) => {
  try {
    const ascents = await Ascent.find().sort({ number: 'asc' }).exec()
    res.send(ArraySerializer.serialize(ascents, { serializer: AscentSerializer }))
  } catch (e) {
    next(e)
  }
}

export default { ascents }
