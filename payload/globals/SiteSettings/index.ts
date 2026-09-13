import type { GlobalConfig } from 'payload'
import { anyone } from '@access/anyone'
import { authenticated } from '@access/authenticated'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Site',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', required: true, defaultValue: 'FULL-STACK ENGINEER' },
        {
          name: 'stackLine',
          type: 'text',
          required: true,
          defaultValue: 'TYPESCRIPT · NEXT.JS · NODE · DOCKER',
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          defaultValue: 'Adewoyin Oladipupo-Usoro',
          admin: {
            description: 'The last word is rendered with the outlined-text treatment.',
          },
        },
        {
          name: 'lead',
          type: 'textarea',
          required: true,
          defaultValue:
            'I design, build and deploy full-stack web products end to end — a Next.js front end, a typed API behind it, and the Docker pipeline that puts it in production on my own infrastructure.',
        },
        {
          name: 'terminalLines',
          type: 'array',
          required: true,
          minRows: 1,
          fields: [
            { name: 'prompt', type: 'text', required: true },
            { name: 'output', type: 'text', required: true },
          ],
          defaultValue: [
            { prompt: 'whoami', output: 'adewoyin — full-stack engineer, london' },
            { prompt: 'cat stack.txt', output: 'next.js · node · typescript · docker · mongodb' },
          ],
        },
        { name: 'primaryCtaLabel', type: 'text', required: true, defaultValue: 'SEE THE WORK' },
        { name: 'secondaryCtaLabel', type: 'text', required: true, defaultValue: 'CV (PDF)' },
        { name: 'statLocation', type: 'text', required: true, defaultValue: 'LONDON, UK' },
        { name: 'statStatus', type: 'text', required: true, defaultValue: 'OPEN TO WORK' },
      ],
    },
    {
      name: 'ticker',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [{ name: 'message', type: 'text', required: true }],
      defaultValue: [
        { message: 'CURRENTLY · MIGRATING AOLAUSORO.TECH ONTO PAYLOAD CMS' },
        { message: 'OPEN TO CONTRACT + PERMANENT ROLES' },
        { message: 'REPLIES WITHIN A DAY' },
      ],
    },
    {
      name: 'nav',
      type: 'group',
      fields: [
        {
          name: 'links',
          type: 'array',
          required: true,
          minRows: 1,
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
          ],
          defaultValue: [
            { label: 'WORK', href: '/#work' },
            { label: 'STACK', href: '/#stack' },
            { label: 'WRITING', href: '/posts' },
            { label: 'CONTACT', href: '/contact' },
          ],
        },
        { name: 'ctaLabel', type: 'text', required: true, defaultValue: 'HIRE ME' },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'email', type: 'email', required: true, defaultValue: 'adewoyin@aolausoro.tech' },
        { name: 'location', type: 'text', required: true, defaultValue: 'LONDON, UK' },
        {
          name: 'responsePromise',
          type: 'text',
          required: true,
          defaultValue: 'REPLIES WITHIN A DAY',
        },
        {
          name: 'socialLinks',
          type: 'array',
          required: true,
          minRows: 1,
          fields: [
            {
              name: 'platform',
              type: 'select',
              required: true,
              options: [
                { label: 'GitHub', value: 'github' },
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'Stack Overflow', value: 'stackoverflow' },
                { label: 'Other', value: 'other' },
              ],
            },
            { name: 'url', type: 'text', required: true },
            { name: 'label', type: 'text', required: true },
          ],
          defaultValue: [
            {
              platform: 'github',
              url: 'https://github.com/nucternal18',
              label: 'GitHub',
            },
            {
              platform: 'linkedin',
              url: 'https://www.linkedin.com/in/adewoyin-oladipupo-usoro-267291100/',
              label: 'LinkedIn',
            },
            {
              platform: 'stackoverflow',
              url: 'https://stackoverflow.com/users/11582232/aolausoro',
              label: 'Stack Overflow',
            },
          ],
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', required: true, defaultValue: '04 / CONTACT' },
        { name: 'heading', type: 'text', required: true, defaultValue: 'Got a role or a build?' },
        {
          name: 'body',
          type: 'textarea',
          required: true,
          defaultValue:
            "I'm open to contract and permanent full-stack work. Email is the fastest route and I reply within a day — tell me what you're building and where it's stuck.",
        },
      ],
    },
    {
      name: 'footer',
      type: 'group',
      fields: [
        {
          name: 'bio',
          type: 'textarea',
          required: true,
          defaultValue:
            'Adewoyin Oladipupo-Usoro — full-stack engineer. Currently open to contract and permanent roles.',
        },
        {
          name: 'buttonLabel',
          type: 'text',
          required: true,
          defaultValue: 'START A CONVERSATION',
        },
        {
          name: 'colophon',
          type: 'text',
          required: true,
          defaultValue: 'NEXT.JS 16 · PAYLOAD CMS · DOCKER ON SELF-HOSTED',
        },
      ],
    },
    {
      name: 'sectionHeadings',
      type: 'group',
      fields: [
        {
          name: 'work',
          type: 'group',
          fields: [
            { name: 'eyebrow', type: 'text', required: true, defaultValue: '02 / FEATURED WORK' },
            { name: 'heading', type: 'text', required: true, defaultValue: 'Selected projects' },
            {
              name: 'description',
              type: 'text',
              required: true,
              defaultValue:
                'Published from Payload. Open any card for the full write-up, stack and screenshots.',
            },
          ],
        },
        {
          name: 'stack',
          type: 'group',
          fields: [
            { name: 'eyebrow', type: 'text', required: true, defaultValue: '03 / STACK' },
            { name: 'heading', type: 'text', required: true, defaultValue: 'What I work in' },
            {
              name: 'description',
              type: 'text',
              required: true,
              defaultValue: 'Grouped by layer. Bold means daily; the rest is working knowledge.',
            },
          ],
        },
        {
          name: 'writing',
          type: 'group',
          fields: [
            { name: 'eyebrow', type: 'text', required: true, defaultValue: 'WRITING' },
            {
              name: 'heading',
              type: 'text',
              required: true,
              defaultValue: 'Notes from the build',
            },
          ],
        },
        {
          name: 'search',
          type: 'group',
          fields: [{ name: 'heading', type: 'text', required: true, defaultValue: 'Search' }],
        },
        {
          name: 'contactPage',
          type: 'group',
          fields: [
            { name: 'eyebrow', type: 'text', required: true, defaultValue: 'CONTACT' },
            { name: 'heading', type: 'text', required: true, defaultValue: "Let's talk" },
            {
              name: 'body',
              type: 'textarea',
              required: true,
              defaultValue:
                "Roles, contracts, or a build that's stuck — tell me what you need and I'll reply within a day.",
            },
          ],
        },
      ],
    },
  ],
}

export default SiteSettings
