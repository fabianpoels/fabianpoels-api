const allowedKeys = ['number', 'date', 'countryCode', 'area', 'city', 'crag', 'sector', 'name', 'grade', 'style']

const AscentSerializer = {
  serialize: (ascent, options) => {
    const a = ascent.toObject()
    const res = Object.keys(a)
          .filter(k => allowedKeys.includes(k))
          .reduce((obj, key) => {
            obj[key] = a[key]
            return obj
          }, {})
    res.year = parseInt(res.date.substring(6))
    delete res.date
    return res
  }
}

export default AscentSerializer
