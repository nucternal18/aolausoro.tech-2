import type { CollectionConfig } from "payload";
import { authenticated, authenticatedAndAdmin } from "@src/access/authenticated";

const Projects: CollectionConfig<"projects"> = {
  slug: "projects",
  admin: {
    useAsTitle: "projectName",
    defaultColumns: ["projectName", "published", "createdAt"],
  },
  access: {
    read: () => true, // Public read access
    create: authenticated,
    update: authenticated,
    delete: authenticatedAndAdmin,
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
