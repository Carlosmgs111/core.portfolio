import mongoose from 'mongoose'
import config from '../../../config'

export const connect = () =>
  mongoose.connect(config.mongoDBLocalUrl || config.mongoDBAtlasURL || '')

export const { connection } = mongoose

// Callback once connection open
connection.once('open', () => {
  console.log('Mongodb connection stablished')
})

connection.on('error', (err) => {
  console.log(err)
  process.exit(0)
})
