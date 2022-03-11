import { SchemaDirectiveVisitor, AuthenticationError } from 'apollo-server-express'
import { defaultFieldResolver } from 'graphql'

export class IsAuthenticatedDirective extends SchemaDirectiveVisitor {
  // eslint-disable-next-line class-methods-use-this
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field

    field.resolve = async (...args) => {
      const context = args[2]

      if (!context || !context.userSession) {
        throw new AuthenticationError('Acción no permitida. Debes ingresar tus credenciales.')
      }

      return resolve.apply(this, args)
    }
  }
}
