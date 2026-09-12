import sharp from 'sharp'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { resendAdapter } from '@payloadcms/email-resend'
import { buildConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { Categories } from './payload/collections/Categories'
import { CVs } from './payload/collections/CVs'
import Projects from './payload/collections/Projects'
import Jobs from './payload/collections/Jobs'
import Messages from './payload/collections/Messages'
import Wiki from './payload/collections/Wiki'
import Issues from './payload/collections/Issues'
import Users from './payload/collections/Users'
import { Media } from './payload/collections/Media'
import StackGroups from './payload/collections/StackGroups'
import { Posts } from './payload/collections/Posts'
import { SiteSettings } from './payload/globals/SiteSettings'
import { plugins } from './plugins'
import { defaultLexical } from '@fields/defaultLexical'
import { getServerSideURL } from '@utils/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',

  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- Admin',
    },
    components: {
      beforeDashboard: ['/components/admin/BeforeDashboard#BeforeDashboard'],
      graphics: {
        Logo: '/components/Logo/Logo#Logo',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(dirname, 'app', '(protected)', 'admin', 'importMap.js'),
    },
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  editor: defaultLexical,
  collections: [
    Categories,
    Posts,
    Projects,
    Jobs,
    Messages,
    Wiki,
    Issues,
    CVs,
    Users,
    Media,
    StackGroups,
  ],
  globals: [SiteSettings],
  secret: process.env.PAYLOAD_SECRET || '',
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],
  db: mongooseAdapter({
    url: process.env.DATABASE_URL!,
  }),
  email: resendAdapter({
    defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'noreply@aolausoro.tech',
    defaultFromName: process.env.EMAIL_FROM_NAME || 'aolausoro.tech',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  },
  debug: true,
  sharp,
})
