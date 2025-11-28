# Payload CMS Integration - Technical Overview

## Executive Summary

This document provides a comprehensive technical overview for integrating Payload CMS into the Next.js application to replace all custom admin pages. The integration will consolidate content management for Projects, Jobs, Messages, Wiki, Issues, and User profiles into a unified Payload CMS admin interface.

---

## 1. Current Architecture Analysis

### 1.1 Current Admin Structure

**Location**: `app/(protected)/admin/`

**Current Admin Pages**:

- **Dashboard** (`/admin/dashboard.tsx`) - Overview and statistics
- **Projects** (`/admin/projects/`) - CRUD operations for portfolio projects
- **Jobs** (`/admin/jobs/`) - Job listing management with search/filter
- **Messages** (`/admin/messages/`) - Contact form message management
- **Wiki** (`/admin/wiki/`) - Wiki article management with image uploads
- **Issues** (`/admin/issues/`) - Issue tracking system
- **User Profile** (`/admin/user-profile/`) - User management

### 1.2 Current Data Models (Prisma Schema)

**Collections to Migrate**:

- `Project` - Portfolio projects with tech stack, GitHub links, descriptions
- `Job` - Job listings with company, location, type, status
- `Message` - Contact form submissions
- `Wiki` - Wiki articles with images and descriptions
- `Issue` - Issue tracking with status (OPEN, IN_PROGRESS, CLOSED)
- `User` - User accounts with Clerk integration
- `CV` - CV file uploads linked to users

### 1.3 Current Authentication

- **Provider**: Clerk (`@clerk/nextjs`)
- **Middleware**: `proxy.ts` with `clerkMiddleware`
- **Protection**: Route matcher for `/admin(.*)`
- **User Lookup**: Clerk ID stored in `User.clerkId` field

### 1.4 Current Data Layer

- **ORM**: Prisma with MongoDB
- **Server Actions**: Located in `app/actions/`
- **Architecture**: Clean Architecture pattern with:
  - Entities (`src/entities/`)
  - Use Cases (`src/application/`)
  - Controllers (`src/interface-adapters/controllers/`)
  - Infrastructure (`src/infrastructure/`)

---

## 2. Payload CMS Integration Strategy

### 2.1 Architecture Decision

**Recommended Approach**: **Embedded Payload CMS** (not standalone)

- Payload runs within the Next.js app
- Shared database (MongoDB via Prisma)
- Unified authentication (Clerk integration)
- Single deployment and codebase

### 2.2 Integration Points

1. **Admin Route**: `/admin` → Payload CMS Admin UI
2. **API Routes**: `/api/payload/*` → Payload API endpoints
3. **Database**: Continue using MongoDB via Prisma (Payload can use same DB)
4. **Authentication**: Custom Payload auth strategy using Clerk

---

## 3. Installation & Setup

### 3.1 Required Dependencies

```bash
pnpm add payload @payloadcms/db-mongodb @payloadcms/bundler-webpack
pnpm add -D @payloadcms/eslint-config payload
```

### 3.2 Project Structure

```
payload/
  ├── config.ts              # Main Payload configuration
  ├── collections/
  │   ├── Projects.ts
  │   ├── Jobs.ts
  │   ├── Messages.ts
  │   ├── Wiki.ts
  │   ├── Issues.ts
  │   └── Users.ts
  ├── access/
  │   └── clerk-auth.ts      # Clerk authentication strategy
  └── hooks/
      └── sync-prisma.ts     # Sync Payload data with Prisma
```

### 3.3 Next.js Configuration Updates

**File**: `next.config.js`

```javascript
const { webpack } = require("next/dist/compiled/webpack/webpack");

module.exports = {
  // ... existing config
  webpack: (config, { isServer }) => {
    // Existing webpack config
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }

    // Payload CMS webpack configuration
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        sharp: "commonjs sharp",
        "onnxruntime-node": "commonjs onnxruntime-node",
      });
    }

    return config;
  },
};
```

---

## 4. Payload Configuration

### 4.1 Main Configuration File

**File**: `payload/config.ts`

```typescript
import { buildConfig } from "payload/config";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import path from "path";

// Collections
import Projects from "./collections/Projects";
import Jobs from "./collections/Jobs";
import Messages from "./collections/Messages";
import Wiki from "./collections/Wiki";
import Issues from "./collections/Issues";
import Users from "./collections/Users";

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || "http://localhost:3000",
  admin: {
    user: "users", // Use Users collection for admin authentication
    bundler: webpackBundler(),
    meta: {
      titleSuffix: "- Admin",
      favicon: "/favicon.ico",
      ogImage: "/og-image.png",
    },
    components: {
      graphics: {
        Logo: "/logo.png", // Custom logo
      },
    },
  },
  collections: [Projects, Jobs, Messages, Wiki, Issues, Users],
  db: mongooseAdapter({
    url: process.env.DATABASE_URL!,
  }),
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
  // Custom authentication using Clerk
  auth: {
    strategies: [
      {
        name: "clerk",
        authenticate: async ({ headers }) => {
          // Clerk authentication logic
          // See section 5.1 for implementation
        },
      },
    ],
  },
});
```

