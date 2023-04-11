import bcrypt from "bcryptjs";

export default async function matchPassword(
  enteredPassword: string,
  password: string
) {
  return await bcrypt.compare(enteredPassword, password);
}
