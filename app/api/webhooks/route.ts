import { Webhook } from "svix";
import { headers } from "next/headers";
import type { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@lib/prismadb";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add the Clerk Webhook Secret to your environment variables.",
    );
  }

  // Get the headers
  const headerPayload = headers();
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

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const { id } = evt.data;
  const eventType = evt.type;

  // Save the webhook to your database
  if (eventType === "user.created") {
    const foundUser = await prisma.user.findUnique({
      where: {
        clerkId: evt.data.id,
      },
    });

    if (foundUser) {
      return new Response("User already exist.", { status: 404 });
    }

    await prisma.user.create({
      data: {
        clerkId: id,
        email: evt.data.email_addresses[0]?.email_address as string,
        image: evt.data.has_image ? evt.data.image_url : "",
        name: `${evt.data.first_name} ${evt.data.last_name}`,
        isAdmin: false,
      },
    });

    return new Response("User Created Successfully.", { status: 200 });
  }
  if (eventType === "user.updated") {
    const foundUser = await prisma.user.findUnique({
      where: {
        clerkId: id,
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
        email: evt.data.email_addresses[0]?.email_address,
        image: evt.data.has_image ? evt.data.image_url : foundUser.image,
        name: `${evt.data.first_name} ${evt.data.last_name}`,
      },
    });

    return new Response("User updated Successfully", { status: 200 });
  }
  if (eventType === "user.deleted") {
    const foundUser = await prisma.user.findUnique({
      where: {
        clerkId: id,
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
}