### 4.2 Environment Variables

**File**: `.env.local` (add these)

```env
# Payload CMS
PAYLOAD_SECRET=your-secret-key-here
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000

# Database (existing)
DATABASE_URL=mongodb://...

# Clerk (existing)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

---

## 5. Collection Definitions

### 5.1 Projects Collection

**File**: `payload/collections/Projects.ts`

```typescript
import { CollectionConfig } from "payload/types";

const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    useAsTitle: "projectName",
    defaultColumns: ["projectName", "published", "createdAt"],
  },
  access: {
    read: () => true, // Public read access
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user?.isAdmin,
  },
  fields: [
    {
      name: "projectName",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "address",
      type: "text",
    },
    {
      name: "url",
      type: "text",
      validate: (val) => {
        if (val && !val.startsWith("http")) {
          return "URL must start with http:// or https://";
        }
        return true;
      },
    },
    {
      name: "github",
      type: "text",
    },
    {
      name: "techStack",
      type: "array",
      fields: [
        {
          name: "technology",
          type: "text",
        },
      ],
    },
    {
      name: "published",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
  ],
  timestamps: true,
};

export default Projects;
```

### 5.2 Jobs Collection

**File**: `payload/collections/Jobs.ts`

```typescript
import { CollectionConfig } from "payload/types";

const Jobs: CollectionConfig = {
  slug: "jobs",
  admin: {
    useAsTitle: "position",
    defaultColumns: ["position", "company", "status", "createdAt"],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user?.isAdmin,
  },
  fields: [
    {
      name: "position",
      type: "text",
      required: true,
    },
    {
      name: "company",
      type: "text",
      required: true,
    },
    {
      name: "jobLocation",
      type: "text",
      required: true,
    },
    {
      name: "jobType",
      type: "select",
      options: [
        { label: "Full-time", value: "full-time" },
        { label: "Part-time", value: "part-time" },
        { label: "Contract", value: "contract" },
        { label: "Remote", value: "remote" },
      ],
      required: true,
    },
    {
      name: "status",
      type: "select",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Interview", value: "interview" },
        { label: "Declined", value: "declined" },
      ],
      defaultValue: "pending",
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
  ],
  timestamps: true,
};

export default Jobs;
```

### 5.3 Messages Collection

**File**: `payload/collections/Messages.ts`

```typescript
import { CollectionConfig } from "payload/types";

const Messages: CollectionConfig = {
  slug: "messages",
  admin: {
    useAsTitle: "subject",
    defaultColumns: ["subject", "name", "email", "createdAt"],
  },
  access: {
    read: ({ req: { user } }) => !!user?.isAdmin,
    create: () => true, // Public can create (contact form)
    update: ({ req: { user } }) => !!user?.isAdmin,
    delete: ({ req: { user } }) => !!user?.isAdmin,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "subject",
      type: "text",
      required: true,
    },
    {
      name: "message",
      type: "textarea",
      required: true,
    },
  ],
  timestamps: true,
};

export default Messages;
```

### 5.4 Wiki Collection

**File**: `payload/collections/Wiki.ts`

```typescript
import { CollectionConfig } from "payload/types";

const Wiki: CollectionConfig = {
  slug: "wiki",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "isImage", "createdAt"],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user?.isAdmin,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "richText",
      required: true,
    },
    {
      name: "imageUrl",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "isImage",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
  ],
  timestamps: true,
};

export default Wiki;
```

### 5.5 Issues Collection

**File**: `payload/collections/Issues.ts`

```typescript
import { CollectionConfig } from "payload/types";

const Issues: CollectionConfig = {
  slug: "issues",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "status", "createdAt"],
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user?.isAdmin,
    delete: ({ req: { user } }) => !!user?.isAdmin,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "status",
      type: "select",
      options: [
        { label: "Open", value: "OPEN" },
        { label: "In Progress", value: "IN_PROGRESS" },
        { label: "Closed", value: "CLOSED" },
      ],
      defaultValue: "OPEN",
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
  ],
  timestamps: true,
};

export default Issues;
```

### 5.6 Users Collection

**File**: `payload/collections/Users.ts`

```typescript
import { CollectionConfig } from "payload/types";

