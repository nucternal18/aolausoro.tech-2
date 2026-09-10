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
  fields: [
    { name: 'label', type: 'text', required: true },
    {
      name: 'cvUrl',
      type: 'text',
      required: true,
      admin: { description: 'PDF URL (Cloudinary today; migrates to Spaces in P3.3).' },
    },
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    legacyIdField,
  ],
  timestamps: true,
}
