import { Webhook } from "svix";
import { headers } from "next/headers";
import type {
  DeletedObjectJSON,
  EmailJSON,
  OrganizationJSON,
  OrganizationDomainJSON,
  OrganizationDomainVerificationJSON,
  OrganizationInvitationJSON,
  OrganizationMembershipJSON,
  SessionJSON,
  SMSMessageJSON,
  UserJSON,
  WaitlistEntryJSON,
  WebhookEvent,
} from "@clerk/nextjs/server";
import prisma from "@lib/prismadb";
import { Prisma } from "@prisma/client";

type ClerkWebhookEvent =
  | UserJSON
  | DeletedObjectJSON
  | SessionJSON
  | EmailJSON
  | SMSMessageJSON
  | OrganizationJSON
  | OrganizationDomainJSON
  | OrganizationMembershipJSON
  | OrganizationInvitationJSON
  | WaitlistEntryJSON
  | OrganizationDomainVerificationJSON
  | OrganizationMembershipJSON
  | OrganizationInvitationJSON

export async function POST(req: Request) {
  try {
    // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      throw new Error(
        "Please add the Clerk Webhook Secret to your environment variables."
      );
    }

    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Error occured -- no svix headers", {
        status: 400,
      });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occured", {
        status: 400,
      });
    }
    // console.log("🚀 ~ POST ~ evt:", evt)
    // Do something with the payload
    // For this guide, you simply log the payload to the console

    // Clerk's webhook payload "evt" might be a UserJSON or another event type.
    // Safely access user_id and event type from evt
    let user_id: string | undefined;
    let eventType: string | undefined;

    if ('user' in evt.data && evt.data.user ) {
      user_id = (evt.data.user as UserJSON).id;
    } else if ('user_id' in evt.data) {
      // Fallback (if the event has a direct user_id field)
      user_id = (evt.data).user_id as string;
    }

    if ('type' in evt) {
      eventType = (evt).type as string;
    }

    console.log("🚀 ~ POST ~ user_id:", user_id);
    console.log("🚀 ~ POST ~ eventType:", eventType);

    const userData = 'user' in evt.data && evt.data.user ? evt.data.user as UserJSON : {} as UserJSON;


    // Save the webhook to your database
    if (eventType === "session.created") {
      const foundUser = await prisma.user.findUnique({
        where: {
          clerkId: user_id,
        },
      });

      if (foundUser) {
        return new Response("User already exist.", { status: 404 });
      }

      await prisma.user.create({
        data: {
          clerkId: user_id,
          email: userData.email_addresses[0]?.email_address as string,
          image: userData.has_image ? userData.image_url : "",
          name: `${userData.first_name} ${userData.last_name}`,
          isAdmin: false,
        },
      });

      return new Response("User Created Successfully.", { status: 200 });
    }
    if (eventType === "user.updated") {
      const foundUser = await prisma.user.findUnique({
        where: {
          clerkId: user_id,
        },
      });

      if (!foundUser) {
        return new Response("Not Found.", { status: 404 });
      }

      await prisma.user.update({
        where: {
          id: foundUser.id,
        },
        data: {
          email: userData.email_addresses[0]?.email_address,
          image: userData.has_image
            ? userData.image_url
            : foundUser.image,
          name: `${userData.first_name} ${userData.last_name}`,
        },
      });

      return new Response("User updated Successfully", { status: 200 });
    }
    if (eventType === "user.deleted") {
      const foundUser = await prisma.user.findUnique({
        where: {
          clerkId: user_id,
        },
      });

      if (!foundUser) {
        return new Response("Not Found.", { status: 404 });
      }

      await prisma.user.delete({
        where: {
          id: foundUser.id,
        },
      });

      return new Response("User deleted Successfully", { status: 200 });
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    if(error instanceof Prisma.PrismaClientKnownRequestError) {
      return new Response("Error processing webhook", { status: 500 });
    } else if(error instanceof Prisma.PrismaClientUnknownRequestError) {
      return new Response("Error processing webhook", { status: 500 });
    } else if(error instanceof Prisma.PrismaClientRustPanicError) {
      return new Response("Error processing webhook", { status: 500 });
    } else if(error instanceof Prisma.PrismaClientInitializationError) {
      return new Response("Error processing webhook", { status: 500 });
    } else if(error instanceof Prisma.PrismaClientValidationError) {
      return new Response("Error processing webhook", { status: 500 });
    }
    return new Response("Error processing webhook", { status: 500 });
  }
}
