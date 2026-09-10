import type { CollectionConfig } from 'payload'
import { authenticated, authenticatedAndAdmin } from '@access/authenticated'
import { legacyIdField } from '@fields/legacyId'

const Jobs: CollectionConfig<'jobs'> = {
  slug: 'jobs',
  admin: {
    useAsTitle: 'position',
    defaultColumns: ['position', 'company', 'status', 'createdAt'],
  },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticatedAndAdmin,
  },
  fields: [
    {
      name: 'position',
      type: 'text',
      required: true,
    },
    {
      name: 'company',
      type: 'text',
      required: true,
    },
    {
      name: 'jobLocation',
      type: 'text',
      required: true,
    },
    {
      name: 'jobType',
      type: 'select',
      options: [
        { label: 'Full-time', value: 'full-time' },
        { label: 'Part-time', value: 'part-time' },
        { label: 'Contract', value: 'contract' },
        { label: 'Remote', value: 'remote' },
      ],
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Interview', value: 'interview' },
        { label: 'Declined', value: 'declined' },
      ],
      defaultValue: 'pending',
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

export default Jobs