const Users: CollectionConfig = {
  slug: "users",
  auth: false, // Disable Payload's default auth (using Clerk)
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "isAdmin", "createdAt"],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.isAdmin) return true;
      return { id: { equals: user?.id } };
    },
    update: ({ req: { user } }) => {
      if (user?.isAdmin) return true;
      return { id: { equals: user?.id } };
    },
    delete: ({ req: { user } }) => !!user?.isAdmin,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "email",
      type: "email",
      required: true,
      unique: true,
    },
    {
      name: "image",
      type: "text",
    },
    {
      name: "isAdmin",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "clerkId",
      type: "text",
      unique: true,
      index: true,
    },
    {
      name: "emailVerified",
      type: "date",
    },
    {
      name: "cvUrl",
      type: "relationship",
      relationTo: "cvs",
      hasMany: false,
    },
  ],
  timestamps: true,
};

export default Users;
```

### 5.7 Media Collection (for file uploads)

**File**: `payload/collections/Media.ts`

```typescript
import { CollectionConfig } from "payload/types";

const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user?.isAdmin,
  },
  upload: {
    staticDir: "media",
    // Use Cloudinary adapter if needed
    // adapter: cloudinaryAdapter({ ... }),
  },
  fields: [
    {
      name: "alt",
      type: "text",
    },
  ],
};

export default Media;
```

---

## 6. Clerk Authentication Integration

### 6.1 Custom Authentication Strategy

**File**: `payload/access/clerk-auth.ts`

```typescript
import { PayloadRequest } from "payload/types";
import { auth } from "@clerk/nextjs/server";
import prisma from "@lib/prismadb";

