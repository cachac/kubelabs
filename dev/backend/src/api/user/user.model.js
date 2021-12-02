import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const { Schema } = mongoose

const schema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, 'is required'],
      minLength: [3, 'Mínimo 3 caracteres'],
      maxLength: [30, 'Máximo 30 caracteres']
    },
    password: {
      type: String,
      required: [true, 'is required'],
      minLength: [5, 'Mínimo 5 caracteres']
    },
    fullname: {
      type: String
    },
    email: {
      type: String,
      // unique() {
      //   console.log('this.email :>> ', this.email)
      //   return typeof this.email !== 'undefined'
      // },
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Formato de correo incorrecto']
    },
    state: {
      type: Boolean,
      default: true
    }
  },
  {
    collection: 'User',
    timestamps: true
  }
)

schema.plugin(uniqueValidator, { message: '{PATH} debe ser único' })

export default mongoose.model('User', schema)
