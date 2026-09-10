import type { CollectionConfig } from 'payload'
import { authenticated, authenticatedAndAdmin } from '@access/authenticated'
import { defaultLexical } from '@fields/defaultLexical'
import { legacyIdField } from '@fields/legacyId'

const Wiki: CollectionConfig<'wiki'> = {
  slug: 'wiki',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'isImage', 'createdAt'],
  },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
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
      type: 'richText',
      editor: defaultLexical,
      required: true,
    },
    {
      name: 'imageUrl',
      type: 'text',
      admin: { description: 'Image URL (Cloudinary today; migrates to Spaces in P3.3).' },
    },
    {
      name: 'isImage',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    legacyIdField,
  ],
  timestamps: true,
}

export default Wiki
