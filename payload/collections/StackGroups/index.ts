import type { CollectionConfig } from 'payload'
import { anyone } from '@access/anyone'
import { authenticated, authenticatedAndAdmin } from '@access/authenticated'

export const StackGroups: CollectionConfig = {
  slug: 'stack-groups',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'updatedAt'],
    group: 'Site',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticatedAndAdmin,
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'filled',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description:
              'Checked = solid/filled chip (daily use). Unchecked = outlined chip (working knowledge).',
          },
        },
      ],
    },
  ],
  timestamps: true,
}

export default StackGroups
