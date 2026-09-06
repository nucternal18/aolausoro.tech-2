import type { CollectionConfig, PayloadRequest } from "payload";
import { authenticateWithClerk } from "../../access/clerk-auth";
import { authenticatedAndAdmin } from "@src/access/authenticated";

const Users: CollectionConfig<'users'> = {
  slug: "users",
  auth: {
    strategies: [
      {
        name: "clerk",
        authenticate: async ({ headers }: { headers: any }) => {
          // Create a mock request object
          const req = {
            headers: headers || {},
          } as PayloadRequest;

          return await authenticateWithClerk(req);
        },
      },
    ],
  },
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
    delete: authenticatedAndAdmin
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
    // {
    //   name: "cvUrl",
    //   type: "relationship",
    //   relationTo: "cvs",
    //   hasMany: false,
    // },
  ],
  timestamps: true,
};

export default Users;
