import type { CollectionConfig } from "payload";
import { authenticated, authenticatedAndAdmin } from "@src/access/authenticated";

const Messages: CollectionConfig<'messages'> = {
  slug: "messages",
  admin: {
    useAsTitle: "subject",
    defaultColumns: ["subject", "name", "email", "createdAt"],
  },
  access: {
    read: authenticatedAndAdmin,
    create: () => true, // Public can create (contact form)
    update: authenticatedAndAdmin,
    delete: authenticatedAndAdmin,
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
