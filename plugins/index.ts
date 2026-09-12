import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { s3Storage } from '@payloadcms/storage-s3'
import { payloadTotp } from 'payload-totp'
import type { Plugin } from 'payload'
import { revalidateRedirects } from '@hooks/revalidateRedirects'
import type { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@search/fieldOverrides'
import { beforeSyncWithSearch } from '@search/beforeSync'

import type { Post } from '@payload-types/'
import { getServerSideURL } from '@utils/getURL'

const generateTitle: GenerateTitle<Post> = ({ doc }) => {
  return doc?.title ? `${doc.title} | aolausoro.tech` : 'aolausoro.tech'
}

const generateURL: GenerateURL<Post> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

const spacesCdnURL =
  (prefix: string) =>
  ({ filename }: { filename: string }) =>
    `${process.env.DO_SPACES_CDN_ENDPOINT}/${prefix}/${filename}`

export const plugins: Plugin[] = [
  s3Storage({
    acl: 'public-read',
    bucket: process.env.DO_SPACES_BUCKET || '',
    collections: {
      media: { prefix: 'media', generateFileURL: spacesCdnURL('media') },
      cvs: { prefix: 'cvs', generateFileURL: spacesCdnURL('cvs') },
    },
    config: {
      credentials: {
        accessKeyId: process.env.DO_SPACES_KEY || '',
        secretAccessKey: process.env.DO_SPACES_SECRET || '',
      },
      endpoint: process.env.DO_SPACES_ENDPOINT,
      region: process.env.DO_SPACES_REGION || 'lon1',
      // DO Spaces uses virtual-hosted-style addressing (bucket.region.digitaloceanspaces.com).
      forcePathStyle: false,
    },
  }),
  redirectsPlugin({
    collections: ['posts'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({
                      enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'],
                    }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
  searchPlugin({
    collections: ['posts', 'projects'],
    skipSync: ({ collectionSlug, doc }) => {
      // Projects has no _status/draft concept (unlike Posts) — it uses a
      // plain `published` checkbox instead. Without this guard, unpublished
      // projects would still be indexed and show up in site search.
      if (collectionSlug === 'projects') return doc?.published !== true
      return false
    },
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
  // Must stay last — it wraps every collection/global already registered.
  // disableAccessWrapper keeps public `anyone`-read content (Projects, Posts,
  // Categories, Media) reachable without a session.
  payloadTotp({
    collection: 'users',
    forceSetup: process.env.NODE_ENV !== 'test' && process.env.TOTP_FORCE_SETUP !== 'false',
    disableAccessWrapper: true,
    totp: { issuer: 'aolausoro.tech' },
  }),
]
