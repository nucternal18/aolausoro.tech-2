import type { CollectionConfig } from 'payload'
import { authenticatedAndAdmin } from '@src/access/authenticated'

const Users: CollectionConfig<'users'> = {
  slug: 'users',
  auth: {
    tokenExpiration: 60 * 60 * 8, // 8h admin session
    maxLoginAttempts: 5,
    lockTime: 1000 * 60 * 10, // 10m
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'isAdmin', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.isAdmin) return true
      return { id: { equals: user?.id } }
    },
    create: authenticatedAndAdmin,
    update: ({ req: { user } }) => {
      if (user?.isAdmin) return true
      return { id: { equals: user?.id } }
    },
    delete: authenticatedAndAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'text',
    },
    {
      name: 'isAdmin',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  timestamps: true,
}

export default Users
