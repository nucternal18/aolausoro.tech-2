import type { CollectionConfig } from 'payload'
import { authenticated, authenticatedAndAdmin } from '@access/authenticated'
import { legacyIdField } from '@fields/legacyId'

export const CVs: CollectionConfig<'cvs'> = {
  slug: 'cvs',
  access: {
    create: authenticated,
    delete: authenticatedAndAdmin,
    read: authenticated,
    update: authenticated,
  },
  admin: { useAsTitle: 'label', defaultColumns: ['label', 'user', 'updatedAt'] },
  upload: {
    mimeTypes: ['application/pdf'],
    staticDir: 'public/cvs',
  },
  fields: [
    { name: 'label', type: 'text', required: true },
    {
      name: 'cvUrl',
      type: 'text',
      admin: { description: 'Legacy PDF URL. Removed after the P3.3a asset migration.' },
    },
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    legacyIdField,
  ],
  timestamps: true,
}
