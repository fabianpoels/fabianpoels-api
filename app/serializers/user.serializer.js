const UserSerializer = {
  serialize: (user, options) => ({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
  }),
}

export default UserSerializer
