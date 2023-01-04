import { User } from '../../domain/entities/User'
import { DatabaseService, AuthServices } from '../../config/dependencies'
import { filterAttrs, encryptData, decryptData } from '../../domain/utils'
import config from '../../config'

export const signup = async (credentials: any) => {
  return await User.create(DatabaseService, credentials)
}

export const signin = async (credentials: any) => {
  const account = await User.load(DatabaseService, {
    credentials,
    // related: [["Institution"], ["Certification"]],
  })
  if (!account) throw new Error("The account doesn't exist!")
  let response = AuthServices.getAuthPackage(
    filterAttrs(account, ['uuid', 'email', 'username'], false),
  )
  return response
}

export const authSignin = async (credentials: any) => {
  DatabaseService
  const entity = await User.load(DatabaseService, credentials)
  if (!entity) throw new Error("The account doesn't exist!")
  const isMatch = entity.comparePassword(credentials.password)
  if (!isMatch) throw new Error("The account doesn't exist!")
  return entity
}

export const unsubscribe = async (credentials: any) => {
  DatabaseService
  const account = await User.load(DatabaseService, credentials)
  if (account) await account.remove(DatabaseService)
}

export const update = async (credentials: any, data: any) => {
  DatabaseService
  const account = await User.load(DatabaseService, credentials)
  if (account) await account.update(DatabaseService, data)
}

// ! possible vulnerability detected!
export const resetPassword = async (credentials: any) => {
  DatabaseService
  const { token } = credentials
  console.log({ token })
  const { email, cipheredPassword } = AuthServices.verifyKey(token)
  const newPassword = decryptData(
    cipheredPassword,
    config.jwtSignupSecret || '',
  )
  const account = await User.load(DatabaseService, { email })
  const oldPassword = account.password
  // account.changePassword({ newPassword, oldPassword }); // ! check this method
}
