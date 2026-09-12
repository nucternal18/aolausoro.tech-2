import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { anyone } from '@access/anyone'
import { authenticated, authenticatedAndAdmin } from '@access/authenticated'

export const Categories: CollectionConfig<'categories'> = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: authenticatedAndAdmin,
    read: anyone,
    update: authenticated,
  },
  admin: { useAsTitle: 'title' },
  fields: [{ name: 'title', type: 'text', required: true }, slugField()],
}
