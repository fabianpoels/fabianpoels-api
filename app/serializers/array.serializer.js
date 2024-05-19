const ArraySerializer = {
  serialize: function (array, options) {
    if (options.serializer?.serialize instanceof Function) {
      return array.map((item) => options.serializer.serialize(item))
    }
    return array.map((item) => item.toObject())
  },
}

export default ArraySerializer
