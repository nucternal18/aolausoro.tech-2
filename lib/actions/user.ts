import prisma from "@lib/prismadb";

export async function getUser(clerkId: string) {
  return await prisma.user.findUnique({
    where: { clerkId },
  });
}
