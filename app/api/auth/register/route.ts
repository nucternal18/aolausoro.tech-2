import bcrypt from "bcryptjs";
import prisma from "lib/prismadb";
import { NextResponse } from "next/server";
import { partialUserSchema } from "schema/User";

export async function POST(request: Request) {
  const validation = partialUserSchema.safeParse(await request.json());

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  // const { displayName, password, email, isAdmin, image } = await request.json();

  // const userExist = await prisma.user.findUnique({ where: { email } });

  // if (userExist) {
  //   return new Response("User already exists", {
  //     status: 404,
  //   });
  // }

  // const hashedPassword = await bcrypt.hash(password, 12);

  // const user = await prisma.user.create({
  //   data: {
  //     name: displayName,
  //     email,
  //     password: hashedPassword,
  //     image: image,
  //     isAdmin,
  //   },
  // });
  // await prisma.$disconnect();

  // if (user) {
  //   return NextResponse.json({ message: "User created", success: true });
  // } else {
  //   return new Response("User not created", { status: 404 });
  // }

  return NextResponse.json({ message: "Route does not exist", success: true });
}
