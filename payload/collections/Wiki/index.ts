import type { CollectionConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { authenticated, authenticatedAndAdmin } from "@src/access/authenticated";

const Wiki: CollectionConfig<'wiki'> = {
  slug: "wiki",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "isImage", "createdAt"],
  },
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticatedAndAdmin,
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
      editor: lexicalEditor({}),
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