export async function authenticateWithClerk(
  req: PayloadRequest
): Promise<{ user: any; token: string } | null> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    // Find or create user in database
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      // Create user if doesn't exist
      const clerkUser = await fetch(
        `https://api.clerk.com/v1/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          },
        }
      ).then((res) => res.json());

      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0].emailAddress,
          name: `${clerkUser.firstName} ${clerkUser.lastName}`,
          image: clerkUser.imageUrl,
        },
      });
    }

    // Return user in Payload format
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
      token: userId, // Use Clerk ID as token
    };
  } catch (error) {
    console.error("Clerk authentication error:", error);
    return null;
  }
}
```

### 6.2 Payload Auth Configuration

Update `payload/config.ts`:

```typescript
import { authenticateWithClerk } from "./access/clerk-auth";

export default buildConfig({
  // ... other config
  auth: {
    strategies: [
      {
        name: "clerk",
        authenticate: async ({ headers }) => {
          // Create a mock request object
          const req = {
            headers: headers || {},
          } as PayloadRequest;

          return await authenticateWithClerk(req);
        },
      },
    ],
  },
});
```

---

## 7. Next.js Route Integration

### 7.1 Payload Admin Route

**File**: `app/(protected)/admin/[[...segments]]/route.ts`

```typescript
import { getPayload } from "payload";
import config from "@payload/config";
import { REST_DELETE, REST_GET, REST_PATCH, REST_POST } from "payload/routes";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const payload = await getPayload({ config });
  return REST_GET(request, { payload });
}

export async function POST(request: Request) {
  const payload = await getPayload({ config });
  return REST_POST(request, { payload });
}

export async function DELETE(request: Request) {
  const payload = await getPayload({ config });
  return REST_DELETE(request, { payload });
}

export async function PATCH(request: Request) {
  const payload = await getPayload({ config });
  return REST_PATCH(request, { payload });
}
```

### 7.2 Payload Admin UI Route

**File**: `app/(protected)/admin/[[...segments]]/page.tsx`

```typescript
import { getPayload } from 'payload';
import config from '@payload/config';
import { PayloadAdminBar, PayloadAdminBarProps } from '@payloadcms/admin-bar';
import { PayloadAccess } from '@payloadcms/next/views';

export const dynamic = 'force-dynamic';

export default async function AdminPage({
  params,
}: {
  params: { segments?: string[] };
}) {
  const payload = await getPayload({ config });
  const segments = params.segments || [];

  return <PayloadAccess payload={payload} segments={segments} />;
}
```

---

## 8. Data Migration Strategy

### 8.1 Migration Script

**File**: `scripts/migrate-to-payload.ts`

```typescript
import { getPayload } from "payload";
import config from "@payload/config";
import prisma from "@lib/prismadb";

async function migrateData() {
  const payload = await getPayload({ config });

  // Migrate Projects
  const projects = await prisma.project.findMany();
  for (const project of projects) {
    await payload.create({
      collection: "projects",
      data: {
        projectName: project.projectName,
        description: project.description,
        address: project.address,
        url: project.url,
        github: project.github,
        techStack: project.techStack.map((tech) => ({ technology: tech })),
        published: project.published,
        user: project.userId,
      },
    });
  }

  // Similar migrations for Jobs, Messages, Wiki, Issues
  console.log("Migration complete!");
}

migrateData();
```

### 8.2 Dual-Write Strategy (Recommended)

During transition, write to both Prisma and Payload:

**File**: `app/actions/projects.ts` (updated)

```typescript
export async function createProject(input: FormData) {
  const { userId } = await auth();

  // Write to Prisma (existing)
  const prismaResult = await createProjectController(data, userId);

  // Also write to Payload
  const payload = await getPayload({ config });
  await payload.create({
    collection: "projects",
    data: {
      /* mapped data */
    },
  });

  return prismaResult;
}
```

---

## 9. Customization & UI Integration

### 9.1 Custom Admin Components

Payload allows custom React components:

**File**: `payload/components/CustomDashboard.tsx`

```typescript
import React from 'react';

export function CustomDashboard() {
  return (
    <div>
      <h1>Custom Dashboard</h1>
      {/* Custom dashboard content */}
    </div>
  );
}
```

Register in `payload/config.ts`:

```typescript
admin: {
  components: {
    views: {
      Dashboard: CustomDashboard,
    },
  },
}
```

### 9.2 Styling Integration

Payload uses CSS modules. You can override styles:

**File**: `payload/styles/custom.scss`

```scss
// Override Payload styles to match your design system
.payload-admin {
  --color-primary: #your-primary-color;
}
```

---

## 10. Implementation Steps

### Phase 1: Setup & Configuration (Week 1)

1. ✅ Install Payload CMS dependencies
2. ✅ Create Payload configuration file
3. ✅ Set up environment variables
4. ✅ Configure Next.js for Payload
5. ✅ Create basic collection structures

### Phase 2: Authentication Integration (Week 1-2)

1. ✅ Implement Clerk authentication strategy
2. ✅ Test authentication flow
3. ✅ Configure access control rules

### Phase 3: Collection Migration (Week 2-3)

1. ✅ Create all collection definitions
2. ✅ Set up relationships between collections
3. ✅ Configure field validations
4. ✅ Test CRUD operations

### Phase 4: Data Migration (Week 3)

1. ✅ Create migration scripts
2. ✅ Migrate existing data
3. ✅ Verify data integrity
4. ✅ Set up dual-write strategy

### Phase 5: UI Customization (Week 3-4)

1. ✅ Customize admin UI branding
2. ✅ Create custom views/components
3. ✅ Integrate with existing design system
4. ✅ Add custom dashboard

### Phase 6: Testing & Deployment (Week 4)

1. ✅ Test all admin operations
2. ✅ Performance testing
3. ✅ Security audit
4. ✅ Deploy to production

---

## 11. Benefits & Considerations

### Benefits

1. **Unified Admin Interface**: Single admin panel for all content types
2. **Built-in Features**: Rich text editor, file uploads, relationships, etc.
3. **Type Safety**: Auto-generated TypeScript types
4. **GraphQL API**: Automatic GraphQL API generation
5. **Extensibility**: Easy to add custom fields, hooks, and validations
6. **Developer Experience**: Excellent DX with hot reload, type safety

### Considerations

1. **Learning Curve**: Team needs to learn Payload CMS patterns
2. **Database Schema**: May need to adjust Prisma schema or use dual storage
3. **Migration Effort**: Existing data needs careful migration
4. **Custom Logic**: Some custom business logic may need refactoring
5. **Bundle Size**: Payload adds to bundle size (mitigated by code splitting)

---

## 12. Alternative Approaches

### Option A: Full Payload Migration (Recommended)

- Complete replacement of custom admin
- Single source of truth (Payload)
- Maximum benefit from Payload features

### Option B: Hybrid Approach

- Keep some custom admin pages
- Use Payload for specific collections
- Gradual migration

### Option C: Payload as API Only

- Use Payload backend API
- Keep custom admin UI
- Less benefit but more control

---

## 13. Next Steps

1. **Review & Approval**: Review this document with the team
2. **Proof of Concept**: Create a small POC with one collection (e.g., Projects)
3. **Team Training**: Schedule Payload CMS training session
4. **Implementation Plan**: Create detailed sprint plan
5. **Begin Phase 1**: Start with setup and configuration

---

## 14. Resources

- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Payload + Next.js Guide](https://payloadcms.com/docs/getting-started/installation)
- [Payload Authentication](https://payloadcms.com/docs/authentication/overview)
- [Payload Access Control](https://payloadcms.com/docs/access-control/overview)
- [Payload Hooks](https://payloadcms.com/docs/hooks/overview)

---

## 15. Questions & Support

For questions or clarifications, refer to:

- Payload CMS Discord: [discord.gg/payload](https://discord.gg/payload)
- Payload CMS GitHub: [github.com/payloadcms/payload](https://github.com/payloadcms/payload)

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Author**: Technical Review
