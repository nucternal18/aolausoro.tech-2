import type { PayloadRequest } from "payload";
import { auth } from "@clerk/nextjs/server";
import { captureException } from "@sentry/nextjs";
import { getPayload } from "payload";
import config from "../../payload.config";

export async function authenticateWithClerk(
  req: PayloadRequest
): Promise<{ user: any }> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { user: null };
    }

    // Get payload instance
    const payload = await getPayload({ config });

    // Find or create user in database
    const userResult = await payload.find({
      collection: "users",
      where: {
        clerkId: {
          equals: userId,
        },
      },
    });

    let user = userResult.docs[0];

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

      user = await payload.create({
        collection: "users",
        draft: false,
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0].emailAddress,
          name: `${clerkUser.firstName} ${clerkUser.lastName}`,
          displayName: clerkUser.firstName,
          image: clerkUser.imageUrl,
          isAdmin: false,
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
        clerkId: user.clerkId,
        collection: "users",
      },
    };
  } catch (error) {
    console.error("Clerk authentication error:", error);
    captureException(error);
    return { user: null };
  }
}
