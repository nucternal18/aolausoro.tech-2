import type { CollectionConfig } from 'payload'
import { authenticated, authenticatedAndAdmin } from '@access/authenticated'

const Issues: CollectionConfig = {
  slug: 'issues',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'createdAt'],
  },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticatedAndAdmin,
    delete: authenticatedAndAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Open', value: 'OPEN' },
        { label: 'In Progress', value: 'IN_PROGRESS' },
        { label: 'Closed', value: 'CLOSED' },
      ],
      defaultValue: 'OPEN',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
  ],
  timestamps: true,
}

export default Issues
