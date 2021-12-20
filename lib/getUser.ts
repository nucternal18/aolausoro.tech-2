import { NEXT_URL } from "../config";
type SessionProps = {
  _id: string;
  image: string;
  name: string;
  email: string;
  isAdmin: boolean;
};
export default async function getUser(req): Promise<SessionProps> {
  try {
    const userRes = await fetch(`${NEXT_URL}/api/auth`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.cookie,
      },
    });
    const user = await userRes.json();
    return user;
  } catch (error) {
    throw new Error("Unable to fetch user: " + error.message);
  }
}
