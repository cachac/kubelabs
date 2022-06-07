import { UserInputError, AuthenticationError } from 'apollo-server-express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Model from './user.model'
// import { logger } from '../../util/log'
import config from '../../config'

export default {
  Query: {
    User: () => ({})
  },
  Mutation: {
    User: () => ({})
  },
  UserQuery: {
    readAll: async () => {
      const result = await Model.find({})
      // eslint-disable-next-line no-console
      console.log('user list :>> ', result.length)
      return result
    },
    readById: (_, { _id }) => Model.findById(_id), // lagRead(_id)
    checkPassword: async (_, { input }) => {
      const user = await Model.findOne({ _id: input._id })
      const isPasswordValid = bcrypt.compareSync(input.oldPassword, user.password)
      if (!isPasswordValid) return false

      return true
    }
  },
  UserMutation: {
    create: async (_, { input }) => {
      const username = await Model.findOne({ username: input.username })
      if (username) throw new UserInputError('El username ya está en uso')
      const hashedPassword = bcrypt.hashSync(input.password, 12)
      const newUser = new Model({ ...input, password: hashedPassword })
      const result = await newUser.save()

      const token = jwt.sign(
        {
          _id: newUser._id,
          username: input.username,
          email: newUser.email,
          fullname: newUser.fullname
        },
        config.TOKEN_SECRET,
        { expiresIn: config.TOKEN_LIMIT }
      )

      // eslint-disable-next-line no-console
      console.log('user created :>> ', input.username)

      return { ...result._doc, token }
    },

    update: async (_, { input }) => {
      const username = await Model.findOne({ $and: [{ _id: { $ne: input._id } }, { username: input.username }] })
      if (username) throw new UserInputError('El username ya está en uso')

      return Model.findByIdAndUpdate(input._id, { ...input }, { new: true })
    },

    delete: (_, { _id }) => !!Model.deleteOne({ _id }),

    setState: (_, { input }) => Model.findByIdAndUpdate(input._id, { state: input.state }, { new: true }),

    login: async (_, { input }) => {
      const user = await Model.findOne({ username: input.username.toLowerCase() })

      if (!user) throw new AuthenticationError('El usuario no está registrado')

      if (!user.state) throw new AuthenticationError('El usuario está deshabilitado')

      const isPasswordValid = bcrypt.compareSync(input.password, user.password)
      if (!isPasswordValid) throw new AuthenticationError('Username o password inválidos')

      const token = jwt.sign(
        {
          _id: user._id,
          username: input.username,
          email: input.email,
          fullname: user.fullname,
          state: user.state
        },
        config.TOKEN_SECRET,
        { expiresIn: config.TOKEN_LIMIT }
      )

      // eslint-disable-next-line no-console
      console.log('user login :>> ', user.username)

      return { ...user._doc, token }
    },

    changePassword: async (_, { input }) => {
      const user = await Model.findById(input._id)
      if (!user) throw new AuthenticationError('El usuario no existe')

      // si el rol es MASTER no pide check del password
      const isPasswordValid = bcrypt.compareSync(input.oldPassword, user.password)
      if (!isPasswordValid && input.role !== 'MASTER') throw new AuthenticationError('password actual inválido')

      const hashedPassword = bcrypt.hashSync(input.newPassword, 12)
      await Model.findByIdAndUpdate(user._id, { password: hashedPassword })

      return true
    }
  }
}
