import bcrypt from "bcryptjs";

export default async function matchPassword(
  enteredPassword: string,
  password: string
) {
  return bcrypt.compareSync(enteredPassword, password);
}
