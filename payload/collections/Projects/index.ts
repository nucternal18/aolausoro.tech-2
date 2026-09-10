import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { anyone } from '@access/anyone'
import { authenticated, authenticatedAndAdmin } from '@access/authenticated'
import { legacyIdField } from '@fields/legacyId'

const Projects: CollectionConfig<'projects'> = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'published', 'updatedAt'],
  },
  access: {
    read: anyone,
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
    slugField(),
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'address',
      type: 'text',
    },
    {
      name: 'url',
      type: 'text',
    },
    {
      name: 'github',
      type: 'text',
    },
    {
      name: 'techStack',
      type: 'array',
      fields: [
        {
          name: 'technology',
          type: 'text',
        },
      ],
    },
    {
      name: 'published',
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

export default Projects
