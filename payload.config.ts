import sharp from 'sharp'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { buildConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import Projects from './payload/collections/Projects'
import Jobs from './payload/collections/Jobs'
import Messages from './payload/collections/Messages'
import Wiki from './payload/collections/Wiki'
import Issues from './payload/collections/Issues'
import Users from './payload/collections/Users'
import { Media } from './payload/collections/Media'
import { Posts } from './payload/collections/Posts'
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
      graphics: {
        Logo: '/public/android-chrome-512x512.png', // Uncomment and create logo.png when available
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
  collections: [Posts, Projects, Jobs, Messages, Wiki, Issues, Users, Media],
  secret: process.env.PAYLOAD_SECRET || '',
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],
  db: mongooseAdapter({
    url: process.env.DATABASE_URL!,
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
