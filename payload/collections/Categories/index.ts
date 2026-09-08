import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { anyone } from '@src/access/anyone'
import { authenticated, authenticatedAndAdmin } from '@src/access/authenticated'

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
