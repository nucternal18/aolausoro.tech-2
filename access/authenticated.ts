import type { AccessArgs } from 'payload'

import type { User } from '@payload-types/'

type isAuthenticated = (args: AccessArgs<User>) => boolean

export const authenticated: isAuthenticated = ({ req: { user } }) => {
  return Boolean(user)
}

export const authenticatedAndAdmin: isAuthenticated = ({ req: { user } }) => {
  if (Boolean(user) && user?.isAdmin) return true
  return false
}
